import React, { useState, useEffect } from 'react';
import Countries from './Countries';
import './App.css'; // Import the CSS file

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [continent, setContinent] = useState('');
  const [subregion, setSubregion] = useState('');
  const [top10Filter, setTop10Filter] = useState(null); 
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    let filtered = [...countries];

    if (continent) {
      filtered = filtered.filter(country => country.continents && country.continents.includes(continent));
      setSubregion('');
    }

    if (subregion) {
      filtered = filtered.filter(country => country.subregion === subregion);
      setContinent('');
    }

    if (top10Filter) {
      filtered = filtered
        .sort((a, b) => (top10Filter === 'population' ? b.population - a.population : b.area - a.area))
        .slice(0, 10);
    }

    if (sortAlphabetically) {
      filtered = filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
    }

    setFilteredCountries(filtered);
  }, [countries, continent, subregion, top10Filter, sortAlphabetically]);

  const handleContinentChange = (event) => {
    setContinent(event.target.value);
  };

  const handleSubregionChange = (event) => {
    setSubregion(event.target.value);
  };

  const handleTop10FilterChange = (type) => {
    setTop10Filter(type);
  };

  const handleSortAlphabetically = () => {
    setSortAlphabetically(prevState => !prevState);
  };

  return (
    <div className="app-container">
      <h1>Country Information</h1>

      <div className="controls">
        <label>
          Continent:
          <select value={continent} onChange={handleContinentChange}>
            <option value="">All</option>
            <option value="Asia">Asia</option>
            <option value="Africa">Africa</option>
            <option value="Europe">Europe</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Antarctica">Antarctica</option>
            <option value="Australia">Australia</option>
          </select>
        </label>

        <label>
          Subregion:
          <select value={subregion} onChange={handleSubregionChange}>
            <option value="">All</option>
            <option value="Southern Asia">Southern Asia</option>
            <option value="Eastern Africa">Eastern Africa</option>
          </select>
        </label>

        <button onClick={() => handleTop10FilterChange('population')}>
          Top 10 by Population
        </button>
        <button onClick={() => handleTop10FilterChange('area')}>
          Top 10 by Area
        </button>

        <button onClick={handleSortAlphabetically}>
          Sort Alphabetically
        </button>
      </div>

      <Countries countries={filteredCountries} />
    </div>
  );
};

export default App;