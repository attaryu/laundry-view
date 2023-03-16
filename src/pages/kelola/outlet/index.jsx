import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import ActionButton from '@/components/ActionButton';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import PaginationButton from '@/components/PaginationButton';
import SearchBar from '@/components/SearchBar';

import { useDeleteOutletMutation, useGetOutletQuery } from '@/stores/outlet/outletApi';

import MySwal from '@/lib/alert';
import firstToUpperCase from '@/lib/firstToUpperCase';

export default function Outlet() {
  const router = useRouter();
  const auth = useSelector((state) => state.auth);

  const {
    isLoading: getIsLoading,
    data: getData,
    isError: getIsError,
    error: getError,
  } = useGetOutletQuery({
    page: router.query.page,
    gender: router.query.gender,
    search: router.query.search,
  });
  const [deleteOutlet, {
    isSuccess: deleteIsSuccess,
    isError: deleteIsError,
    error: deleteError,
  }] = useDeleteOutletMutation();

  useEffect(() => {
    if (deleteIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Berhasil menghapus data outlet', 'success');
    }

    if (deleteIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', deleteError?.data?.message, 'error');
    }
  }, [deleteIsSuccess, deleteIsError]);

  function goDelete(id, name) {
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

  if (getIsLoading) {
    return (
      <main className="grid h-screen w-full place-items-center">
        <Loading />
      </main>
    );
  }

  if (getIsError) {
    return (
      <main className="grid h-screen w-full place-items-center">
        <Error message={getError?.data?.message} />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Daftar Outlet</title>
      </Head>
      <div className="w-full p-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Daftar Outlet</h1>
          {/admin/ig.test(auth.role) ? (
            <Link
              href="/kelola/outlet/tambah"
              className="py-1.5 px-2.5 w-fit bg-emerald-400 hover:bg-emerald-500 font-semibold text-white rounded-md text-sm"
            >
              Tambah Outlet
            </Link>
          ) : null}
        </header>

        <main className="mt-10">

          {/* filter */}
          <div className="mt-2 flex w-full items-center justify-end gap-3">
            <SearchBar />
          </div>

          {getData ? (
            <>
              {/* tabel */}
              <table className="mt-5 mb-3 w-full table-auto rounded-lg outline outline-[1.5px] outline-zinc-200">
                <thead className="border-b-[1.5px] bg-zinc-100 outline-zinc-200">
                  <tr>
                    <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Nama</th>
                    <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Alamat</th>
                    <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Telepon</th>
                    {/admin/ig.test(auth.role) ? (
                      <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Aksi</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {getData.payload.map((outlet) => (
                    <tr key={outlet.id}>
                      <td className="p-2 px-2 text-sm font-semibold">
                        <Link href={`/kelola/outlet/${outlet.id}`} className="underline hover:no-underline">
                          {firstToUpperCase(outlet.nama)}
                        </Link>
                      </td>
                      <td className="p-2 px-2 text-sm">
                        <address className="not-italic">{firstToUpperCase(outlet.alamat)}</address>
                      </td>
                      <td className="p-2 px-2 text-sm">{firstToUpperCase(outlet.telepon)}</td>
                      {/admin/ig.test(auth.role) ? (
                        <td className="flex gap-2 p-2 px-2 text-sm">
                          <ActionButton type="edit" href={`/kelola/outlet/${outlet.id}/edit`} />
                          <ActionButton type="delete" handler={goDelete(outlet.id, outlet.nama)} />
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
                outlet
              </small>
            </>
          ) : (
            <div className="grid h-[510px] w-full place-items-center">
              <Loading />
            </div>
          )}
        </main>

        {/* pagination button */}
        {getData && getData.all_page > 1 ? (
          <footer className="mt-5 flex items-center gap-3">
            <PaginationButton totalPage={getData.all_page} page={getData.page} url="/kelola/outlet" />
          </footer>
        ) : null}
      </div>
    </>
  );
}
