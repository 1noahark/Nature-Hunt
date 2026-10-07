import { useState } from "react";
import "./App.css";
import LocationSelector from "./Components/LocationSelector";

function App() {
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("birds");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // This runs when the user enters a location
  // and presses Enter or clicks the search button.
  const handleLocationSearch = async (newLocation) => {
    setLocation(newLocation);
    setSelectedCategory("birds");

    await searchNature("birds", newLocation);
  };

  // Search for nature
  const searchNature = async (category, searchLocation = location) => {
    if (!searchLocation.trim()) {
      alert("Please enter your location first.");
      return;
    }

    setSelectedCategory(category);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        search: category,
        location: searchLocation.trim(),
      });

      const response = await fetch(
        `http://localhost:5000/api/images?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Search:", category);
      console.log("Location:", searchLocation);
      console.log("Results:", data);

      setResults(data.images_results || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="headertitle">NATURE HUNT</h1>

      <LocationSelector onSearch={handleLocationSearch} />

      <h3 className="recommend-text">
        Here are some{" "}

        <button
          className={
            selectedCategory === "birds" ? "selected" : ""
          }
          onClick={() => searchNature("birds")}
        >
          Birds
        </button>{" "}

        <button
          className={
            selectedCategory === "plants" ? "selected" : ""
          }
          onClick={() => searchNature("plants")}
        >
          Plants
        </button>{" "}

        <button
          className={
            selectedCategory === "rocks" ? "selected" : ""
          }
          onClick={() => searchNature("rocks")}
        >
          Rocks
        </button>{" "}

        you can discover on your walk.
      </h3>

      <h4 className="little-info">You can click on the <strong>pills</strong> to get different results. </h4>

      {loading && (
        <p className="loading">
          Loading Discoverable {selectedCategory} near {location}...
        </p>
      )}

      <div className="Result-Container">
        {!loading &&
          results.map((result, index) => (
            <div className="Card" key={index}>
              <img
                src={result.thumbnail}
                alt={result.title || selectedCategory}
              />

              <div className="card-content">
                <h3>{result.title}</h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;