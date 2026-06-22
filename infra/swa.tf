resource "azurerm_static_web_app" "main" {
  name                = "${var.app_name}-${var.environment}-swa"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = {
    app         = var.app_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

