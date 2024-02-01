import React, { useState } from 'react';
import { FormControl, Select, OutlinedInput, MenuItem, Checkbox } from '@mui/material';
import { YEARS } from '../../constants';

import styles from "./Filter.module.css";

function FundingYearFilter({ filters, setFilters, setShowSlider, snapshot }) {

    const handleChange = (event) => {
        const value = event.target.value;
        if (value === "select range of years") setShowSlider(true);
        else {
            setShowSlider(false);
            setFilters((prevFilters) => ({
                ...prevFilters,
                "FundingYear": [value],
            }));
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

    return (
        <div style={{ width: snapshot ? "25%" : "" }} className={styles.container}>
            <FormControl sx={{ width: "100%" }}>
                {/* <InputLabel>{defaultValue}</InputLabel> */}
                <Select
                    label="Funding Year"
                    className={styles.filter}
                    onChange={handleChange}
                    displayEmpty
                    fullWidth
                    variant="outlined"
                    value={filters["FundingYear"]}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    // renderValue={(selected) => (
                    //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    //     {selected.map((value) => (
                    //       <Chip key={value} label={value} />
                    //     ))}
                    //   </Box>
                    // )}
                    renderValue={(selected) => (
                        <span>Funding Year</span>
                    )}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="select range of years">select range of years</MenuItem>
                    {YEARS.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

        </div>
    );
};

export default FundingYearFilter;