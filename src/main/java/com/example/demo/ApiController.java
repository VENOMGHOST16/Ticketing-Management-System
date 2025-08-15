package com.example.demo;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {
    @GetMapping("/api/hello")
    public String apiHello() {
        return "Hello from Spring Boot API";
    }

    @PostMapping("/api/count")
    public void receiveCount(@RequestBody Map<String, String> body) {
        String count = body != null ? body.get("count") : null;
        System.out.println("Received count: " + count);
    }
}