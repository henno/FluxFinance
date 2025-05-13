import { test, expect } from "bun:test";
import { describe } from "bun:test";
import { createServer } from "../server.js"; // You'll need to create this file

describe("Authentication", () => {
  let server;
  
  // Setup before tests
  beforeEach(async () => {
    // Create a test server instance
    server = await createServer({ testing: true });
  });
  
  // Cleanup after tests
  afterEach(async () => {
    // Close the server if it exists
    if (server) {
      await server.close();
    }
  });

  test("unauthenticated visitor sees sign-in form when accessing protected URL", async () => {
    // Setup - create a test client
    const protectedUrl = "/invoices/3";
    
    // Make request to protected URL without authentication
    const response = await fetch(`http://localhost:${server.port}${protectedUrl}`);
    const html = await response.text();
    
    // Assertions
    expect(response.status).toBe(200); // Should return 200 OK
    expect(html).toContain("<form"); // Should contain a form
    expect(html).toContain('name="email"'); // Should have email field
    expect(html).toContain('name="password"'); // Should have password field
    expect(html).toContain('type="submit"'); // Should have submit button
    
    // The form should post to the same URL to maintain the URL in address bar
    expect(html).toContain(`action="${protectedUrl}"`);
  });
});
