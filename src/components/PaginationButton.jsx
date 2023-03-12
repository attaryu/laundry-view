import PropTypes from 'prop-types';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';

/*
  [1] 2 3 ... 7
  1 [2] 3 4 ... 7
  1 2 [3] 4 5 ... 7
  1 ... 3 [4] 5 ... 7
        1 ... 3 4 [5] 6 7
          1 ... 4 5 [6] 7
            1 ... 5 6 [7]
*/

function PaginationButton({ page, totalPage }) {
  let startPage = page - 2;
  let lastPage = page + 2;
  let renderButton = 5;

  if (startPage < 1) {
    startPage = 1;

    if (page === 2 && totalPage > 3) {
      renderButton = 4;
    } else if (totalPage > 2) {
      renderButton = 3;
    } else {
      renderButton = 2;
    }
  } else if (lastPage > totalPage) {
    lastPage = totalPage;

    if (page === lastPage) {
      renderButton = 3;
    } else {
      renderButton = 4;
    }
  }

  return (
    <div className="flex gap-3 w-full items-center justify-center">
      {startPage > 1 ? (
        <>
          <Linked page={1} />
          <Dot />
        </>
      ) : null}
      {[...Array(renderButton)].map((x, i) => (
        <Linked page={i + startPage} />
      ))}
      {lastPage < totalPage ? (
        <>
          <Dot />
          <Linked page={totalPage} />
        </>
      ) : null}
    </div>
  );
}

export default memo(PaginationButton);

PaginationButton.propTypes = {
  page: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
};

function Linked({ page }) {
  const router = useRouter();
  const thisPage = Number(router.query.page) === page;

  return (
    <Link
      href={`/kelola/pelanggan?page=${page}`}
      className={`w-7 h-7 grid place-items-center rounded-sm bg-amber-300 ${thisPage ? 'bg-amber-400 outline outline-1' : ''}`}
    >
      {page}
    </Link>
  );
}

Linked.propTypes = {
  page: PropTypes.number.isRequired,
};

function Dot() {
  return (
    <div className="flex gap-1">
      <div className="w-1 h-1 bg-zinc-400 rounded-full" />
      <div className="w-1 h-1 bg-zinc-400 rounded-full" />
      <div className="w-1 h-1 bg-zinc-400 rounded-full" />
    </div>
  );
}
