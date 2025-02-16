export const TRANSACTION_CATEGORIES = [
  { id: "food", label: "Food & Dining", color: "#FF6B6B" },
  { id: "transportation", label: "Transportation", color: "#4ECDC4" },
  { id: "utilities", label: "Utilities", color: "#45B7D1" },
  { id: "entertainment", label: "Entertainment", color: "#96CEB4" },
  { id: "shopping", label: "Shopping", color: "#FFEEAD" },
  { id: "healthcare", label: "Healthcare", color: "#D4A5A5" },
  { id: "housing", label: "Housing", color: "#9B5DE5" },
  { id: "income", label: "Income", color: "#00B4D8" },
  { id: "other", label: "Other", color: "#757575" },
];

export const getCategoryColor = (categoryId) => {
  return (
    TRANSACTION_CATEGORIES.find((cat) => cat.id === categoryId)?.color ||
    "#757575"
  );
};
