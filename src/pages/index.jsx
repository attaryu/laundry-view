import PropTypes from 'prop-types';
import { memo, useEffect, useState } from 'react';

import Link from 'next/link';
import Head from 'next/head';

import Graph from '@/components/Graph';
import Label from '@/components/Label';
import Spinner from '@/components/Spinner';
import Loading from '@/components/Loading';

import { useGetAnalyticQuery } from '@/stores/analythic/analythicApi';
import { useGetMailQuery } from '@/stores/mail/mailApi';

export default function Home() {
  const [today, setToday] = useState('today');

  const {
    data,
    isSuccess,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAnalyticQuery(today);

  useEffect(() => {
    refetch(today);
  }, [today]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Beranda</title>
        </Head>
        <div className="grid place-items-center h-screen w-full gap-5 bg-zinc-100 px-7 py-5">
          <Loading />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Head>
          <title>Beranda</title>
        </Head>
        <div className="grid place-items-center h-screen w-full gap-5 bg-zinc-100 px-7 py-5">
          <p className="font-semibold opacity-40">{error.data.message}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Beranda</title>
      </Head>
      <div className="flex h-screen w-full gap-5 bg-zinc-100 px-7 py-5">
        <main className="w-full flex flex-col gap-5">
          {/* Total income */}
          <section>
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold">Penghasilan</h1>

              <select
                className="h-6 rounded-md px-1 text-xs font-medium outline outline-1"
                value={today}
                onChange={(e) => setToday(e.target.value)}
              >
                <option value="today">Hari Ini</option>
                <option value="all">Keseluruhan</option>
              </select>
            </div>
            <div className="mt-3 flex items-center gap-5 rounded-lg bg-gradient-to-r from-emerald-300 to-emerald-50 p-3 shadow-lg">
              <span className="rounded-md bg-yellow-300 p-2.5 text-lg font-bold duration-300">IDR</span>
              {isLoading ? (
                <>
                  <Spinner color={{ spin: 'fill-zinc-900', bgSpin: 'fill-zinc-100' }} />
                  <p className="font-bold">Loading...</p>
                </>
              ) : null}
              {isSuccess ? (
                <p className="text-xl font-bold">
                  {data.income.toLocaleString('id-ID', { currency: 'IDR', style: 'currency' })}
                </p>
              ) : null}
              {isError ? <p className="text-xl font-bold">0</p> : null}
            </div>
          </section>

          {/* Total data */}
          <section className="w-4/5">
            <h1 className="text-lg font-bold">Total</h1>

            <ul className="mt-3 flex gap-8">
              <Item count={data.total.pelanggan} title="Pelanggan" />
              <Item count={data.total.outlet} title="Outlet" />
              <Item count={data.total.staff} title="Staff" />
              <Item count={data.total.transaksi} title="Transaksi" />
            </ul>
          </section>

          {/* Linechart intensitas penjualan */}
          <section className="h-48">
            <h1 className="text-lg font-bold">Intensitas Transaksi</h1>

            <div className="mt-3 h-full w-[750px] rounded-lg bg-white shadow-xl">
              <Graph data={data.graph} />
            </div>
          </section>
        </main>

        {/* kotak surat */}
        <aside className="flex h-full w-[45%] flex-col gap-2">
          <h1 className="font-semibold text-center text-sm opacity-60">Mailbox</h1>
          <MailBox />
        </aside>
      </div>
    </>
  );
}

function MailBox() {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useGetMailQuery();

  if (isLoading) {
    return (
      <div className="mt-2 grid place-items-center h-full w-full gap-5 rounded-lg bg-white p-3 shadow-lg">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-2 grid place-items-center h-full w-full gap-5 rounded-lg bg-white p-3 shadow-lg">
        <p className="font-semibold opacity-40">{error.message}</p>
      </div>
    );
  }

  return (
    <ul className="mt-2 flex flex-col h-full w-full gap-5 rounded-lg bg-white p-3 shadow-lg">
      {data.slice(0, 7).map((email) => (
        <li className="flex" key={email.id}>
          <img
            src={`https://ui-avatars.com/api/?name=${email.tb_user.name
              .split(' ')
              .join('+')}&background=random&color=random&bold=true&format=svg&rounded=true`}
            alt={`${email.tb_user.name} profile's`}
            width={50}
            height={50}
          />
          <div className="ml-2.5 w-full">
            <div className="flex items-center justify-between w-full">
              <Link
                href={`/kota-surat/surat/${email.id}`}
                className="w-28 truncate text-sm font-semibold hover:underline"
              >
                {email.judul}
              </Link>
              {email.penting ? <Label text="Penting" /> : null}
            </div>
            <p className="w-32 truncate text-xs opacity-70">{email.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const Item = memo(({ count, title }) => (
  <li className="flex h-24 w-24 flex-col items-center justify-center gap-3 rounded-lg bg-white shadow-xl">
    <span className="text-2xl font-semibold">{count}</span>
    <h1 className="text-xs font-semibold">{title}</h1>
  </li>
));

Item.propTypes = {
  count: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};
