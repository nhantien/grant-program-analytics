import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleClear = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <div style={{width: '70rem', height: '3.125rem'}}>
      <TextField
        style={{backgroundColor: "white"}}
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        label="Search"
        variant="outlined"
        size="small"
        InputProps={{
          endAdornment: (
            <>
              {searchText && (
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              )}
              <IconButton onClick={handleSearch} size="small">
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
