package com.example.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().info(new Info()
                .title("海龟汤后端接口文档")
                .description("Spring Boot backend API docs for game service")
                .version("v1.0.0")
                .contact(new Contact().name("Backend Team").email("backend@example.com"))
                .license(new License().name("Internal Use")));
    }
}

