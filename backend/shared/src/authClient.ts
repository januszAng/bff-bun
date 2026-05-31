import { createConnectTransport } from "@connectrpc/connect-node";
import { createClient } from "@connectrpc/connect";
// Import the generated service from your proto files
// Ensure you copy your 'gen' folder into backend/shared/src/gen
import { AuthService } from "./gen/auth_pb.js";

const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:50051";

// Create a transport using HTTP/2 for microservice communication
const transport = createConnectTransport({
  baseUrl: authServiceUrl,
  httpVersion: "2",
});

// Export the ready-to-use gRPC client
export const authClient = createClient(AuthService, transport);
