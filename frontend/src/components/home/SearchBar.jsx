// react
import React, { useContext, useState } from 'react';
// mui
import { Grid, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
// context
import { FiltersContext } from '../../App';


function SearchBar() {

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
    setInputValue("");
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          style={{ backgroundColor: "white" }}
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
                <IconButton onClick={handleSearch} size="small">
                  <SearchIcon />
                </IconButton>
              </>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SearchBar;
