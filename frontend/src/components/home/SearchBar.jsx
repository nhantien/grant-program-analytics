// react
import React, { useContext, useState } from 'react';
// mui
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
// css styles
import styles from "./SearchBar.module.css";
// context
import { FiltersContext } from '../../App';


function SearchBar () {

  const { setAppliedFilters } = useContext(FiltersContext);

  const [inputValue, setInputValue] = useState("");

  const handleClear = () => {
    setInputValue("");
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      "search_text": [],
    }));
  };

  const handleSearch = () => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      "search_text": inputValue.split(", "),
    }));
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className={styles.container}>
      <TextField
        style={{backgroundColor: "white"}}
        fullWidth
        value={inputValue}
        onInput={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        onChange={(e) => setInputValue(e.target.value)}
        label="Search by Title/Investigator"
        variant="outlined"
        size="small"
        InputProps={{
          endAdornment: (
            <>
              {inputValue && (
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton onClick={ handleSearch } size="small">
                <SearchIcon />
              </IconButton>
            </>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
