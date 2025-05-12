// backend/index.js
const axios = require("axios");
require("dotenv").config();

exports.handler = async (event) => {
    const symbol = event.queryStringParameters.symbol;
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    try {
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
        );
        const data = response.data;

        if (data["Time Series (Daily)"]) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data["Time Series (Daily)"]),
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Invalid symbol or API limit reached" }),
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" }),
        };
    }
};

