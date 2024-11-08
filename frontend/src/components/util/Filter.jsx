import React, { useContext, useEffect, useState } from 'react';
import { FiltersContext } from '../../App';
import { Grid, FormControl, Select, OutlinedInput, MenuItem, Checkbox, Typography } from '@mui/material';
import styles from "./Filter.module.css";

function Filter({ options, defaultValue, type, filterListDelete }) {
    const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

    // Local state for managing selection within the dropdown
    const [stagedFilters, setStagedFilters] = useState(appliedFilters[type] || []);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track open/close state

   useEffect(() => {
    // check if a filter label is deleted from the filter list
    if (filterListDelete) {
        appliedFilters[type].length > 0 ? setStagedFilters(appliedFilters[type]) : setStagedFilters([])
    }
  }, [filterListDelete]);

    const handleChange = (event) => {
        const value = event.target.value;
        
        if (value.indexOf("clear") > -1) {
            setStagedFilters([]); // Clear selection locally
        } else {
            setStagedFilters(value); // Update staged filters only
        }
    };

    // Apply staged filters to context when dropdown closes
    const handleDropdownClose = () => {
        setIsDropdownOpen(false);
        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            [type]: stagedFilters,
        }));
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const items = Object.keys(options).map((key) => [key, options[key]]);
    items.sort((a, b) => a[1].localeCompare(b[1]));

    const isMobile = () => {
        return window.screen.width <= 576;
    };

    const filterWidth = isMobile()
        ? { pad: "2rem 0 2rem 0" }
        : { pad: "0.5rem 0 0.5rem 0" };

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
                        open={isDropdownOpen}
                        onOpen={() => setIsDropdownOpen(true)}
                        onClose={handleDropdownClose} // Apply staged filters on close
                        value={stagedFilters} // Use staged filters for selection
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => {
                            if (selected.length === 0) { return <em>{defaultValue} (All)</em>; }
                            return <em>{defaultValue} ({selected.length})</em>;
                        }}
                        MenuProps={MenuProps}
                    >
                        <MenuItem
                            selected={false}
                            value="clear"
                            disableGutters
                            sx={{
                                width: "100%",
                                backgroundColor: "#EBECEE",
                                borderRadius: "5px",
                                padding: "0.5rem 0 0 0",
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            <Typography>Clear All</Typography>
                        </MenuItem>
                        {items.map((item) => (
                            <MenuItem key={item[1]} value={item[0]} style={{ width: "100%", whiteSpace: "normal" }}>
                                <Checkbox checked={stagedFilters.indexOf(item[0]) > -1} />
                                <Typography noWrap>{item[1]}</Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}

export default Filter;
