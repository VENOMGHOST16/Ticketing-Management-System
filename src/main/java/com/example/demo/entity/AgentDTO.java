package com.example.demo.entity;

public class AgentDTO {
	private Long id;
	private String name;
	private String email;

    public AgentDTO(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}
