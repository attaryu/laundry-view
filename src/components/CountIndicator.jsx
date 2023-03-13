import PropTypes from 'prop-types';

export default function CountIndicator({ title, count }) {
  return (
    <div className="w-24 h-24 gap-1.5 bg-emerald-400 rounded-xl shadow-xl flex items-center justify-center flex-col">
      <h1 className="font-medium text-sm text-white">{title}</h1>
      <p className="text-3xl font-medium text-white">{count}</p>
    </div>
  );
}

CountIndicator.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
