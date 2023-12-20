import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import styles from "./Filter.module.css";

function Filter ({ options, onSelect, defaultValue, type }) {

  const handleChange = (event) => {
    const value = event.target.value;
    onSelect(value, type);
  };

  return (
    <div className={styles.container}>
      <Select
        className={styles.filter}
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