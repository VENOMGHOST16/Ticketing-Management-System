# spring-sarv

A full-stack Spring Boot + React demo project. Backend is Java (Spring Boot), frontend is React (Vite).

## spring-sarv — tutorial-style README

This repository is a full-stack demo: Spring Boot backend (Java) + React frontend (Vite).

This README explains, step-by-step, how to develop locally (Eclipse for the backend, VS Code or any editor for the frontend), how the dev-time proxy works, and how to produce a production build that Spring Boot serves.

Checklist (what this doc covers)
- Prerequisites and cloning the repo
- Run backend in Eclipse (dev) with step-by-step actions
- Create new backend routes (example controller)
- Run frontend (Vite) in any editor and use the proxy to reach backend
- Test proxying and common dev gotchas (StrictMode, preflight)
- Build for production and serve the React bundle with Spring Boot

---

## 1) Prerequisites
- Java 17+ (JDK)
- Node.js 18+ and npm
- Git
- Maven (we use the included `mvnw.cmd` wrapper)
- Eclipse (with Maven/Java support) for backend development
- VS Code or any editor for frontend development

Confirm versions in PowerShell:
```powershell
java -version
node -v
npm -v
```

## 2) Clone the repo
From PowerShell (or Git Bash):
```powershell
git clone https://github.com/itzrnvr/springb-react-eclipse-t.git
cd springb-react-eclipse-t
```

## 3) Backend — run & develop in Eclipse (dev mode)

1. Open **Eclipse**.
2. Import the project: **File > Import... > Existing Maven Projects** → browse to the cloned project root → **Finish**.
3. Wait for Maven dependencies to download (progress shows in the bottom-right status bar; red errors should disappear once done).
4. In the **Package Explorer**, expand: `spring-sarv > src > main > java > com > example > demo`.
5. Open the file `SpringSarvApplication.java` (this is the entry point annotated with `@SpringBootApplication`).
6. Run it:
  - If you have Spring Tools (STS) installed: right‑click the file → **Run As > Spring Boot App**.
  - Otherwise: right‑click the file → **Run As > Java Application**.
7. Eclipse Console should display Spring Boot startup logs. Look for: `Tomcat started on port(s): 8080 (http)`.
8. Visit http://localhost:8080 in your browser to confirm it's running.

What to expect in the Console
- Spring Boot logs and auto-config messages.
- A line like: "Tomcat started on port(s): 8080 (http)" and "Started SpringSarvApplication in ..." indicates success.

Run from the command line (PowerShell)
```powershell
.
\mvnw.cmd spring-boot:run
```

Add a new REST route (example)
- Create file: `src/main/java/com/example/demo/ApiController.java` with contents:

```java
package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class ApiController {
    @GetMapping("/api/hello")
    public String apiHello() {
        return "Hello from Spring Boot API";
    }

    @PostMapping("/api/count")
    public Map<String, Integer> receiveCount(@RequestBody Map<String, Integer> body) {
        Integer count = body != null ? body.get("count") : null;
        System.out.println("Received count: " + count);
        return Map.of("received", count);
    }
}
```

- Save the file and Eclipse will compile it. If you see red errors about missing imports, right-click the project → **Maven > Update Project...** and ensure Maven dependencies are resolved. You can also run `.
\mvnw.cmd clean package` once to fetch dependencies.

Notes on logging
- In development you may see duplicate calls logged if React StrictMode triggers render checks — that is expected in React dev and not a backend bug.

## 4) Frontend — develop with Vite (VS Code preferred)

The frontend lives at: `src/main/frontend`.

While you *can* view these files in Eclipse, **VS Code (or another modern JS editor) is strongly preferred** for best TypeScript/JSX, ESLint, and hot reload tooling.

Open the frontend in VS Code:
```powershell
code src\main\frontend
```
If `code` command is not recognized, install the "Shell Command: Install 'code' command" from VS Code or open VS Code manually and use **File > Open Folder...**.

Install dependencies and start the Vite dev server:
```powershell
cd src\main\frontend
npm install
npm run dev
```

Default Vite dev server URL: http://localhost:5173 (watch the terminal for the exact URL).

How the dev proxy works (important)
- In dev mode the React app is served by Vite (usually on port 5173). To call your backend without CORS, Vite can proxy certain paths to the Spring Boot server.
- This project uses a proxy so requests sent to `/api/*` from the browser go to `http://localhost:8080` (Spring Boot). Check `src/main/frontend/vite.config.js` for the exact config. Example snippet:

```js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
```

That means in React you can `fetch('/api/hello')` and the Vite server forwards the call to your backend. When using the dev proxy you do not need to enable CORS in Spring Boot.

Testing the proxy quickly
1. Start Spring Boot (port 8080).
2. Start Vite dev server.
3. In the browser open `http://localhost:5173` and open DevTools → Network.
4. Click a button in the React app that calls `/api/...` (or open `http://localhost:5173/api/hello` directly).
5. You should see a request to `/api/hello` in the Network tab and the response forwarded from the backend.

Common Vite dev tips
- Keep the backend running in Eclipse and the frontend in VS Code; they are independent during development.
- If you edit `vite.config.js` restart the dev server.
- If you see CORS errors when calling `http://localhost:8080` directly, prefer relative paths (`/api/...`) so the proxy handles it, or configure CORS in Spring Boot.


## 5) Production build and deployment (detailed)

This section shows two approaches to produce a single JAR that serves your React app from the Spring Boot backend and an example controller to serve the home route and handle SPA fallback.

A. Manual build + copy (simple, explicit)

1. Build the frontend (from project root):

```powershell
cd src\main\frontend
npm install
npm run build
```

2. The production files will be in `src/main/frontend/dist` (Vite default). Copy them into Spring Boot's static resources so they are packaged inside the JAR:

```powershell
# from project root
Remove-Item -Recurse -Force src\main\resources\static\* -ErrorAction SilentlyContinue
Copy-Item -Path src\main\frontend\dist\* -Destination src\main\resources\static -Recurse
```

3. Package the backend (Maven will include `src/main/resources/static` in the JAR):

```powershell
.\mvnw.cmd clean package
java -jar target\spring-sarv-0.0.1-SNAPSHOT.jar
```

4. Open `http://localhost:8080` — Spring Boot should serve the `index.html` from the `static` folder.

B. Automated build during `mvn package` (recommended for CI)

You can add a Maven plugin to run `npm install` and `npm run build` as part of the Maven lifecycle and copy the `dist` into the JAR automatically. Add these plugin blocks to your `pom.xml` inside `<build><plugins>` (example):

```xml
<!-- frontend-maven-plugin: installs node + runs npm build -->
<plugin>
  <groupId>com.github.eirslett</groupId>
  <artifactId>frontend-maven-plugin</artifactId>
  <version>1.13.0</version>
  <configuration>
    <workingDirectory>src/main/frontend</workingDirectory>
  </configuration>
  <executions>
    <execution>
      <id>install node and npm</id>
      <goals><goal>install-node-and-npm</goal></goals>
      <configuration><nodeVersion>v18.17.1</nodeVersion></configuration>
    </execution>
    <execution>
      <id>npm install</id>
      <goals><goal>npm</goal></goals>
      <configuration><arguments>install</arguments></configuration>
    </execution>
    <execution>
      <id>npm build</id>
      <goals><goal>npm</goal></goals>
      <phase>generate-resources</phase>
      <configuration><arguments>run build</arguments></configuration>
    </execution>
  </executions>
</plugin>

<!-- resources plugin: copy frontend/dist into the JAR's static folder -->
<plugin>
  <artifactId>maven-resources-plugin</artifactId>
  <version>3.3.0</version>
  <executions>
    <execution>
      <id>copy-frontend</id>
      <phase>process-resources</phase>
      <goals><goal>copy-resources</goal></goals>
      <configuration>
        <outputDirectory>${project.build.outputDirectory}/static</outputDirectory>
        <resources>
          <resource>
            <directory>src/main/frontend/dist</directory>
            <filtering>false</filtering>
          </resource>
        </resources>
      </configuration>
    </execution>
  </executions>
</plugin>
```

With this in place you can run:

```powershell
.\mvnw.cmd clean package
java -jar target\spring-sarv-0.0.1-SNAPSHOT.jar
```

and Maven will build the frontend and include it in the JAR.

C. SPA routing / serving the home route

If your React app uses client-side routing (React Router), you need to ensure requests for non-API paths return `index.html` so the client router can handle the route. Add a small Spring controller to forward unknown paths to `index.html`.

Create `src/main/java/com/example/demo/ForwardController.java`:

```java
package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForwardController {
    // Serve the index page for the root
    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    // Forward other non-API paths to index.html (adjust pattern as needed)
    @GetMapping("/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
```

Notes:
- The `/{path:[^\\.]*}` mapping forwards requests without a dot (no file extension) to `index.html`. This prevents forwarding requests for assets like `main.js` or `style.css`.
- If you use nested client-side routes (`/app/dashboard`), the client router will receive the path and render the correct page.

D. Verify the production serve

1. Build (manual or automated from above) and run the JAR as shown.
2. Open http://localhost:8080 — the React app should load from Spring Boot.
3. Test a client-side route (e.g., `/some/route`) by entering it directly in the browser address bar — it should return `index.html` and the client router should render.

---

If you'd like, I can add the exact Maven plugin blocks into your `pom.xml` and/or create the `ForwardController.java` file for you. Which would you prefer? 

## 6) Useful commands (PowerShell)

- Run backend in Eclipse: use the Run menu on `SpringSarvApplication.java`.
- Run backend from terminal:
```powershell
.\mvnw.cmd spring-boot:run
```
- Run frontend dev server:
```powershell
cd src\main\frontend
npm install
npm run dev
```
- Build everything and run production JAR:
```powershell
.\mvnw.cmd clean package
java -jar target\spring-sarv-0.0.1-SNAPSHOT.jar
```

## 7) Troubleshooting
- "Not a git repository" when running git commands: run git from the repository root where `.git` exists.
- IDE shows "package org.springframework... does not exist" after adding controller: run `Maven > Update Project` in Eclipse or `.
\mvnw.cmd clean package` to download dependencies.
- Double backend logs for single click in dev: caused by React StrictMode — move side effects out of render/updater or ignore in dev.
- Port already in use: change `server.port` in `src/main/resources/application.properties` or stop the process using the port.

## 8) Project structure (quick)

```
spring-sarv/
├─ pom.xml
├─ src/
│  ├─ main/
│  │  ├─ java/com/example/demo/       # Spring Boot sources (controllers, main app)
│  │  ├─ resources/                   # application.properties, static files
│  │  └─ frontend/                    # Vite + React app
│  │     ├─ src/
│  │     ├─ public/
│  │     └─ vite.config.js
│  └─ test/
```

---

If you want, I can also:
- Add a Maven plugin block to `pom.xml` that runs `npm install` + `npm run build` automatically during `mvn package` (I can produce the exact snippet).
- Add an example Spring controller that forwards unknown paths to `index.html` for client-side routing.
- Add a small section describing how to push the project to GitHub and create a remote for collaborators.

If you'd like any of those, tell me which one and I'll add it to the README or apply the code change.
