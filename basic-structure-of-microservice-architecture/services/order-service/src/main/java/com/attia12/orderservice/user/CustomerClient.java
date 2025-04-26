package com.attia12.orderservice.user;


import com.attia12.orderservice.config.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Optional;

@FeignClient(
        name = "user-service",
        url = "${application.config.user-url}",
        configuration = FeignClientConfig.class

)

public interface CustomerClient {
@GetMapping("/{id}")
    Optional<CustomerResponse> getUserById(@PathVariable("id") String id);
}