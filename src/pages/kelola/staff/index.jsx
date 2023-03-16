import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import DropDown from '@/components/DropDown';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import SearchBar from '@/components/SearchBar';

import { useGetNameOutletQuery } from '@/stores/outlet/outletApi';
import { useDeleteUserMutation, useGetAllUserQuery } from '@/stores/user/userApi';

import ActionButton from '@/components/ActionButton';
import PaginationButton from '@/components/PaginationButton';

import MySwal from '@/lib/alert';
import firstToUpperCase from '@/lib/firstToUpperCase';

export default function Staff() {
  const router = useRouter();

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
  } = useGetAllUserQuery({
    page: router.query.page,
    role: router.query.role,
    idOutlet: router.query.id_outlet,
    search: router.query.search,
  });

  const [deleteUser, {
    isError: deleteIsError,
    isSuccess: deleteIsSuccess,
    error: deleteError,
  }] = useDeleteUserMutation();

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
          deleteUser(id);
        }
      });
    };
  }

  if (outletIsSuccess) {
    options = outletData.map((data) => ({ name: data.nama, value: data.id }));
  }

  if (getIsLoading) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Loading />
      </main>
    );
  }

  if (getIsError) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Error message={getError.data?.message} />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Daftar Staff</title>
      </Head>
      <div className="w-full p-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Daftar Staff</h1>
          <Link
            href="/kelola/staff/tambah"
            className="py-1.5 px-2.5 w-fit bg-emerald-400 hover:bg-emerald-500 font-semibold text-white rounded-md text-sm"
          >
            Tambah Staff
          </Link>
        </header>

        <main className="mt-10">

          {/* filter */}
          <div className="mt-2 flex w-full items-center justify-end gap-3">
            <DropDown
              title="Role"
              param="role"
              options={[
                { name: 'Kasir', value: 'kasir' },
                { name: 'Manajer', value: 'manajer' },
                { name: 'Admin', value: 'admin' },
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
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Username</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Role</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Outlet</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {getData.payload.map((staff) => (
                <tr key={staff.id}>
                  <td className="p-2 px-2 text-sm font-semibold">
                    <Link href={`/kelola/staff/${staff.id}`} className="underline hover:no-underline">
                      {firstToUpperCase(staff.name)}
                    </Link>
                  </td>
                  <td className="p-2 px-2 text-sm">{staff.username}</td>
                  <td className="p-2 px-2 text-sm">{firstToUpperCase(staff.role)}</td>
                  <td className="p-2 px-2 text-sm">{firstToUpperCase(staff.tb_outlet.nama)}</td>
                  <td className="flex gap-2 p-2 px-2 text-sm">
                    <ActionButton type="edit" href={`/kelola/staff/${staff.id}/edit`} />
                    <ActionButton type="delete" handler={goDelete(staff.id, staff.name)} />
                  </td>
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
            Staff
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
