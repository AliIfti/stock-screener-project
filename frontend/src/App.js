import React, { useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

// Get API URL from environment variable or use default for local development
const API_URL = process.env.REACT_APP_API_URL;
console.log('API URL:', API_URL); // Debug log

function App() {
    const [symbol, setSymbol] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [chartData, setChartData] = useState([]);

    const processStockData = (rawData) => {
        if (!rawData['Time Series (Daily)']) return [];
        
        return Object.entries(rawData['Time Series (Daily)'])
            .map(([date, values]) => ({
                date: date,
                price: parseFloat(values['4. close']),
                volume: parseInt(values['6. volume'])
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-30); // Get last 30 days of data
    };

    const fetchStockData = async () => {
        try {
            console.log('Fetching from:', `${API_URL}/api/stock?symbol=${symbol}`); // Debug log
            const response = await axios.get(
                `${API_URL}/api/stock?symbol=${symbol}`
            );
            setData(response.data);
            setChartData(processStockData(response.data));
            setError("");
        } catch (err) {
            console.error('API Error:', err);
            setError(err.response?.data?.error || "Invalid symbol or server error.");
            setData(null);
            setChartData([]);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Stock Market Screener</h1>
            <div className="flex gap-2 mb-6">
                <input
                    className="p-2 border border-gray-300 rounded w-64"
                    placeholder="Enter stock symbol (e.g., AAPL)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
                <button 
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={fetchStockData}
                >
                    Search
                </button>
            </div>

            {error && (
                <p className="text-red-500 mt-4 bg-red-50 p-3 rounded">{error}</p>
            )}

            {chartData.length > 0 && (
                <div className="w-full mt-6 bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">{symbol} Stock Price (Last 30 Days)</h2>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                />
                                <YAxis 
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                                />
                                <Tooltip 
                                    formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#2563eb" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="Stock Price"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {data && !chartData.length && (
                <div className="mt-6">
                    <h2 className="text-2xl">Stock Data</h2>
                    <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-[400px]">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default App;

