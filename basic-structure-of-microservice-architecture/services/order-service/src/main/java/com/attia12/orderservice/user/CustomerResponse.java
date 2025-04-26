package com.attia12.orderservice.user;

public record CustomerResponse(
        String id,
        String firstname,
        String lastname,
        String email
) {

}
