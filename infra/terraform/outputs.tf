output "cluster" {
  value = aws_ecs_cluster.this.name
}

output "service" {
  value = aws_ecs_service.this.name
}

output "log_group" {
  value = aws_cloudwatch_log_group.this.name
}

output "media_bucket" {
  value = aws_s3_bucket.media.bucket
}

output "media_access_key" {
  value = aws_iam_access_key.media.id
}

output "media_secret_key" {
  value     = aws_iam_access_key.media.secret
  sensitive = true
}

output "api_url" {
  value = "https://${var.api_hostname}"
}
