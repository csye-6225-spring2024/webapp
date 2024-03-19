project_id          = "tf-gcp-infra-414023"
source_image_family = var.source_image_family
zone                = var.zone
network             = var.network
ssh_username        = var.ssh_username
image_name          = " $ { var.image_name } - $ { local.timestamp } "