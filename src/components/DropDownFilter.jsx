import PropTypes from 'prop-types';

export default function DropDownFilter({
  title,
  options,
  defaultValue,
  disable,
  eventChanges,
  operator,
}) {
  const isAnd = operator === 'AND';

  return (
    <select
      disabled={disable}
      className="border-[1px] border-zinc-400 bg-zinc-100 p-1 rounded-md w-full"
      value={defaultValue || title}
      onChange={eventChanges}
      name={title}
    >
      {!defaultValue && <option disabled>{title}</option>}
      {options.map(({ name, value }) => (isAnd ? (
        <option key={Math.random()} value={value} disabled={defaultValue === value}>{name}</option>
      ) : (
        <option key={Math.random()} value={value}>{name}</option>
      )))}
    </select>
  );
}

DropDownFilter.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    // isUse: PropTypes.bool,
  })).isRequired,
  defaultValue: PropTypes.string,
  disable: PropTypes.bool,
  eventChanges: PropTypes.func.isRequired,
  operator: PropTypes.string,
};

DropDownFilter.defaultProps = {
  defaultValue: null,
  disable: false,
  operator: null,
};
