import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { env } from "../../env.js";

// Import the generated service from your proto files
// Ensure you copy your 'gen' folder into backend/shared/src/gen
import { AuthService } from "./gen/auth_pb.js";

// Create a transport using HTTP/2 for microservice communication
const transport = createConnectTransport({
  baseUrl: env.AUTH_SERVICE_URL,
  httpVersion: "2",
});

// Export the ready-to-use gRPC client
export const authClient = createClient(AuthService, transport);
