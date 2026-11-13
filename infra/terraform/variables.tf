variable "region" {
  type    = string
  default = "ap-southeast-1"
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
  default   = null
}

variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_zone_id" {
  type = string
}

variable "api_hostname" {
  type    = string
  default = "nestcommerce-api.duonggiabao.com"
}

variable "client_url" {
  description = "Origin allowed by CORS (CLIENT_URL); the Cloudflare Worker serving the client"
  type        = string
  default     = "https://nestcommerce.duonggiabao.com"
}

variable "server_image" {
  description = "Public image pulled on every task start, e.g. <dockerhub-user>/nestcommerce-server:latest"
  type        = string
}

variable "server_env" {
  description = "App secrets from server/.env.example (JWT, ADMIN_*, RESEND, GOOGLE_*, ...). S3_*, DATABASE_URL, REDIS_URL, PORT, NODE_ENV, CLIENT_URL, DB_* are set by this stack."
  type        = map(string)
  sensitive   = true
}

variable "task_cpu" {
  type    = number
  default = 1024
}

variable "task_memory" {
  type    = number
  default = 2048
}
