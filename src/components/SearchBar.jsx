import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ value, handler }) {
  const router = useRouter();

  useEffect(() => {
    if (value !== '') {
      router.push({ query: { ...router.query, search: value } }, undefined, { shallow: true });
    } else if (router.query.search) {
      const { search: any, ...query } = router.query;
      router.push({ query }, undefined, { shallow: true });
    }
  }, [value]);

  useEffect(() => {
    if (router.query.search) {
      handler(router.query.search);
    }
  }, [router.query.search]);

  return (
    <label
      htmlFor="search"
      className=" py-1 px-1.5 rounded-md gap-2 flex items-center outline-1 outline"
    >
      <SearchIcon sx={{ fontSize: '1.1rem' }} />

      <input
        type="text"
        id="search"
        value={value}
        onChange={(e) => handler(e.target.value)}
        className="bg-inherit w-32 outline-none text-xs"
        placeholder="Search"
      />
    </label>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
};
