import PropTypes from 'prop-types';
import { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export default function ActionButton({ type, handler }) {
  const [hover, setHover] = useState(false);

  if (type === 'edit') {
    return (
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handler}
        className="bg-amber-50 p-0.5 rounded-sm outline outline-1 text-amber-400 outline-amber-400"
        title="Edit"
      >
        {hover ? (
          <EditIcon fontSize="small" />
        ) : (
          <EditOutlinedIcon fontSize="small" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handler}
      className="bg-red-50 p-0.5 rounded-sm outline outline-1 text-red-400 outline-red-400"
      title="Delete"
    >
      {hover ? (
        <DeleteIcon fontSize="small" />
      ) : (
        <DeleteOutlinedIcon fontSize="small" />
      )}
    </button>
  );
}

ActionButton.propTypes = {
  type: PropTypes.oneOf(['edit', 'delete']).isRequired,
  handler: PropTypes.func.isRequired,
};
