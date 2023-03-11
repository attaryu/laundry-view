import PropTypes from 'prop-types';

export default function Label({ text }) {
  return (
    <small className="border-[1.5px] text-xs px-1 rounded-[5px] border-amber-500 text-amber-500 font-medium">
      {text}
    </small>
  );
}

Label.propTypes = {
  text: PropTypes.string.isRequired,
};
