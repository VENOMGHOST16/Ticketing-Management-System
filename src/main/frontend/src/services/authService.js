// Dummy login service for now.
// Later, replace with API calls to Spring Boot backend.
/*
export async function login(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "test@example.com" && password === "password") {
        resolve({
          success: true,
          user: { email, role: "USER" }
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
}*/
/*
export async function login(email, password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    if (data.success) {
      return { success: true, user: { email: data.email, role: data.role } };
    } else {
      throw new Error(data.message || "Invalid credentials");
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
*/
// src/services/authService.js

// src/services/auth.js

export async function login(email, password) {
  try {
    console.log("🔹 Sending credentials:", email, password);

    
    const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });
    console.log(import.meta.env.VITE_SPRINGBOOT_API_URL);

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    // ✅ parse JSON once
    const data = await response.json();
    console.log("✅ Response received from backend:", data);

    if (data.success) {
      // return structured info to frontend
      return {
        email: data.email,
        roles: data.roles,
        success: data.success,
        userid: data.userid // matches your LoginController
      };
    } else {
      throw new Error(data.message || "Invalid email or password");
    }
  } catch (err) {
    console.error("❌ Login error:", err.message);
    throw err;
  }
}




export async function addUser(name, email, password, role) {
  try {
    console.log("🔹 Adding user:", name, email, role,password);
    console.log(JSON.stringify({ name, email, password, role }))
    const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  name,
  email,
  password,
  role: { roleName: role }   // wrap inside an object
}),
      credentials:"include" 
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ User saved:", data);

    return data;
  } catch (err) {
    console.error("❌ Add User error:", err.message);
    throw err;
  }
}

// authService.js

export async function getAllUsers() {
  try {
    console.log("🔹 Fetching all users...");

    const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/admin/sendAllUsers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"  // important for session/cookies if using Spring Security
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users. Status: " + response.status);
    }

    const users = await response.json();
    console.log("✅ Retrieved users:", users);
    return users;

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    throw error;
  }
}

export async function deleteUser(userId) {
  const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/admin/deleteUser/${userId}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!response.ok) throw new Error("Failed to delete user");
  return true;
}

// authservice.js

export async function createTicket({ subject, description, priority}) {
  try {
    console.log("🎫 Creating ticket:", subject, description, priority);

    const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/user/createticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // if you are using cookies/session
      body: JSON.stringify({
  title: subject,        // map subject → title
  "description":description,
  priorityLevel: priority       // or make this dynamic from UI
})
,
    });

    if (!response.ok) {
      throw new Error("❌ Failed to create ticket");
    }

    const data = await response.json();
    console.log("✅ Ticket created successfully:", data);
    return data;

  } catch (error) {
    console.error("⚠️ Error while creating ticket:", error);
    throw error;
  }
}


// authService.js
export async function getUserTickets() {
  const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/user/usertickets`, {
    method: "GET",
    credentials: "include", // important so session cookie (JSESSIONID) is sent
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return await response.json();
}

export async function getAllUserTickets() {
  const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/admin/alltickets`, {
    method: "GET",
    credentials: "include", 
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }
  const data=await response.json();
  return data;
}





export const getAllAgents = async () => {
  const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_API_URL}/api/admin/getAllAgents`, {
    method: "GET",
    credentials:"include",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve agents");
  }
  const data=await response.json();
  console.log(data);
  return data;
};

