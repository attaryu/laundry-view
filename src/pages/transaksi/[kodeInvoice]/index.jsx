import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Image from 'next/image';
import Moment from 'react-moment';

import Loading from '@/components/Loading';
import Error from '@/components/Error';

import {
  useGetDetailTransactionQuery,
  useChangeStatusTransactionMutation,
  usePaidOffTransactionMutation,
} from '@/stores/transaction/transactionApi';

import firstToUpperCase from '@/lib/firstToUpperCase';
import MySwal from '@/lib/alert';

export default function DetailTransaksi() {
  const router = useRouter();
  const [skip, setSkip] = useState(true);
  // const [status, setStatus] = useState(true);

  const {
    isError,
    isSuccess,
    data,
    error,
    refetch,
  } = useGetDetailTransactionQuery(router.query.kodeInvoice, { skip });

  const [paid, {
    isError: paidIsError,
    error: paidError,
  }] = usePaidOffTransactionMutation();
  const [changeStatus, {
    isError: statusIsError,
    error: statusError,
  }] = useChangeStatusTransactionMutation();

  useEffect(() => {
    if (router.query.kodeInvoice) {
      setSkip(false);
    }
  }, [router.query.kodeInvoice]);

  useEffect(() => {
    if (paidIsError || statusIsError) {
      MySwal.fire('Gagal', paidError?.data?.message || statusError.data.message, 'error');
    }
  }, [statusIsError, paidIsError]);

  function changeStatusHandler(kodeInvoice, status) {
    changeStatus({ kodeInvoice, status });
    refetch(router.query.kodeInvoice);
  }

  function paidHandler(kodeInvoice, lunas) {
    if (lunas) {
      paid({ kodeInvoice, paidOff: 'not_yet_paid_off' });
    } else if (!lunas) {
      paid({ kodeInvoice, paidOff: 'paid_off' });
    }
    refetch(router.query.kodeInvoice);
  }

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Detail Outlet</title>
        </Head>
        <div className="w-full p-8">
          <header className="flex justify-between items-center">
            <Moment locale="id" format="DD MMMM YYYY - hh:mm:ss" className="text-xs text-zinc-500">
              {data.tanggal}
            </Moment>

            <div className="flex gap-2 items-center">
              <p className="text-xs font-medium">Kode Invoice</p>
              <p className="py-1 px-1.5 text-xs bg-amber-300 font-medium rounded-md">{data.kode_invoice}</p>
            </div>
          </header>
          <main className="px-20">
            {/* total dan diskon */}
            <section className="w-full grid place-items-center p-20">
              <div className="flex flex-col items-center gap-7  ">
                <div className="flex gap-3 items-center">
                  <h1 className="font-bold text-xl">Total</h1>
                  {data.diskon !== 0 ? (
                    <>
                      <p className="text-sm text-zinc-700">dengan</p>
                      <p className="py-1 px-2.5 text-sm bg-emerald-200 border-2 font-semibold text-emerald-700 border-emerald-300 shadow-lg rounded-full">
                        Diskon
                        {' '}
                        {data.diskon}
                        %
                      </p>
                    </>
                  ) : null}
                </div>

                <p className="font-bold text-4xl">
                  {(data.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </p>
              </div>
            </section>

            <section className="grid grid-cols-2 grid-rows-3 w-full gap-5">
              {/* pelanggan */}
              <div className="bg-zinc-100 border-2 border-zinc-200 rounded-xl p-4 shadow-lg">
                <h1 className="font-bold">Pelanggan</h1>

                <div className="mt-3">
                  <p className="text-sm">
                    <span className="font-semibold pr-2">Nama:</span>
                    {' '}
                    {data.tb_pelanggan.nama}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold pr-2">Jenis Kelamin:</span>
                    {' '}
                    {firstToUpperCase(data.tb_pelanggan.jenis_kelamin)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold pr-2">Alamat:</span>
                    {' '}
                    {firstToUpperCase(data.tb_pelanggan.alamat)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold pr-2">Telepon:</span>
                    {' '}
                    {firstToUpperCase(data.tb_pelanggan.telepon)}
                  </p>
                </div>
              </div>

              {/* outlet */}
              <div className="bg-zinc-100 border-2 border-zinc-200 rounded-xl p-4 shadow-lg">
                <h1 className="font-bold">Outlet</h1>

                <div className="mt-3">
                  <p className="text-sm">
                    <span className="font-semibold pr-2">Nama:</span>
                    {' '}
                    {data.tb_outlet.nama}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold pr-2">Alamat:</span>
                    {' '}
                    {firstToUpperCase(data.tb_outlet.alamat)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold pr-2">Telepon:</span>
                    {' '}
                    {firstToUpperCase(data.tb_outlet.telepon)}
                  </p>
                </div>
              </div>

              {/* paket */}
              <div className="bg-zinc-100 border-2 border-zinc-200 shadow-lg rounded-xl px-7 col-span-2 flex items-center gap-7">
                <Image
                  src={`/package/${data.tb_paket.jenis}.jpg`}
                  alt={data.tb_paket.nama_paket}
                  width={110}
                  height={110}
                  className="rounded-full"
                />
                <h1 className="font-bold text-3xl">{firstToUpperCase(data.tb_paket.nama_paket)}</h1>
                <small className="font-semibold text-lg text-zinc-500 ml-auto">{(data.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</small>
              </div>

              <div className="bg-zinc-100 border-2 border-zinc-200 shadow-lg rounded-xl p-2 flex items-center justify-center">
                <select
                  value={data.status}
                  onChange={(e) => changeStatusHandler(data.kode_invoice, e.target.value)}
                  className="bg-transparent text-lg font-semibold outline outline-1 p-2 rounded-lg"
                >
                  <option value="antrian">Antrian</option>
                  <option value="proses">Proses</option>
                  <option value="selesai">Selesai</option>
                  <option value="diambil">Diambil</option>
                </select>
              </div>

              <div className={`${
                data.lunas ? 'bg-emerald-100 border-[1.5px] border-emerald-300 hover:bg-emerald-200' : 'bg-red-100 border-[1.5px] border-red-300 hover:bg-red-200'
              } shadow-lg rounded-xl p-2`}
              >
                <button
                  type="button"
                  className="w-full h-full text-lg font-semibold"
                  onClick={() => paidHandler(data.kode_invoice, data.lunas)}
                >
                  {data.lunas ? 'Lunas' : 'Belum lunas'}
                </button>
              </div>
            </section>
          </main>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Error message={error.data.message} />
      </main>
    );
  }

  return (
    <main className="w-full h-screen grid place-items-center">
      <Loading />
    </main>
  );
}
