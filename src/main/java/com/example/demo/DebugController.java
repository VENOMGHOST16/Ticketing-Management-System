package com.example.demo;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DebugController {

    @GetMapping("/api/whoami")
    public Object whoAmI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth;
    }
}
