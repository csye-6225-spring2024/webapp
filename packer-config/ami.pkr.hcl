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
  default = "learned-balm-411817"
}

variable "source_image" {
  type    = string
  default = "centos-stream-8-v20240110"
}

variable "zone" {
  type    = string
  default = "us-central1-a"
}

variable "ssh_username" {
  type    = string
  default = "centos"
}

variable "image_name" {
  type    = string
  default = "my-custom-image22"
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
    source      = "/Users/anushasenthilnathan/Desktop/cl/Assignment 3/webapp.zip"
    destination = "/tmp/"
  }

  provisioner "shell" {
    script = "./packer-config/install_mysql.sh"
  }

  // provisioner "shell" {
  //   script = "create_user.sh"
  // }

  // provisioner "shell" {
  //   script = "install_dependencies.sh"
  // }

  provisioner "shell" {
     script = "./packer-config/install.sh"
  }


}