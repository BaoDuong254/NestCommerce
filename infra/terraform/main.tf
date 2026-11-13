data "aws_caller_identity" "current" {}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

locals {
  name       = "nestcommerce"
  ssm_prefix = "/${local.name}"

  db_name = "nestcommerce"
  db_user = "postgres"

  env = merge({ for k, v in var.server_env : k => v if v != "" }, {
    NODE_ENV          = "production"
    PORT              = "3000"
    CLIENT_URL        = var.client_url
    DB_HOST           = "localhost"
    DB_PORT           = "5432"
    DB_USER           = local.db_user
    POSTGRES_PASSWORD = random_password.db.result
    DATABASE_URL      = "postgresql://${local.db_user}:${random_password.db.result}@localhost:5432/${local.db_name}?schema=public"
    REDIS_URL         = "redis://localhost:6379"
    S3_BUCKET_NAME    = aws_s3_bucket.media.bucket
    S3_REGION         = var.region
    S3_ACCESS_KEY     = aws_iam_access_key.media.id
    S3_SECRET_KEY     = aws_iam_access_key.media.secret
    TUNNEL_TOKEN      = data.cloudflare_zero_trust_tunnel_cloudflared_token.api.token
  })
  env_keys = nonsensitive(toset(keys(local.env)))

  secret = { for k in local.env_keys : k => { name = k, valueFrom = aws_ssm_parameter.env[k].arn } }

  logs = {
    for c in ["db", "redis", "server", "cloudflared"] : c => {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.this.name
        awslogs-region        = var.region
        awslogs-stream-prefix = c
      }
    }
  }
}

resource "random_password" "db" {
  length  = 32
  special = false
}

resource "aws_ssm_parameter" "env" {
  for_each = local.env_keys

  name  = "${local.ssm_prefix}/${each.key}"
  type  = "SecureString"
  value = local.env[each.key]
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${local.name}"
  retention_in_days = 7
}

resource "aws_iam_role" "execution" {
  name = "${local.name}-ecs-execution"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "execution" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "execution_ssm" {
  name = "read-ssm-params"
  role = aws_iam_role.execution.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["ssm:GetParameters"]
      Resource = "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter${local.ssm_prefix}/*"
    }]
  })
}

# No inbound rules: traffic arrives through the outbound Cloudflare Tunnel.
resource "aws_security_group" "task" {
  name        = "${local.name}-task"
  description = "NestCommerce task, egress only"
  vpc_id      = data.aws_vpc.default.id

  egress {
    description = "Image pulls, S3, Resend, Cloudflare Tunnel"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_cluster" "this" {
  name = local.name
}

resource "aws_ecs_task_definition" "this" {
  family                   = local.name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.execution.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name             = "db"
      image            = "postgres:17-alpine"
      essential        = true
      environment      = [{ name = "POSTGRES_DB", value = local.db_name }, { name = "POSTGRES_USER", value = local.db_user }]
      secrets          = [local.secret["POSTGRES_PASSWORD"]]
      logConfiguration = local.logs["db"]
      healthCheck = {
        command     = ["CMD-SHELL", "pg_isready -U ${local.db_user} -d ${local.db_name}"]
        interval    = 5
        timeout     = 5
        retries     = 10
        startPeriod = 10
      }
    },
    {
      name             = "redis"
      image            = "redis:8-alpine"
      essential        = true
      command          = ["redis-server", "--save", "", "--appendonly", "no"]
      logConfiguration = local.logs["redis"]
      healthCheck = {
        command     = ["CMD", "redis-cli", "ping"]
        interval    = 5
        timeout     = 5
        retries     = 10
        startPeriod = 5
      }
    },
    {
      name             = "server"
      image            = var.server_image
      essential        = true
      portMappings     = [{ containerPort = 3000, protocol = "tcp" }]
      secrets          = [for k in local.env_keys : local.secret[k] if !contains(["POSTGRES_PASSWORD", "TUNNEL_TOKEN"], k)]
      dependsOn        = [{ containerName = "db", condition = "HEALTHY" }, { containerName = "redis", condition = "HEALTHY" }]
      logConfiguration = local.logs["server"]
    },
    {
      name             = "cloudflared"
      image            = "cloudflare/cloudflared:2026.11.0"
      essential        = true
      command          = ["tunnel", "--no-autoupdate", "run"]
      secrets          = [local.secret["TUNNEL_TOKEN"]]
      dependsOn        = [{ containerName = "server", condition = "START" }]
      logConfiguration = local.logs["cloudflared"]
    },
  ])
}

resource "aws_ecs_service" "this" {
  name                               = local.name
  cluster                            = aws_ecs_cluster.this.id
  task_definition                    = aws_ecs_task_definition.this.arn
  launch_type                        = "FARGATE"
  desired_count                      = 0
  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent         = 100

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.task.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

# Media bucket
resource "aws_s3_bucket" "media" {
  bucket = "${local.name}-media-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_ownership_controls" "media" {
  bucket = aws_s3_bucket.media.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket                  = aws_s3_bucket.media.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "media" {
  bucket = aws_s3_bucket.media.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadObjects"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.media.arn}/*"
      },
      {
        Sid       = "DenyBucketDelete"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:DeleteBucket"
        Resource  = aws_s3_bucket.media.arn
      },
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.media]
}

resource "aws_s3_bucket_cors_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  cors_rule {
    allowed_methods = ["GET", "PUT"]
    allowed_origins = [var.client_url, "http://localhost:5173"]
    allowed_headers = ["*"]
    max_age_seconds = 3600
  }
}

resource "aws_iam_user" "media" {
  name = "${local.name}-media"
}

resource "aws_iam_user_policy" "media" {
  name = "media-bucket-rw"
  user = aws_iam_user.media.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:PutObject", "s3:GetObject", "s3:AbortMultipartUpload"]
      Resource = "${aws_s3_bucket.media.arn}/*"
    }]
  })
}

resource "aws_iam_access_key" "media" {
  user = aws_iam_user.media.name
}

# Cloudflare Tunnel: nestcommerce-api.<zone> -> cloudflared sidecar -> localhost:3000
resource "cloudflare_zero_trust_tunnel_cloudflared" "api" {
  account_id = var.cloudflare_account_id
  name       = "${local.name}-aws"
  config_src = "cloudflare"
}

resource "cloudflare_zero_trust_tunnel_cloudflared_config" "api" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.api.id

  config = {
    ingress = [
      { hostname = var.api_hostname, service = "http://localhost:3000" },
      { service = "http_status:404" },
    ]
  }
}

data "cloudflare_zero_trust_tunnel_cloudflared_token" "api" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.api.id
}

resource "cloudflare_dns_record" "api" {
  zone_id = var.cloudflare_zone_id
  name    = var.api_hostname
  type    = "CNAME"
  ttl     = 1
  proxied = true
  content = "${cloudflare_zero_trust_tunnel_cloudflared.api.id}.cfargotunnel.com"
}
