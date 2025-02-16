import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("personal-finance");

    // Delete all transactions
    await db.collection("transactions").deleteMany({});

    // Reset budgets to empty
    await db
      .collection("budgets")
      .updateOne(
        { userId: "default" },
        { $set: { categories: {} } },
        { upsert: true }
      );

    // Reset monthly income
    await db
      .collection("monthly_income")
      .updateOne(
        { userId: "default" },
        { $set: { amount: 0 } },
        { upsert: true }
      );

    res.status(200).json({ message: "All data reset successfully" });
  } catch (error) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
