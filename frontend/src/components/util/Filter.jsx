import React, { useContext } from 'react';
import { FiltersContext } from '../../App';
import { Grid, FormControl, Select, OutlinedInput, MenuItem, Checkbox, Typography } from '@mui/material';

import styles from "./Filter.module.css";

function Filter({ options, defaultValue, type, snapshot }) {

  const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

  const handleChange = (event) => {
    const value = event.target.value;
    // if "clear" is selected, clear all
    if (value.indexOf("clear") > -1) {
      setAppliedFilters((prevFilters) => ({
        ...prevFilters,
        [type]: [],
      }));
    } else {
      setAppliedFilters((preFilters) => ({
        ...preFilters,
        [type]: value,
      }))
    }
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

  const isMobile = () => {
    return window.screen.width <= 576;
}

const filterWidth = (isMobile())
?  { pad: "2rem 0 2rem 0" }
 : {pad: "0.5rem 0 0.5rem 0" };

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl sx={{ width: "100%" }}>
          <Select
            label={defaultValue}
            className={styles.filter}
            onChange={handleChange}
            displayEmpty
            multiple
            value={appliedFilters[type]}
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
              value="clear"
              disableGutters
              sx={{ width: "100%", backgroundColor: "#EBECEE", borderRadius: "5px", padding: "0.5rem 0 0 0", display: "flex", justifyContent: "center" }}
            >
              <Typography>Clear All</Typography>
            </MenuItem>
            {
              Object.entries(options).map(([key, value]) => (
                <MenuItem key={value} value={key} style={{ width: "100%", whiteSpace: "normal" }}>
                  <Checkbox checked={appliedFilters[type].indexOf(key) > -1} />
                  <Typography >{value}</Typography>
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Filter;