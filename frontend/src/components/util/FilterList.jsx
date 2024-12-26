// react
import { useContext } from 'react';
// mui
import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';
// context
import { FiltersContext } from '../../App';
import { Grid } from '@mui/material';
// constants
import { CURRENT_YEAR } from '../../constants';

function FilterList({ options, rangeString, setRangeString, setFilterListDelete }) {

  const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

  const searchText = appliedFilters["search_text"].join(" OR ");

  const handleClearFilter = (filterValue, filterType) => {

    // remove the selected item from the list of filters
    const updatedFilters = appliedFilters[filterType].filter((filter) => filter !== filterValue);
    // return the filter label that was delted from the filter list 
    // the actual value is not currently being used, it just serves as a truthy value
    setFilterListDelete({filterType: filterType, filterValue: filterValue})
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: updatedFilters,
    }));
  }


  const handleClearFundingYearRangeFilter = () => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      "funding_year": [CURRENT_YEAR.toString()],
    }));
    setRangeString("");
  }



  return (
    <Grid container>
      <Grid item xs={12}>
        {Object.entries(appliedFilters).map(([filterType, filterValues]) => {
          return filterType === 'funding_year' && filterValues.length > 1 ? (
            <Chip
              key={filterType}
              label={rangeString}
              onDelete={handleClearFundingYearRangeFilter}
              deleteIcon={<ClearIcon />}
              style={{
                margin: '4px',
                backgroundColor: '#77AEED',
              }}
            />
          ) : (
            filterValues.map((filter, index) => (
              <Chip
                key={index}
                label={filterType === 'search_text' ? filter : options[filterType][filter]}
                onDelete={() => handleClearFilter(filter, filterType)}
                deleteIcon={<ClearIcon />}
                style={{
                  margin: '4px',
                  backgroundColor: '#77AEED',
                }}
              />
            ))
          )
        }
        )}
      </Grid>
    </Grid>
  );
};

export default FilterList;