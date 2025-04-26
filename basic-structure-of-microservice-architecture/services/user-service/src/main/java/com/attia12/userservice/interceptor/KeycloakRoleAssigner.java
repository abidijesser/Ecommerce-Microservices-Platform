package com.attia12.userservice.interceptor;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakRoleAssigner {
    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    @Value("${keycloak.admin-client-id}")
    private String adminClientId;

    @Value("${keycloak.client-id}")
    private String appClientId;

    private Keycloak keycloak;
    @PostConstruct
    public void init() {
        keycloak = KeycloakBuilder.builder()
                .serverUrl(authServerUrl)
                .realm("master")
                .username(adminUsername)
                .password(adminPassword)
                .clientId(adminClientId)
                .grantType(OAuth2Constants.PASSWORD)
                .build();
    }

    public void assignClientRoleToUser(String userId, String roleName) {
        var realmResource = keycloak.realm(realm);
        var client = realmResource.clients().findByClientId(appClientId).get(0);
        var role = realmResource.clients().get(client.getId())
                .roles().get(roleName).toRepresentation();

        realmResource.users()
                .get(userId)
                .roles()
                .clientLevel(client.getId())
                .add(List.of(role));
    }

    public void deleteUserFromKeycloak(String userId) {
        var realmResource = keycloak.realm(realm);
        try {
            realmResource.users().get(userId).remove();
            System.out.println("User deleted from Keycloak: " + userId);
        } catch (Exception e) {
            throw new RuntimeException(" Failed to delete user from Keycloak: " + e.getMessage(), e);
        }
    }
}
