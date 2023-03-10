import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'next/link';

export default function LinkItem({ IconDefault, IconHover, title, to, open }) {
  const router = useRouter();

  const [hover, setHover] = useState(false);
  let thisPage = false;

  if (new RegExp(`${router.pathname}$`).test(to)) {
    thisPage = true;
  }

  return (
    <Link
      href={to}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex w-full items-center gap-2 rounded-[7px] p-1.5 duration-200 ${
        !open ? 'justify-center' : null
      } ${thisPage ? 'bg-emerald-400 text-white' : 'hover:bg-zinc-200'}`}
    >
      {(hover || thisPage) ? (
        <IconHover sx={{ fontSize: 22 }} />
      ) : (
        <IconDefault sx={{ fontSize: 22 }} />
      )}
      {open ? <span className="text-xs font-medium whitespace-nowrap">{title}</span> : null}
    </Link>
  );
}

LinkItem.propTypes = {
  IconDefault: PropTypes.object.isRequired,
  IconHover: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};
