package com.example.demo.repository;

import com.example.demo.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);
    List<Ticket> findByAssignedAgentId(Long agentId);
}
