package com.attia12.userservice.model;

import com.attia12.userservice.UserRepository;
import com.attia12.userservice.interceptor.KeycloakRoleAssigner;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSynchronizer {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final KeycloakRoleAssigner roleAssigner;

    public void synchronizeWithIdp(Jwt token) {
        log.info("Synchronizing user with idp");
        getUserEmail(token).ifPresent(userEmail -> {
            log.info("Synchronizing user having email {}", userEmail);
            Optional<User> optUser = userRepository.findByEmail(userEmail);
            User user = userMapper.fromTokenAttributes(token.getClaims());
            optUser.ifPresent(value -> user.setId(value.getId()));
            // Check if user is admin in Keycloak
            boolean isAdmin = hasAdminRole(token);

            user.setRole(isAdmin ? "ADMIN" : "CLIENT");

            userRepository.save(user);
            if (!isAdmin) {
                String keycloakUserId = token.getSubject(); // same as user id in Keycloak
                roleAssigner.assignClientRoleToUser(keycloakUserId, "client");
            }

        });

    }

    private Optional<String> getUserEmail(Jwt token) {
        Map<String, Object> attributes = token.getClaims();
        if (attributes.containsKey("email")) {
            return Optional.of(attributes.get("email").toString());
        }
        return Optional.empty();

    }
    private boolean hasAdminRole(Jwt token) {
        var resourceAccess = (Map<String, Object>) token.getClaim("resource_access");
        var clientAccess = (Map<String, Object>) resourceAccess.get("micro-services-api");
        if (clientAccess == null) return false;
        var roles = (List<String>) clientAccess.get("roles");
        return roles != null && roles.contains("admin");
    }
}