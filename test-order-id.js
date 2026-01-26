// Test script untuk melihat format order_id yang baru
const testOrderIdGeneration = () => {
  // Simulasi user ID panjang (seperti dari Prisma)
  const longUserId = "cmkugxrqj000cqguo9k5w60j6";
  const plan = "monthly";
  
  // Format lama (yang terlalu panjang)
  const oldOrderId = `PRO-${plan.toUpperCase()}-${longUserId}-${Date.now()}`;
  
  // Format baru (yang sudah diperpendek)
  const shortUserId = longUserId.slice(-8);
  const timestampSuffix = Date.now().toString().slice(-8);
  const planPrefix = plan === 'monthly' ? 'M' : 'Y';
  const newOrderId = `PRO-${planPrefix}-${shortUserId}-${timestampSuffix}`;
  
  console.log("=== ORDER ID COMPARISON ===");
  console.log("Old format:", oldOrderId);
  console.log("Old length:", oldOrderId.length, "chars");
  console.log("");
  console.log("New format:", newOrderId);
  console.log("New length:", newOrderId.length, "chars");
  console.log("");
  console.log("✅ Midtrans limit: 50 chars");
  console.log("✅ New format meets limit:", newOrderId.length <= 50 ? "YES" : "NO");
};

testOrderIdGeneration();