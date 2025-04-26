package com.attia12.userservice.services;

import com.attia12.userservice.UserRepository;
import com.attia12.userservice.interceptor.KeycloakRoleAssigner;
import com.attia12.userservice.model.User;
import com.attia12.userservice.model.UserMapper;
import com.attia12.userservice.model.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final KeycloakRoleAssigner keycloakRoleAssigner;

    public List<UserResponse> findAllUsersExceptAdmin(Authentication connectedUser) {
        return userRepository.findAll().stream()
                .filter(user -> !"ADMIN".equalsIgnoreCase(user.getRole()))
                .map(userMapper::toUserResponse)
                .toList();
    }

    public UserResponse findUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        return userMapper.toUserResponse(user);
    }

    public void deleteUser(String userId) {
        // 1. Delete from Keycloak
        keycloakRoleAssigner.deleteUserFromKeycloak(userId);


        userRepository.deleteById(userId);
    }
}
