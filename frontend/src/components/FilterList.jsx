import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';

const FilterList = ({ filters, onClearFilter }) => {

  return (
    <div style={{ with: '38.25rem' }}>
      {Object.entries(filters).map(([filterType, filterValues]) =>
        filterValues.map((filter, index) => (
          <Chip
            key={index}
            label={filter}
            onDelete={() => onClearFilter(filter, filterType)}
            deleteIcon={<ClearIcon />}
            style={{ margin: '4px', backgroundColor: '#77AEED' }}
          />
        ))
      )}
    </div>
  );
};

export default FilterList