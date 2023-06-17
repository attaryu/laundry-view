import PropTypes from 'prop-types';

export default function OperatorSwitcher({ order, event, operator }) {
  if (order === 1) {
    return <p className="bg-zinc-100 w-16 rounded-md text-center py-1">Where</p>;
  }

  if (order === 2) {
    return (
      <select className="bg-zinc-200 w-16 rounded-md text-center py-1" onChange={event} value={operator}>
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>
    );
  }

  return <p className="bg-zinc-100 w-16 rounded-md text-center py-1">{operator}</p>;
}

OperatorSwitcher.propTypes = {
  order: PropTypes.number.isRequired,
  event: PropTypes.func.isRequired,
  operator: PropTypes.oneOf(['AND', 'OR']),
};

OperatorSwitcher.defaultProps = {
  operator: null,
};
