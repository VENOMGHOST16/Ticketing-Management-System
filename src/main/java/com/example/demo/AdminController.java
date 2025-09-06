package com.example.demo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.AgentDTO;
import com.example.demo.entity.Role;
import com.example.demo.entity.Ticket;
import com.example.demo.entity.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CreateUserRequest;
import com.example.demo.service.TicketService;
import com.example.demo.service.UpdateTicketRequest;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    	@Autowired
    	private RoleRepository roleRepository;
    	
    	
    	@Autowired
    	private TicketService ticketService;
    	
    	
    	@PostMapping("/users")
    	public ResponseEntity<Map<String, Object>> addUser(@RequestBody User user) {
    	    System.out.println("Entering the adduser");

    	    Map<String, Object> response = new HashMap<>();

    	    // 🔹 Check if email already exists
    	    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
    	        response.put("success", false);
    	        response.put("message", "User with email " + user.getEmail() + " already exists");
    	        return ResponseEntity.badRequest().body(response);
    	    }

    	    // 🔹 Find existing role by roleName
    	    Role role = roleRepository.findByRoleName(user.getRole().getRoleName())
    	            .orElseThrow(() -> new RuntimeException("Role not found: " + user.getRole().getRoleName()));

    	    // 🔹 Attach role and save user
    	    user.setRole(role);
    	    User savedUser = userRepository.save(user);

    	    response.put("success", true);
    	    response.put("message", "User created successfully");
    	    response.put("user", savedUser);

    	    return ResponseEntity.ok(response);
    	}
    	
    	@GetMapping("/sendAllUsers")
        public List<User> sendAllUsers() {
            return userRepository.findAll();
        }
    	
    	@GetMapping("/alltickets")
        public ResponseEntity<List<Ticket>> getAllTickets() {
            List<Ticket> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(tickets);
        }
    	
    	// In AdminController.java
    	@DeleteMapping("/deleteUser/{id}")
    	public ResponseEntity<String> deleteUser(@PathVariable Long id) {
    	    try {
    	        userRepository.deleteById(id);
    	        return ResponseEntity.ok("User with ID " + id + " deleted successfully.");
    	    } catch (Exception e) {
    	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    	                             .body("Error deleting user with ID " + id);
    	    }
    	}
    	
    	/*
    	public ResponseEntity<?> addUser(@RequestBody User user) {

    		System.out.println("Entering the adduser");
    	    // 🔹 Check if email already exists
    	    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
    	        return ResponseEntity
    	                .badRequest()
    	                .body("User with email " + user.getEmail() + " already exists");
    	    }

    	    // 🔹 Find existing role by roleName
    	    Role role = roleRepository.findByRoleName(user.getRole().getRoleName())
    	            .orElseThrow(() -> new RuntimeException("Role not found: " + user.getRole().getRoleName()));

    	    // 🔹 Attach existing role to user
    	    user.setRole(role);

    	    // 🔹 Save only user
    	    userRepository.save(user);

    	    return ResponseEntity.ok("User created successfully");
    	}*/


    	@GetMapping("/getAllAgents")
    	public List<AgentDTO> getAllAgents() {
    	    List<AgentDTO> agents= userRepository.findByRoleRoleName("ROLE_AGENT")
    	                         .stream()
    	                         .map(user -> new AgentDTO(user.getId(), user.getName(), user.getEmail()))
    	                         .toList();
    	    return agents;
    	}

    @GetMapping("/check")
    public String check(Authentication auth) {
        return "Hello " + auth.getName() + " with roles " + auth.getAuthorities();
    }
     
    
    
    @PutMapping("/updateTicket/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long id,
            @RequestBody UpdateTicketRequest request) {

        Ticket updatedTicket = ticketService.updateTicket(id, request.getStatus(), request.getAssignedAgentId());
        return ResponseEntity.ok(updatedTicket);
    }
}

