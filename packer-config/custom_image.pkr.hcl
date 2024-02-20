
packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}
 
variable "GCP_PROJECT_ID" {
  type    = string
  default = "ancient-vortex-411817"
}
 
variable "source_image" {
  type    = string
  default = "centos-stream-8-v20240110"
}
 
variable "zone" {
  type    = string
  default = "us-east1-b"
}
 
variable "ssh_username" {
  type    = string
  default = "centos"
}
 
variable "image_name" {
  type    = string
  default = "custom-image"
}
 
source "googlecompute" "custom-image" {
  project_id   = var.GCP_PROJECT_ID
  source_image = var.source_image
  zone         = var.zone
  ssh_username = var.ssh_username
  image_name   = var.image_name
}
 
build {
  name    = "custom-image-builder"
  sources = ["source.googlecompute.custom-image"]
 
  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp/webapp.zip"
    destination = "webapp.zip"
  }
  provisioner "file" {
    source      = "packer-config/webapp.service"
    destination = "/tmp/webapp.service"
  }
  provisioner "shell" {
    script = "packer-config/install_dependencies.sh"
  }
  provisioner "shell" {
     script = "packer-config/create_user.sh"
  }

   provisioner "shell" {
     script = "packer-config/configure_systemd.sh"
  }
 
 
}
