package com.inscribe.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiDocsConfig {

    @Bean
    public OpenAPI inscribeOpenApi() {
        return new OpenAPI().info(
                new Info()
                        .title("Inscribe Backend API")
                        .version("v1")
                        .description("Production API documentation for Inscribe backend services")
        );
    }
}

