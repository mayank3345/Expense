import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("personal-finance");

    switch (req.method) {
      case "GET":
        const budgets = await db.collection("budgets").findOne({
          userId: "default", // Replace with actual user ID when auth is implemented
        });
        res.status(200).json(budgets?.categories || {});
        break;

      case "POST":
        const categories = req.body;
        await db.collection("budgets").updateOne(
          { userId: "default" }, // Replace with actual user ID
          {
            $set: { categories },
          },
          { upsert: true }
        );
        res.status(200).json(categories);
        break;

      default:
        res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
