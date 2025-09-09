import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint - registered immediately before async operations
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Register routes - simplified initialization
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      log(`Error: ${message}`, 'error');
    });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Serve static files with proper headers for production health checks
    serveStatic(app);
    
    // Catch-all route for SPA routing in production
    app.get('*', (req, res, next) => {
      // Skip API routes and health checks
      if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/') {
        return next();
      }
      // For other routes, serve the main app
      res.sendFile('index.html', { root: 'dist' }, (err) => {
        if (err) {
          res.status(404).json({ error: 'Page not found' });
        }
      });
    });
  }

    // Non-blocking database initialization
    const initializeDatabase = async () => {
      try {
        const { storage } = await import('./storage');
        await storage.upsertUser({
          id: 'employer',
          email: 'employer@tylerbustard.ca',
          firstName: 'Admin',
          lastName: 'User',
        });
        log('Employer user ready for PDF uploads');
      } catch (error) {
        log('Note: Employer user initialization - ' + error, 'error');
      }
    };

    // Start database initialization in background (non-blocking)
    initializeDatabase().catch(error => {
      log('Database initialization failed, but server will continue: ' + error, 'error');
    });

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    
    // Add error handling for server listen operation
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use`, 'error');
      } else if (error.code === 'EACCES') {
        log(`Permission denied to bind to port ${port}`, 'error');
      } else {
        log(`Server error: ${error.message}`, 'error');
      }
      process.exit(1);
    });

    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  
  } catch (error) {
    log(`Fatal error during server initialization: ${error}`, 'error');
    process.exit(1);
  }
})();
