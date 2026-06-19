output "resource_group_name" {
  description = "Name of the Azure resource group."
  value       = azurerm_resource_group.main.name
}

output "acr_login_server" {
  description = "ACR login server URL — use this in your CI/CD docker push command."
  value       = azurerm_container_registry.main.login_server
}

output "aks_cluster_name" {
  description = "AKS cluster name — use with: az aks get-credentials --name <value>"
  value       = azurerm_kubernetes_cluster.main.name
}

output "key_vault_uri" {
  description = "Key Vault URI for storing and retrieving secrets."
  value       = azurerm_key_vault.main.vault_uri
}

output "speech_endpoint" {
  description = "Azure Cognitive Services Speech endpoint."
  value       = azurerm_cognitive_account.speech.endpoint
}

output "static_web_app_url" {
  description = "Default hostname for the React frontend."
  value       = azurerm_static_web_app.main.default_host_name
}

