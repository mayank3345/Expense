import { useState } from "react";

export default function ResetButton({ onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (isResetting) return;

    setIsResetting(true);
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
      });

      if (res.ok) {
        onReset();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error resetting data:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-white text-sm sm:text-base 
          font-medium transition-colors bg-red-600 px-3 py-2 rounded-xl hover:bg-slate-700 hover:text-white"
      >
        Reset
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reset All data to Zero
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to reset Everything? This will delete all
              transactions and budgets. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isResetting}
                className="px-4 py-2 text-sm font-medium text-gray-700 
                  hover:bg-gray-50 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="px-4 py-2 text-sm font-medium text-white 
                  bg-red-600 hover:bg-red-700 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-red-500 disabled:opacity-50"
              >
                {isResetting ? "Resetting..." : "Reset Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
