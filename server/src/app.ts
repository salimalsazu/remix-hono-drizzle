import { Hono } from "hono";
import { cors } from "hono/cors";
import routes from "./app/routes";


const app = new Hono();

// CORS middleware in Hono
app.use(
  "*",
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
  })
);


// Global error handler (use try-catch inside handlers)
// app.onError(globalErrorHandler);

// API routes
app.route("/api/v1", routes);

// Handle not found
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "Not Found",
      errorMessages: [
        {
          path: c.req.path,
          message: "API Not Found",
        },
      ],
    },
    404
  );
});

export default app;
