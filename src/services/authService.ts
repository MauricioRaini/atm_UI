export async function validatePIN(pin: string): Promise<{ success: boolean }> {
  // This is a placeholder for the real backend call.
  // For instance: const response = await fetch("/api/validatePin", { method: "POST", body: pin });
  // return response.json();
  // For now, always just return { success: pin === "123456" } or something similar.
  return new Promise((resolve) => {
    setTimeout(() => {
      // Fake server checks
      if (pin === "123456") {
        resolve({ success: true });
      } else {
        resolve({ success: false });
      }
    }, 300); // simulate network latency
  });
}
