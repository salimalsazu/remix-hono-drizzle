import { serve } from "@hono/node-server";
import config from "./config";
import app from "./app";

async function bootstrap() {
  try {
    const server = serve(app);
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed");
        });
      }
      process.exit(1);
    };

    const unexpectedErrorHandler = (error: unknown) => {
      console.error(error);
      exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", () => {
      console.info("SIGTERM received");
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    console.error(`Error starting server: ${error}`);
    process.exit(1);
  }
}

bootstrap();
