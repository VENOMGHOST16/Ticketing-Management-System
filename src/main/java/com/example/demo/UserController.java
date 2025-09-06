package com.example.demo;

import com.example.demo.entity.Ticket;
import com.example.demo.entity.User;
import com.example.demo.repository.TicketRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CreateTicketRequest;
import com.example.demo.service.TicketService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserController {   

	@Autowired
	private UserRepository userRepository;
	
    @Autowired
    private TicketService ticketService;
    
    @Autowired
    private TicketRepository ticketRepository;

    // POST mapping to create ticket
    @PostMapping("/createticket")
    public ResponseEntity<?> createTicket(@RequestBody CreateTicketRequest request) {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();      
    	
    	User user = userRepository.findByEmail(email)
                     .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = new Ticket(); 
        ticket.setUser(user);
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriorityLevel(request.getPriorityLevel());
        ticket.setStatus("OPEN"); // default

        Ticket saved = ticketRepository.save(ticket);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/usertickets")
    public ResponseEntity<?> getUserTickets(Authentication authentication) {
        String email = authentication.getName(); // logged-in user's email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(ticketRepository.findByUserId(user.getId()));
    }



}
