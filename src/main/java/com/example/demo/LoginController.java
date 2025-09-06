// src/main/java/com/example/demo/controller/AuthController.java

package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData,
                                     HttpServletRequest request) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Authenticate
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            // 2. Save authentication into SecurityContext
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);
            // 3. Force session creation (so JSESSIONID is issued)
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            
            System.out.println("Created session ID: " + session.getId());
            
            UserDetails user = (UserDetails) authentication.getPrincipal();

            response.put("success", true);
            response.put("email", user.getUsername());
            String role = user.getAuthorities().iterator().next().getAuthority();
            System.out.println("✅ Login success. Session ID = " + session.getId());
            response.put("roles", role);
            
            
            User userEntity = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            response.put("userid", userEntity.getId());
            

        } catch (AuthenticationException e) {
        	response.put("success", false);
            response.put("message", "Invalid email or password");
            System.out.println("❌ Login failed for: " + email);
        }

        return response;
    }
}


/*
package com.example.demo;

import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class LoginController {

	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        System.out.println(email+" "+password);
        Map<String, Object> response = new HashMap<>();

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            UserDetails user = (UserDetails) auth.getPrincipal();
            System.out.println(email+" "+password+"inside try catch loginc");
            
            response.put("success", true);
            response.put("email", user.getUsername());
            List<String> roles = user.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .toList();

            response.put("roles", roles.get(0));

            System.out.println(response);
        } catch (AuthenticationException e) {
        	System.out.println("exception");
            response.put("success", false);
            response.put("message", "Invalid email or password");
        }
        
        
        List<Customer> customers = customerRepository.findAll();
        System.out.println(customers);

        
        System.out.println(email+" "+password+"outside");
        
        return response;
    }
}
/*
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // React dev server
public class LoginController {

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // 🔹 Hardcoded user check (replace later with DB check + security)
        if ("test@example.com".equals(request.getEmail()) &&
            "password".equals(request.getPassword())) {
            return new LoginResponse(true, "Login successful", request.getEmail(), "USER");
        }
        return new LoginResponse(false, "Invalid credentials", null, null);
    }
}*/



// src/main/java/com/example/demo/controller/LoginController.java


/*  the one causing error just now



package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData,
                                     HttpServletRequest request) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        Map<String, Object> response = new HashMap<>();

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
            request.getSession(true);

            UserDetails user = (UserDetails) auth.getPrincipal();

            response.put("success", true);
            response.put("email", user.getUsername());

            // ✅ return string role instead of Role object
            String role = user.getAuthorities().iterator().next().getAuthority();
            response.put("roles", role);

        } catch (AuthenticationException e) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
        }

        return response;
    }

}*/
