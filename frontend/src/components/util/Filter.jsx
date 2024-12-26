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
        !value.includes(undefined) && setStagedFilters(value); // Update staged filters only
    };

    // Apply staged filters to context when dropdown closes
    const handleDropdownClose = () => {
        setIsDropdownOpen(false);
        if (stagedFilters !== appliedFilters[type]) {
            // only apply filters if the user actually select different filters
            setAppliedFilters((prevFilters) => ({
                ...prevFilters,
                [type]: stagedFilters,
            }));
        }
       
    };
    
    const handleClearAll = () => {
        setStagedFilters([])
    }

    const handleApply = () => {
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
                        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        <MenuItem
                            selected={false}
                            onClick={handleClearAll}
                            disableGutters
                            sx={{
                                width: "50%",
                                backgroundColor: "#D9DADC", // Slightly darker grey
                                borderRadius: "5px",
                                padding: "0.5rem 0 0 0",
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            <Typography>Clear All</Typography>
                        </MenuItem>
                        <MenuItem
                            selected={false}
                            value="apply"
                            disableGutters
                            onClick={handleApply}
                            sx={{
                                    width: "50%",
                                    backgroundColor: "#002145",
                                    borderRadius: "5px",
                                    padding: "0.5rem 0 0 0",
                                    display: "flex",
                                    justifyContent: "center",
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0", // Light grey hover
                                        "& .MuiTypography-root": {
                                            color: "#002145", // Change text color to dark blue on hover
                                        },
                                },
                             }}
                        >
                            <Typography sx={{ color: "#FFF" }}>Apply</Typography>
                        </MenuItem>
                        </div>
                        {items.map((item) => (
                            <MenuItem key={item[1]} value={item[0]} style={{ width: "100%", whiteSpace: "normal" }}>
                                <Checkbox checked={stagedFilters.includes(item[0])} />
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
