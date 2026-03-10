package com.inscribe.backend.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AuthRequest {

    @Email
    @NotBlank
    @Size(max = 150)
    private String email;

    @NotBlank
    @Size(min = 8, max = 72)
    private String password;
}
