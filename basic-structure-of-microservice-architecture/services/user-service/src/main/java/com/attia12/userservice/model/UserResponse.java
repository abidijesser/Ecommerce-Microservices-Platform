package com.attia12.userservice.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;

}
