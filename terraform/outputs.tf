output "security_group_id" {
  value = module.security_group.sg_id
}

output "ec2_id" {
  value = module.ec2.id
}

output "ec2_public_ip" {
  value = module.ec2.public_ip
}

output "s3_bucket_name" {
  value = module.s3.bucket_name
}

output "s3_bucket_arn" {
  value = module.s3.bucket_arn
}

output "rds_endpoint" {
  value = module.rds.endpoint
}
