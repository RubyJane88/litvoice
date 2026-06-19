variable "location" {
  description = "Azure region for all resources."
  type        = string
  default     = "australiaeast"
}

variable "app_name" {
  description = "Short name used as a prefix for all resources."
  type        = string
  default     = "litvoice"
}

variable "environment" {
  description = "Deployment environment (prod, staging)."
  type        = string
  default     = "prod"
}

variable "node_count" {
  description = "Number of nodes in the AKS default node pool."
  type        = number
  default     = 2
}

variable "node_vm_size" {
  description = "VM size for AKS nodes."
  type        = string
  default     = "Standard_B2s"
}

