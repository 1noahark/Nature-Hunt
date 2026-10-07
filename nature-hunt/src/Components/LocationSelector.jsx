import { useState } from "react";
import { IoSearch } from "react-icons/io5";

function LocationSelector({ onSearch }) {
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const trimmedLocation = location.trim();

    if (!trimmedLocation) {
      return;
    }

    onSearch(trimmedLocation);
  };

  return (
    <div className="select-location-div">
      <h3>Select your location</h3>

      <div className="inputcontainer">
        <input
          type="text"
          placeholder="Austin, Texas, United States"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button
          className="searchbutton"
          onClick={handleSearch}
        >
          <IoSearch className="searchicon" />
        </button>
      </div>
    </div>
  );
}

export default LocationSelector;