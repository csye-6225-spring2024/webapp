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
  default = "tf-gcp-infra-415001"
}
 
variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}
 
variable "zone" {
  type    = string
  default = "us-east1-b"
}
 
variable "ssh_username" {
  type    = string
  default = "centos"
}
 
variable "network" {
  type    = string
  default = "default"
}
 
variable "image_name" {
  type    = string
  default = "custom-image-10"
}
 
variable DB_USER {
  type    = string
  default = env("DB_USER")
}
 
variable DB_PASSWORD {
  type    = string
  default = env("DB_PASSWORD")
}
 
variable DB {
  type    = string
  default = env("DB")
}
 
 
locals {
timestamp = regex_replace(formatdate("YYYY-MM-DD-hh-mm-ss", timestamp()), "[- TZ:]", "")
}
 
source "googlecompute" "custom-image" {
  project_id   = var.GCP_PROJECT_ID
  source_image_family = var.source_image_family
  zone         = var.zone
  network      = var.network
  ssh_username = var.ssh_username  
  image_name   = "${var.image_name}-${local.timestamp}"
    
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
    environment_vars = [
      "DB_USER=${var.DB_USER}",
      "DB_PASSWORD=${var.DB_PASSWORD}",
      "DB=${var.DB}"
 
    ]
  }
  provisioner "shell" {
     script = "packer-config/create_user.sh"
  }
 
   provisioner "shell" {
     script = "packer-config/configure_systemd.sh"
  }
 
 