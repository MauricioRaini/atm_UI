import { validatePIN } from "@/services";

describe("🔐 Auth Service - verifyPIN()", () => {
  it("✅ Should return success when correct PIN is entered", async () => {
    const response = await validatePIN("123456");
    expect(response.success).toBe(true);
  });

  it("❌ Should return failure when incorrect PIN is entered", async () => {
    const response = await validatePIN("0000");
    expect(response.success).toBe(false);
  });
});
