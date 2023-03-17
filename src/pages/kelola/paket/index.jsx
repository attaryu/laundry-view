import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import DropDown from '@/components/DropDown';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import SearchBar from '@/components/SearchBar';

import { useGetNameOutletQuery } from '@/stores/outlet/outletApi';
import { useGetPackageQuery, useDeletePackageMutation } from '@/stores/package/packageApi';

import ActionButton from '@/components/ActionButton';
import PaginationButton from '@/components/PaginationButton';

import MySwal from '@/lib/alert';
import firstToUpperCase from '@/lib/firstToUpperCase';

export default function Paket() {
  const router = useRouter();
  const { auth } = useSelector((states) => states);
  const privileges = /manajer/ig.test(auth.role);

  let options = [];

  const {
    isSuccess: outletIsSuccess,
    data: outletData,
  } = useGetNameOutletQuery();

  const {
    isError: getIsError,
    isLoading: getIsLoading,
    data: getData,
    error: getError,
  } = useGetPackageQuery({
    page: router.query.page,
    jenis: router.query.jenis,
    outletId: router.query.id_outlet,
    search: router.query.search,
  });

  const [deletePackage, {
    isError: deleteIsError,
    isSuccess: deleteIsSuccess,
    error: deleteError,
  }] = useDeletePackageMutation();

  useEffect(() => {
    if (deleteIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Berhasil menghapus data staff', 'success');
    }

    if (deleteIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', deleteError?.data?.message, 'error');
    }
  }, [deleteIsError, deleteIsSuccess]);

  function goDelete(id, nama) {
    return () => {
      MySwal.fire({
        title: `Hapus Staff ${nama}?`,
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
          deletePackage(id);
        }
      });
    };
  }

  if (getIsError) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Error message={getError.data?.message} />
      </main>
    );
  }

  if (getIsLoading) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Loading />
      </main>
    );
  }

  if (outletIsSuccess) {
    options = outletData.map((data) => ({ name: data.nama, value: data.id }));
  }

  return (
    <>
      <Head>
        <title>Daftar Paket</title>
      </Head>
      <div className="w-full p-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Daftar Paket</h1>
          {privileges ? (
            <Link
              href="/kelola/paket/tambah"
              className="py-1.5 px-2.5 w-fit bg-emerald-400 hover:bg-emerald-500 font-semibold text-white rounded-md text-sm"
            >
              Tambah Paket
            </Link>
          ) : null}
        </header>

        <main className="mt-10">

          {/* filter */}
          <div className="mt-2 flex w-full items-center justify-end gap-3">
            <DropDown
              title="Jenis"
              param="jenis"
              options={[
                { name: 'Kiloan', value: 'kiloan' },
                { name: 'Kaos', value: 'kaos' },
                { name: 'Selimut', value: 'selimut' },
                { name: 'Bed Cover', value: 'bed_cover' },
              ]}
            />
            {options.length !== 0 ? (
              <DropDown
                title="Outlet"
                param="id_outlet"
                options={options}
              />
            ) : null}
            <SearchBar />
          </div>

          {/* tabel */}
          <table className="mt-5 mb-3 w-full table-auto rounded-lg outline outline-[1.5px] outline-zinc-200">
            <thead className="border-b-[1.5px] bg-zinc-100 outline-zinc-200">
              <tr>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Nama</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Jenis</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Outlet</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Harga</th>
                {privileges ? (
                  <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Aksi</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {getData.payload.map((paket) => (
                <tr key={paket.id}>
                  <td className="p-2 px-2 text-sm">{firstToUpperCase(paket.nama_paket)}</td>
                  <td className="p-2 px-2 text-sm">{firstToUpperCase(paket.jenis)}</td>
                  <td className="p-2 px-2 text-sm">{firstToUpperCase(paket.tb_outlet.nama)}</td>
                  <td className="p-2 px-2 text-sm">{(paket.harga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                  {privileges ? (
                    <td className="flex gap-2 p-2 px-2 text-sm">
                      <ActionButton type="edit" href={`/kelola/paket/${paket.id}/edit`} />
                      <ActionButton type="delete" handler={goDelete(paket.id, paket.nama_paket)} />
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>

          {/* total data */}
          <small className="font-medium text-zinc-500">
            Total
            {' '}
            {getData.total}
            {' '}
            Paket
          </small>
        </main>

        {/* pagination button */}
        {getData && getData.all_page > 1 ? (
          <footer className="mt-5 flex items-center gap-3">
            <PaginationButton totalPage={getData.all_page} page={getData.page} url="/kelola/staff" />
          </footer>
        ) : null}
      </div>
    </>
  );
}
