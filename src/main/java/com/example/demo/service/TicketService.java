package com.example.demo.service;

import com.example.demo.entity.Ticket;
import com.example.demo.entity.User;
import com.example.demo.repository.TicketRepository;
import com.example.demo.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public Ticket createTicket(Ticket ticket) {
        // Ensure valid user is attached
        if (ticket.getUser() != null && ticket.getUser().getId() != null) {
            User user = userRepository.findById(ticket.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            ticket.setUser(user);
        }

        return ticketRepository.save(ticket);
    }
    
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    public Ticket updateTicket(Long ticketId, TicketUpdateRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
        }

        if (request.getAgentId() != null) {
            User agent = userRepository.findById(request.getAgentId())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));
            ticket.setAssignedAgent(agent);
        }

        return ticketRepository.save(ticket);
    }
    
    
    public Ticket updateTicket(Long ticketId, String status, Long agentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Update status
        ticket.setStatus(status);

        // Update assigned agent
        if (agentId != null) {
            User agent = userRepository.findById(agentId)
                    .orElseThrow(() -> new RuntimeException("Agent not found"));
            ticket.setAssignedAgent(agent);
        }

        return ticketRepository.save(ticket);
    }
}
