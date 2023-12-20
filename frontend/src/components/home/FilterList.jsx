import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';

function FilterList({ filters, onClearFilter }) {

  const searchText = filters["SearchText"].join(" OR ");

  return (
    <div style={{ with: '45rem' }}>
      {Object.entries(filters).map(([filterType, filterValues]) => {
        return filterType === 'SearchText' && filterValues.length > 0 ? (
          <Chip
            key={filterType}
            label={searchText}
            onDelete={() => onClearFilter(filterValues, filterType)}
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
              onDelete={() => onClearFilter(filter, filterType)}
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