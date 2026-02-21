package com.inscribe.backend;

import com.inscribe.backend.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class InscribeBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(InscribeBackendApplication.class, args);
    }

}
