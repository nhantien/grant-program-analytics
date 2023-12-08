import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function SearchBar ({ setSearchText }) {

  const [inputValue, setInputValue] = useState("");

  const handleClear = () => {
    setInputValue("");
    setSearchText("");
  };

  const handleSearch = () => {
    setSearchText(inputValue);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div style={{width: '70rem', height: '3.125rem'}}>
      <TextField
        style={{backgroundColor: "white"}}
        fullWidth
        value={inputValue}
        onInput={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        onChange={(e) => setInputValue(e.target.value)}
        label="Search"
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
