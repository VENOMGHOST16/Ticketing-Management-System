package com.example.demo.service;

public class TicketUpdateRequest {
    private String status;
    private Long agentId;  // we’ll assign ticket to agent by ID
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Long getAgentId() {
		return agentId;
	}
	public void setAgentId(Long agentId) {
		this.agentId = agentId;
	}

    
}
