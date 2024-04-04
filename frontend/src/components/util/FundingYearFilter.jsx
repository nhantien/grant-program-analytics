import React, { useContext } from 'react';
import { Grid, FormControl, Select, OutlinedInput, MenuItem, Typography } from '@mui/material';
import { FiltersContext } from '../../App';

import styles from "./Filter.module.css";

function FundingYearFilter({ options, setShowSlider, snapshot }) {

    const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

    // users can only select either "range of years" OR a single year
    const handleChange = (event) => {
        const value = event.target.value;
        if (value === "select range of years") setShowSlider(true);
        // if a single year is selected, clears all the existing year filters and add the selected year
        else {
            setShowSlider(false);
            setAppliedFilters((prevFilters) => ({
                ...prevFilters,
                "funding_year": [value],
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

    const isMobile = () => {
        return window.screen.width <= 576;
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }}>
                    <Select
                        label="Funding Year"
                        className={styles.filter}
                        onChange={handleChange}
                        displayEmpty
                        fullWidth
                        value={appliedFilters["funding_year"]}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <em>Funding Year</em>
                        )}
                        MenuProps={MenuProps}
                    >
                        <MenuItem value="select range of years">Select range of years</MenuItem>
                        {
                            Object.entries(options).map(([key, value]) => (
                                <MenuItem key={value} value={key}>
                                    <Typography noWrap>{value}</Typography>
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default FundingYearFilter;