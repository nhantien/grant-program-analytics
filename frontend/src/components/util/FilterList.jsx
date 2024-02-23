// react
import { useContext } from 'react';
// mui
import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';
// context
import { FiltersContext } from '../../App';

function FilterList({ rangeString, setRangeString }) {

  const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

  const searchText = appliedFilters["search_text"].join(" OR ");

  const handleClearFilter = (filterValue, filterType) => {
    if (filterType === "search_text") {
      setAppliedFilters((prevFilters) => ({
        ...prevFilters,
        "search_text": [],
      }));
      return;
    }

    // remove the selected item from the list of filters
    const updatedFilters = appliedFilters[filterType].filter((filter) => filter !== filterValue);
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: updatedFilters,
    }));
  }

  // for now 2022 is selected by default
  // TODO: update default year to the most recent year
  const handleClearFundingYearRangeFilter = () => {
    setAppliedFilters((prevFilters) =>({
      ...prevFilters,
      "funding_year": ["2022"],
    }));
    setRangeString("");
  }

  

  return (
    <div style={{ with: '45rem' }}>
      {Object.entries(appliedFilters).map(([filterType, filterValues]) => {
        return filterType === 'search_text' && filterValues.length > 0 ? (
          <Chip
            key={filterType}
            label={searchText}
            onDelete={() => handleClearFilter(filterValues, filterType)}
            deleteIcon={<ClearIcon />}
            style={{
              margin: '4px',
              backgroundColor: '#77AEED',
            }}
          />
        ) : filterType === 'funding_year' && filterValues.length > 1 ? (
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
              label={filter}
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
    </div>
  );
};

export default FilterList;