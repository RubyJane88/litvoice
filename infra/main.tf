resource "azurerm_resource_group" "main" {
  name     = "${var.app_name}-${var.environment}-rg"
  location = var.location

  tags = {
    app         = var.app_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

