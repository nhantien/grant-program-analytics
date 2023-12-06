import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const Filter = ({ options, onSelect, defaultValue, type }) => {

  const handleChange = (event) => {
    const value = event.target.value;
    onSelect(value, type);
  };

  return (
    <div style={{width: '14.4375rem'}}>
      <Select
        style={{backgroundColor: "white" }}
        onChange={handleChange}
        displayEmpty
        fullWidth
        variant="outlined"
        value=''
      >
        <MenuItem value="" disabled>{defaultValue}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default Filter;