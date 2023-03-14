import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import Error from '@/components/Error';
import Loading from '@/components/Loading';
import TransactionItem from '@/components/TransactionItem';

import { useDeleteUserMutation, useGetSpecificUserQuery } from '@/stores/user/userApi';

import MySwal from '@/lib/alert';
import firstToUpperCase from '@/lib/firstToUpperCase';

import outletImage from '@/public/outlet/outlet.jpg';

export default function DetailStaff() {
  const router = useRouter();

  const [skip, setSkip] = useState(true);

  const {
    isError,
    isSuccess,
    data,
    error,
  } = useGetSpecificUserQuery(router.query.staffId, { skip });

  const [deleteUser, {
    isError: deleteIsError,
    isSuccess: deleteIsSuccess,
    error: deleteError,
  }] = useDeleteUserMutation();

  useEffect(() => {
    setSkip(false);
  }, []);

  if (deleteIsSuccess) {
    MySwal.hideLoading();
    MySwal.fire('Berhasil', 'Berhasil menghapus data staff', 'success');
    router.push('/kelola/staff?page=1');
  }

  if (deleteIsError) {
    MySwal.hideLoading();
    MySwal.fire('Gagal', deleteError?.data?.message, 'error');
  }

  function deleteUserHandler(id, name) {
    return () => {
      MySwal.fire({
        title: `Hapus User ${name}?`,
        text: 'Seluruh data yang bersangkutan akan ikut terhapus',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        cancelButtonColor: '#4ade80',
        showConfirmButton: true,
        confirmButtonText: 'Hapus',
        confirmButtonColor: '#ef4444',
        focusCancel: true,
      }).then((result) => {
        if (result.isConfirmed) {
          MySwal.fire('Loading');
          MySwal.showLoading();
          deleteUser(id);
        }
      });
    };
  }

  if (isError) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Error message={error.data.message} />
      </main>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Detail Staff</title>
        </Head>
        <div className="w-full py-5 px-20">
          <main className="w-full">
            {/* profile */}
            <section className="w-full flex flex-col items-center py-5">
              <img
                src={`https://ui-avatars.com/api/?name=${
                  data.name || 'unknown'
                }&background=random&color=random&bold=true&format=svg&rounded=true`}
                alt={`${data.name} profile`}
                className="w-36 h-36 rounded-full"
              />
              <h1 className="text-2xl font-bold mt-10">{firstToUpperCase(data.name)}</h1>
              <small className="text-sm text-zinc-400 mt-1">{data.id}</small>
            </section>

            <section className="mt-9">
              <h2 className="text-xl font-bold">
                Sebagai
                {' '}
                {firstToUpperCase(data.role)}
                {' '}
                di outlet
              </h2>

              <div className="flex bg-emerald-200 border-2 border-emerald-300 gap-5 p-5 rounded-lg mt-8 shadow-xl">
                <Image
                  src={outletImage}
                  alt={`${data.tb_outlet.nama} outlet`}
                  className="rounded-full w-20 h-20"
                />

                <div className="flex flex-col justify-center gap-1">
                  <p className="font-bold text-2xl">{data.tb_outlet.nama}</p>
                  <small className="font-semibold opacity-70">{data.tb_outlet.id}</small>
                </div>
              </div>
            </section>

            {/* transaksi terbaru */}
            {data.tb_transaksi.length !== 0 ? (
              <section className="mt-20">
                <h1 className="text-xl font-bold">Transaksi Terbaru</h1>

                <ul className="mt-8 flex flex-col gap-5">
                  {data.tb_transaksi.map((transaksi) => (
                    <li key={transaksi.id}>
                      <TransactionItem
                        total={transaksi.total}
                        codeInvoice={transaksi.kode_invoice}
                        date={transaksi.tanggal}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </main>

          <footer className="mt-20 flex gap-5">
            <Link
              href={`/kelola/staff/${data.id}/edit`}
              className="grid w-full place-items-center rounded-lg bg-amber-400 py-3 font-semibold text-white hover:bg-amber-300"
            >
              Edit
            </Link>
            <button
              type="button"
              className="w-full rounded-lg bg-red-400 py-3 font-semibold text-white hover:bg-red-300"
              onClick={deleteUserHandler(data.id, data.nama)}
            >
              Hapus
            </button>
          </footer>
        </div>
      </>
    );
  }

  return (
    <main className="w-full h-screen grid place-items-center">
      <Loading />
    </main>
  );
}
