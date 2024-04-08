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

function FilterList({ options, rangeString, setRangeString }) {

  const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

  const searchText = appliedFilters["search_text"].join(" OR ");

  const handleClearFilter = (filterValue, filterType) => {
    // if (filterType === "search_text") {
    //   setAppliedFilters((prevFilters) => ({
    //     ...prevFilters,
    //     "search_text": [],
    //   }));
    //   return;
    // }

    // remove the selected item from the list of filters
    const updatedFilters = appliedFilters[filterType].filter((filter) => filter !== filterValue);
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

// filterType === 'search_text' && filterValues.length > 0 ? (
//   <Chip
//     key={filterType}
//     label={searchText}
//     onDelete={() => handleClearFilter(filterValues, filterType)}
//     deleteIcon={<ClearIcon />}
//     style={{
//       margin: '4px',
//       backgroundColor: '#77AEED',
//     }}
//   />
// ) : 