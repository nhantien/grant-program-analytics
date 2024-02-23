import React, { useContext, useState } from 'react';
import { FormControl, Select, OutlinedInput, MenuItem, Checkbox, Typography } from '@mui/material';
import { YEARS } from '../../constants';
import { FiltersContext } from '../../App';

import styles from "./Filter.module.css";

function FundingYearFilter({ setShowSlider, snapshot }) {

    const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value === "select range of years") setShowSlider(true);
        else {
            setShowSlider(false);
            setAppliedFilters((prevFilters) => ({
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
                <Select
                    label="Funding Year"
                    className={styles.filter}
                    onChange={handleChange}
                    displayEmpty
                    fullWidth
                    value={appliedFilters["FundingYear"]}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <em>Funding Year</em>
                    )}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="select range of years">Select range of years</MenuItem>
                    {YEARS.map((year) => (
                        <MenuItem key={year.label} value={year.value}>
                            <Typography>{year.label}</Typography>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

        </div>
    );
};

export default FundingYearFilter;