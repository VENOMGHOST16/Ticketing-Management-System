# 🎫 Ticketing Management System  

🌐 **Live Demo:** [Frontend on Netlify](https://your-frontend-link.netlify.app)  

---

## 📌 Overview  
The **Ticketing Management System** is a full-stack web application that enables users to raise, manage, and track support tickets.  
It provides **role-based dashboards** for users and admins, with features for ticket creation, assignment, status updates, and filtering.  

Built with **React (frontend)**, **Spring Boot (backend)**, and **PostgreSQL (Neon Database)**, the system is containerized with **Docker** and deployed using **Render** (backend) and **Netlify** (frontend).  

---

## 🚀 Features  
- User authentication & session handling  
- Raise and track support tickets  
- Admin dashboard with:  
  - View all tickets  
  - Assign tickets to agents  
  - Change ticket status and priority  
- Ticket filtering by user, status, and title  
- Responsive, modern UI with Tailwind CSS  

---

## 🛠 Tech Stack  
- **Frontend:** React, Tailwind CSS, Netlify  
- **Backend:** Spring Boot, Java, REST APIs, Render  
- **Database:** PostgreSQL (NeonDB Cloud)  
- **Containerization:** Docker  

---

## ⚙️ Deployment  
1. **Frontend:** Deployed on **Netlify**  
2. **Backend:** Dockerized and deployed on **Render**  
3. **Database:** Hosted on **NeonDB (Postgres Cloud)**  

---

## 🖥️ System Architecture  

```mermaid
flowchart LR
    User[👤 User / Admin] -->|Browser| Frontend[React + Netlify]
    Frontend -->|REST API Calls| Backend[Spring Boot + Render]
    Backend -->|JDBC| Database[(PostgreSQL - NeonDB)]
