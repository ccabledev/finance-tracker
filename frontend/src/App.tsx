import { useEffect, useState } from "react";
import { api } from "./lib/api";

function App() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    api.get("/")
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(`Error: ${err.message}`));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">Finance Tracker</h1>
        <p className="mt-2 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export default App;