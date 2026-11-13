# NestCommerce infra

```text
Browser ──► Cloudflare Worker (static assets)
   │          nestcommerce.duonggiabao.com        SPA
   │          nestcommerce.duonggiabao.com/docs   Swagger UI (static, reads /openapi.json)
   └─ API ──► nestcommerce-api.duonggiabao.com ─► Cloudflare Tunnel ─► ECS Fargate task
                                                                        ├─ server       (Docker Hub image)
                                                                        ├─ postgres:17  (sidecar)
                                                                        ├─ redis:8      (sidecar)
                                                                        └─ cloudflared  (tunnel connector)
```

## Components

| Layer | Service | Notes |
| ----- | ------- | ----- |
| Client | Cloudflare Workers static assets | Assets-only Worker (`client/wrangler.jsonc`), SPA fallback, custom domain. Always on. |
| API docs | Swagger UI on the same Worker | OpenAPI spec exported at build time (`server/scripts/export-openapi.ts`), so docs stay readable while the API is off. |
| API | ECS Fargate, 1 task (1 vCPU / 2 GB) | Service scaled between 0 and 1; off by default. |
| Database | Postgres sidecar | Ephemeral; the server entrypoint migrates and seeds on every start. |
| Cache / queue | Redis sidecar | Ephemeral, `noeviction` (BullMQ). |
| Ingress | Cloudflare Tunnel | `cloudflared` sidecar dials out to Cloudflare; DNS CNAME points the API hostname at the tunnel. |
| Media | S3 bucket `nestcommerce-media-<account>` | Public-read objects (the API returns direct S3 URLs), CORS PUT for presigned browser uploads, IAM user scoped to the bucket. Bucket policy denies `DeleteBucket` outside Terraform. |
| Secrets | SSM Parameter Store (`/nestcommerce/*`) | Injected into containers by the ECS execution role. |
| Logs | CloudWatch `/ecs/nestcommerce` | 7-day retention. |

## Design choices

- **No ALB, NAT gateway, RDS, ElastiCache or ECR.** The task runs in the default VPC with a public IP and a security group with **no inbound rules**; all traffic enters through the outbound tunnel. With the service at 0 tasks the stack costs ≈ $0.
- **Sidecars share `localhost`** (awsvpc network mode), so the server reaches Postgres, Redis and is reached by `cloudflared` without service discovery.
- **Image from Docker Hub `:latest`**, pulled on every task start; no registry or deploy credentials needed in AWS.

## Code layout

```text
infra/
├── Taskfile.yml             operational commands (pinned to the `nestcommerce` AWS profile)
└── terraform/               single stack: AWS (ECS, IAM, SSM, logs, SG) + Cloudflare (tunnel, DNS)
    ├── versions.tf          providers, S3 backend (key nestcommerce/terraform.tfstate)
    ├── variables.tf
    ├── main.tf
    ├── outputs.tf
    └── terraform.tfvars.example
```

## CI/CD

`.github/workflows/deploy.yml`, on green CI on `main`:

1. Build and push the server image to Docker Hub.
2. Build the client, export the OpenAPI spec into `client/dist/openapi.json`, deploy `client/` to Cloudflare Workers.

`.github/workflows/ci.yml` runs `terraform fmt -check` and `validate` on `infra/terraform`.
