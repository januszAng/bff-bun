import { authClient } from "@bffbun/shared";

// Notice that we extract 'error' directly from the Elysia context arguments!
// We don't need to import it globally.
export const verifyUserSession = async ({ headers, error }: any) => {
  const authHeader = headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Elysia will automatically catch this, halt the request, and return a 401 response
    return error(401, { message: "Missing or malformed Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Send a gRPC request to the external auth-service
    const session = await authClient.verifyToken({ accessToken: token });

    // Inject the verified user data into the request context
    return {
      user: {
        id: session.userId,
        email: session.email,
      },
    };
  } catch (err) {
    console.error("Auth verification failed:", err);
    return error(401, { message: "Invalid or expired session token" });
  }
};
