import React, { useState } from "react";
import axios from "axios";

function App() {
    const [symbol, setSymbol] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const fetchStockData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/stock?symbol=${symbol}`
            );
            setData(response.data);
            setError("");
        } catch (err) {
            setError("Invalid symbol or server error.");
            setData(null);
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-3xl mb-4">Stock Market Screener</h1>
            <input
                className="p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={fetchStockData}>
                Search
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {data && (
                <div className="mt-6">
                    <h2 className="text-2xl">Stock Data</h2>
                    <pre className="bg-gray-100 p-4 rounded mt-2">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default App;

