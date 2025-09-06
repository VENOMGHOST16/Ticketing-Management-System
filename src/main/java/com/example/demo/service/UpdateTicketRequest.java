// dto/UpdateTicketRequest.java
package com.example.demo.service;

public class UpdateTicketRequest {
    private String status;
    private Long assignedAgentId; // null if unassigned

    // getters + setters
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Long getAssignedAgentId() {
        return assignedAgentId;
    }
    public void setAssignedAgentId(Long assignedAgentId) {
        this.assignedAgentId = assignedAgentId;
    }
}
