import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';

const FilterList = ({ filters, onClearFilter }) => {
  return (
    <div style={{with: '38.25rem'}}>
      {filters.map((filter, index) => (
        <Chip
          key={index}
          label={filter}
          onDelete={() => onClearFilter(filter)}
          deleteIcon={<ClearIcon />}
          style={{ margin: '4px' }}
        />
      ))}
    </div>
  );
};

export default FilterList