import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

export default function DropDown({ title, param, options, value, changeHandler }) {
  const router = useRouter();

  useEffect(() => {
    if (value !== '') {
      router.replace({ query: { ...router.query, [param]: value } }, undefined, { shallow: true });
    } else if (router.query[param]) {
      const { [param]: any, ...query } = router.query;
      router.replace({ query }, undefined, { shallow: true });
    }
  }, [value]);

  useEffect(() => {
    if (router.query[param]) {
      changeHandler(router.query[param]);
    }
  }, [router.query[param]]);

  return (
    <div className="outline-1 p-1 px-2 rounded-md outline flex items-center gap-1">
      <small className="text-xs text-zinc-500">
        {title}
        {' '}
        :
      </small>
      <select
        className="text-xs outline font-medium cursor-pointer outline-none"
        onChange={(e) => changeHandler(e.target.value)}
        value={value}
      >
        {options.map((op) => (
          <option
            key={Math.random()}
            value={op.value}
          >
            {op.name}
          </option>
        ))}
      </select>
    </div>
  );
}

DropDown.propTypes = {
  title: PropTypes.string.isRequired,
  param: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.exact({
    value: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  value: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};
