import { FiltersContext } from '../../App';
import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';
import { useContext } from 'react';

function FilterList({ rangeString, setRangeString }) {

  const { appliedFilters, setAppliedFilters } = useContext(FiltersContext);

  const searchText = appliedFilters["SearchText"].join(" OR ");

  const handleClearFilter = (filterValue, filterType) => {
    if (filterType === "SearchText") {
      setAppliedFilters((prevFilters) => ({
        ...prevFilters,
        "SearchText": [],
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

  const handleClearFundingYearRangeFilter = () => {
    setAppliedFilters((prevFilters) =>({
      ...prevFilters,
      "FundingYear": ["2022"],
    }));
    setRangeString("");
  }

  

  return (
    <div style={{ with: '45rem' }}>
      {Object.entries(appliedFilters).map(([filterType, filterValues]) => {
        return filterType === 'SearchText' && filterValues.length > 0 ? (
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
        ) : filterType === 'FundingYear' && filterValues.length > 1 ? (
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