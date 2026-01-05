import { useState } from "react";
import api from "../../utils/api";

export default function CreateLicense() {
  const [product, setProduct] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/licenses/create", {
        product,
        validDays,
      });

      setMessage("✔ License Created Successfully!");
      setProduct("");
      setValidDays(30);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating license");
    }
  };

  return (
    <div className="border rounded-xl p-6 max-w-lg mx-auto bg-white shadow">
      <h2 className="text-2xl font-bold mb-4">Create New License</h2>

      {message && (
        <p className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</p>
      )}

      <form onSubmit={handleCreate}>
        <label className="block mb-2 font-semibold">Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          className="w-full border p-2 mb-4 rounded"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Valid Days</label>
        <input
          type="number"
          min="1"
          className="w-full border p-2 mb-4 rounded"
          value={validDays}
          onChange={(e) => setValidDays(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          Create License
        </button>
      </form>
    </div>
  );
}
