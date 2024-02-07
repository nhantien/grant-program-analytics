import React, { useState } from 'react';
import { FormControl, Select, Chip, OutlinedInput, Box, MenuItem, InputLabel, Checkbox, Typography } from '@mui/material';

import styles from "./Filter.module.css";

function Filter({ options, filters, onSelect, defaultValue, type, snapshot }) {

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.indexOf("") > -1) onSelect([], type);
    else onSelect(value, type);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <div style={{ width: snapshot ? "25%" : "" }} className={styles.container}>
      <FormControl sx={{ width: "100%" }}>
        <Select
          label={defaultValue}
          className={styles.filter}
          onChange={handleChange}
          displayEmpty
          fullWidth
          multiple
          value={filters[type]}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => {
            if (selected.length === 0) { return <em>{defaultValue} (All)</em>; }
            return (
              <em>{defaultValue} ({selected.length})</em>
            )
          }}
          MenuProps={MenuProps}
        >
          <MenuItem
            selected={false}
            value=""
            sx={{ backgroundColor: "#EBECEE", borderRadius: "5px", padding: "0.5rem 0 0.5rem 0", display: "flex", justifyContent: "center" }}
          >
            <Typography>Clear All</Typography>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={filters[type].indexOf(option) > -1} />
              <Typography noWrap>{option}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

    </div>
  );
};

export default Filter;