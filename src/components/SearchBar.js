import React, { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 


const SearchBar = ({ handleSearch, clearCities }) => {
    const [city, setCity] = useState("");

    const handleChange = (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city) {
            handleSearch(city);  // Call the passed function with the city name
            setCity("");  // Clear the input field after submission
        }
    };

    return (

        <div>

            <form onSubmit={handleSubmit} id="search-bar">
                <input
                    type="text"
                    value={city}
                    onChange={handleChange}
                />
                <button id="add-button" type="submit"> + </button>
                <button id="add-button" type="button" onClick={clearCities}> Clear Cities </button>
            </form>

        </div>

       
    );
};

export default SearchBar;
