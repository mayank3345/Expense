import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("personal-finance");

    switch (req.method) {
      case "GET":
        const transactions = await db
          .collection("transactions")
          .find({})
          .sort({ date: -1 })
          .toArray();
        res.status(200).json(transactions);
        break;

      case "POST":
        const transaction = req.body;
        const result = await db
          .collection("transactions")
          .insertOne(transaction);
        res.status(201).json({ ...transaction, _id: result.insertedId });
        break;

      case "PUT":
        const { id, ...updateData } = req.body;
        await db
          .collection("transactions")
          .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
        res.status(200).json(updateData);
        break;

      case "DELETE":
        const { id: deleteId } = req.body;
        await db
          .collection("transactions")
          .deleteOne({ _id: new ObjectId(deleteId) });
        res.status(200).json({ message: "Transaction deleted" });
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
