package com.inscribe.backend.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class UpdateProfileRequest {

    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String bio;

    @URL
    @Size(max = 2000)
    private String avatar;
}
