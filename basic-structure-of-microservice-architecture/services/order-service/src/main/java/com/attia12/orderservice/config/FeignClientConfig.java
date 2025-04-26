package com.attia12.orderservice.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@Configuration
public class FeignClientConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (!(authentication instanceof JwtAuthenticationToken jwtAuth)) {
                System.out.println("❌ No valid token found in Security Context!");
                return;
            }

            String token = jwtAuth.getToken().getTokenValue();
            System.out.println("🔹 Feign Client added Authorization header: Bearer " + token);
            requestTemplate.header("Authorization", "Bearer " + token);
        };
    }
}