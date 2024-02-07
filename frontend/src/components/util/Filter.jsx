import React, { useState } from 'react';
import { FormControl, Select, Chip, OutlinedInput, Box, MenuItem, InputLabel, Checkbox, Typography } from '@mui/material';

import styles from "./Filter.module.css";

function Filter({ options, filters, onSelect, defaultValue, type, snapshot }) {

  const handleChange = (event) => {
    const value = event.target.value;
    onSelect(value, type);
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
        {/* <InputLabel>{defaultValue}</InputLabel> */}
        <Select
          label={defaultValue}
          className={styles.filter}
          onChange={handleChange}
          displayEmpty
          fullWidth
          multiple
          variant="outlined"
          value={filters[type]}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          // renderValue={(selected) => (
          //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          //     {selected.map((value) => (
          //       <Chip key={value} label={value} />
          //     ))}
          //   </Box>
          // )}
          renderValue={(selected) => (
            <span>{defaultValue}</span>
          )}
          MenuProps={MenuProps}
        >
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