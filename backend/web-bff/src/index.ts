import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { verifyUserSession } from "./middlewares/authHook.js";

const app = new Elysia()
  // 1. Global CORS (useful if we run front and back on different ports during dev)
  .use(cors())

  // 2. Custom Lightweight Logger (Morgan alternative)
  .onRequest(({ request }) => {
    console.log(
      `[${new Date().toISOString()}] ${request.method} ${request.url}`,
    );
  })

  // 3. Serve frontend dist files and uploaded images (No CORS issues on production!)
  .use(staticPlugin({ assets: "./public", prefix: "/public" }))
  .use(staticPlugin({ assets: "../../frontend/web/dist", prefix: "/" }))

  // --- PUBLIC ROUTES ---

  // Basic health check to see if the container is alive
  .get("/api/health", () => ({ status: "ok", service: "bffbun-web-bff" }))

  // Proxy auth requests directly to the external auth-service via gRPC
  // We don't apply verifyUserSession here, as these are public routes
  .group("/api/v1/auth", (app) =>
    app
      .post("/login", async ({ body }: any) => {
        // Here you would call authClient.login(body)
        return { message: "Login proxy endpoint" };
      })
      .post("/register", async ({ body }: any) => {
        // Here you would call authClient.register(body)
        return { message: "Register proxy endpoint" };
      }),
  )

  // --- PROTECTED ROUTES ---

  // Apply the auth hook to all routes inside this group
  .group("/api/v1/flashcards", (app) =>
    app
      .derive(verifyUserSession)
      // Thanks to the 'derive' above, 'user' is now strongly typed and guaranteed to exist!
      .get("/decks", ({ user }) => {
        console.log(`Fetching decks for user ID: ${user.id}`);
        return { success: true, decks: [] };
      })
      .post("/decks", async ({ body, user }) => {
        return { success: true, message: `Deck created for ${user.email}` };
      }),
  )

  // 4. Start the server
  .listen(process.env.PORT || 8080);

console.log(
  `🚀  Web BFF is running at ${app.server?.hostname}:${app.server?.port}`,
);
