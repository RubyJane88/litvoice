resource "azurerm_cognitive_account" "speech" {
  name                = "${var.app_name}-${var.environment}-speech"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  kind                = "SpeechServices"
  sku_name            = "S0"

  tags = {
    app         = var.app_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

resource "azurerm_role_assignment" "aks_speech_user" {
  principal_id         = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
  role_definition_name = "Cognitive Services Speech User"
  scope                = azurerm_cognitive_account.speech.id
}

