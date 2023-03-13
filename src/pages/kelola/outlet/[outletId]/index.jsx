import { useEffect } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import LocationOnIcon from '@mui/icons-material/LocationOn';

import CountIndicator from '@/components/CountIndicator';
import Card from '@/components/Card';
import TransactionItem from '@/components/TransactionItem';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

import { useGetDetailOutletQuery, useDeleteOutletMutation } from '@/stores/outlet/outletApi';

import firstToUpperCase from '@/lib/firstToUpperCase';
import MySwal from '@/lib/alert';

import outletImage from '@/public/outlet/outlet.jpg';

export default function DetailOutlet() {
  const router = useRouter();

  const {
    isError,
    isLoading,
    data,
    error,
  } = useGetDetailOutletQuery(router.query.outletId);

  const [deleteOutlet, {
    isError: deleteIsError,
    isSuccess: deleteIsSuccess,
    error: deleteError,
  }] = useDeleteOutletMutation();

  useEffect(() => {
    if (deleteIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Berhasil menghapus data outlet', 'success');
      router.push('/kelola/outlet?page=1');
    }

    if (deleteIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', deleteError?.data?.message, 'error');
    }
  }, [deleteIsError, deleteIsSuccess]);

  function deleteOutletHandler(id, name) {
    return () => {
      MySwal.fire({
        title: `Hapus Outlet ${name}?`,
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
          deleteOutlet(id);
        }
      });
    };
  }

  if (isLoading) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Loading />
      </main>
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
    <>
      <Head>
        <title>Detail Outlet</title>
      </Head>
      <div className="w-full py-7 px-20">
        <header className="flex w-full items-center justify-between">
          <Image src={outletImage} alt="Outlet image profile" className="h-40 w-40 rounded-full" priority />
          <div className="flex gap-10">
            <CountIndicator title="Manajer" count={data.jumlah_manajer} />
            <CountIndicator title="Kasir" count={data.jumlah_kasir} />
            <CountIndicator title="Transaksi" count={data.jumlah_transaksi} />
          </div>
        </header>

        <main className="w-full">
          {/* profile */}
          <section className="mt-14 flex flex-col gap-1">
            <h1 className="text-3xl font-bold">{firstToUpperCase(data.nama)}</h1>
            <small className="text-sm font-medium text-zinc-400">
              ID:
              {' '}
              {data.id}
            </small>

            {/* address */}
            <div className="mt-5 flex w-fit items-center gap-3 rounded-full bg-emerald-300 p-1 shadow-xl">
              <div className="grid aspect-square place-items-center rounded-full bg-white p-1">
                <LocationOnIcon sx={{ fontSize: 23 }} />
              </div>
              <address className="block pr-3 text-sm font-semibold not-italic">
                {data.alamat}
              </address>
            </div>
          </section>

          {/* transaksi terbaru */}
          {data.tb_paket.length !== 0 ? (
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

          {/* daftar paket */}
          {data.tb_paket.length !== 0 ? (
            <section className="mt-20">
              <h1 className="text-xl font-bold">Daftar Paket</h1>

              <ul className="mt-8 grid w-full grid-cols-4 gap-7">
                {data.tb_paket.map((paket) => (
                  <li key={paket.id}>
                    <Card
                      imgUrl={`/package/${paket.jenis}.jpg`}
                      isCustomImage
                      title={firstToUpperCase(paket.nama_paket)}
                      text={firstToUpperCase(paket.jenis)}
                      additionalText={(paket.harga).toLocaleString('id', { currency: 'IDR', style: 'currency' })}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* daftar staff */}
          {data.tb_user.length !== 0 ? (
            <section className="mt-20">
              <h1 className="text-xl font-bold">Daftar Staff</h1>

              <ul className="mt-8 grid w-full grid-cols-4 gap-7">
                {data.tb_user.map((user) => (
                  <li key={user.id}>
                    <Card imgUrl={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=random&bold=true&format=svg&rounded=true`} title={firstToUpperCase(user.name)} text={firstToUpperCase(user.role)} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </main>

        <footer className="mt-20 flex gap-5">
          <Link
            href={`/kelola/outlet/${data.id}/edit`}
            className="grid w-full place-items-center rounded-lg bg-amber-400 py-3 font-semibold text-white hover:bg-amber-300"
          >
            Edit
          </Link>
          <button
            type="button"
            className="w-full rounded-lg bg-red-400 py-3 font-semibold text-white hover:bg-red-300"
            onClick={deleteOutletHandler(data.id, data.nama)}
          >
            Hapus
          </button>
        </footer>
      </div>
    </>
  );
}
