import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';

function FilterList({ filters, setFilters, rangeString, setRangeString }) {

  const searchText = filters["SearchText"].join(" OR ");

  const handleClearFilter = (filterValue, filterType) => {
    if (filterType === "SearchText") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        "SearchText": [],
      }));
      return;
    }
    const updatedFilters = filters[filterType].filter((filter) => filter !== filterValue);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: updatedFilters,
    }));
  }

  const handleClearFundingYearRangeFilter = () => {
    setFilters((prevFilters) =>({
      ...prevFilters,
      "FundingYear": ["2022/2023"],
    }));
    setRangeString("");
  }

  

  return (
    <div style={{ with: '45rem' }}>
      {Object.entries(filters).map(([filterType, filterValues]) => {
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