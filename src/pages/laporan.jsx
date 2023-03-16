import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Head from 'next/head';
import { PDFViewer } from '@react-pdf/renderer';

import Error from '@/components/Error';
import Loading from '@/components/Loading';
import PDFFile from '@/components/PDFFile';

import { useGetNameOutletQuery } from '@/stores/outlet/outletApi';
import { useTransactionReportQuery } from '@/stores/report/reportApi';

import MySwal from '@/lib/alert';

export default function Report() {
  const { register, handleSubmit } = useForm();
  const [skip, setSkip] = useState(true);
  const [query, setQuery] = useState(true);

  const {
    isError,
    isSuccess,
    error,
    data,
  } = useGetNameOutletQuery();

  const {
    isSuccess: reportSuccess,
    data: reportData,
  } = useTransactionReportQuery(query, { skip });

  useEffect(() => {
    if (reportSuccess) {
      MySwal.hideLoading();
      MySwal.clickConfirm();
    }
  }, [reportSuccess]);

  function generateReportHandler(body) {
    setQuery(body);
    setSkip(true);

    MySwal.showLoading();

    setTimeout(() => {
      setSkip(false);
    }, 100);
  }

  if (isError) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Error message={error.data?.message} />
      </main>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Head><title>Laporan</title></Head>
        <main className="w-full p-8 flex">
          <div className="bg-zinc-100 border-[1.5px] border-zinc-300 shadow-lg py-10 rounded-lg w-1/3">
            <h1 className="font-bold text-center">Laporan Transaksi</h1>

            <form className="flex flex-col items-center gap-5 mt-5" onSubmit={handleSubmit((body) => generateReportHandler(body))}>
              <div className="flex flex-col gap-2.5">
                <p className="text-sm font-medium text-zinc-600 text-center">Outlet</p>

                <select
                  className="text-sm bg-zinc-200 py-1 px-2 rounded-md"
                  {...register('target')}
                >
                  <option value="all">Outlet</option>
                  {data.map((outlet) => (
                    <option key={outlet.id} value={outlet.id}>{outlet.nama}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-sm font-medium text-zinc-600 text-center">Tanggal</p>

                <input
                  type="date"
                  className="text-sm bg-zinc-200 py-1 px-2 rounded-md"
                  {...register('dateFrom', {
                    required: {
                      message: 'Tanggal harus di isi',
                      value: true,
                    },
                  })}
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-sm font-medium text-zinc-600 text-center">sampai</p>

                <input
                  type="date"
                  className="text-sm bg-zinc-200 py-1 px-2 rounded-md"
                  {...register('dateUntil', {
                    required: {
                      message: 'Tanggal harus di isi',
                      value: true,
                    },
                  })}
                />
              </div>

              <button
                type="submit"
                className="bg-amber-400 py-1 px-4 rounded-md font-semibold mt-5"
              >
                Generate
              </button>
            </form>
          </div>

          <aside className="w-full pl-5">
            <PDFViewer width={800} height={600}>
              {reportSuccess ? <PDFFile data={reportData} query={query} /> : null}
            </PDFViewer>
          </aside>
        </main>
      </>
    );
  }

  return (
    <main className="w-full h-screen grid place-items-center">
      <Loading />
    </main>
  );
}
