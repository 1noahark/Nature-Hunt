const express = require("express");
const cors = require("cors");
require("dotenv/config");
const { getJson } = require("serpapi");

const app = express();

app.use(cors());

app.get("/api/images", async (req, res) => {
  try {
    const { search, location } = req.query;

    if (!search || !location) {
      return res.status(400).json({
        error: "Search and location are required.",
      });
    }

    // console.log("Search:", search);
    // console.log("Location:", location);

    const data = await getJson({
      engine: "google_images",


      q: `common ${search} found in ${location}`,

      location: location,

      google_domain: "google.com",
      hl: "en",
      gl: "us",

      api_key: process.env.SERPAPI_KEY,
    });

    console.log(
      "SerpApi location used:",
      data.search_parameters?.location_used
    );

    res.json(data);
  } catch (error) {
    console.error("SERPAPI ERROR:", error);

    res.status(500).json({
      error: "Failed to fetch images.",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});