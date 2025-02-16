import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("personal-finance");

    if (req.method === "GET") {
      const budgets = await db
        .collection("budgets")
        .findOne({ userId: "default" });
      const income = await db
        .collection("monthly_income")
        .findOne({ userId: "default" });

      res.json({
        ...(budgets?.categories || {}),
        income: income?.amount || 0,
      });
    } else if (req.method === "POST") {
      const data = req.body;
      const { income, ...categories } = data;

      // Update monthly income if provided
      if (income !== undefined) {
        await db
          .collection("monthly_income")
          .updateOne(
            { userId: "default" },
            { $set: { amount: Number(income) } },
            { upsert: true }
          );
      }

      // Update category budgets
      if (Object.keys(categories).length > 0) {
        await db
          .collection("budgets")
          .updateOne(
            { userId: "default" },
            { $set: { categories } },
            { upsert: true }
          );
      }

      res.status(200).json({ message: "Budgets updated successfully" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
