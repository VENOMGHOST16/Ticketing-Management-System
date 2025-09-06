package com.example.demo.repository;

import com.example.demo.entity.TicketThread;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketThreadRepository extends JpaRepository<TicketThread, Long> {
    List<TicketThread> findByTicketId(Long ticketId);
}
