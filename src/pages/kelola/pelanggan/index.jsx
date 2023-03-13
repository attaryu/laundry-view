import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Head from 'next/head';

import ActionButton from '@/components/ActionButton';
import DropDown from '@/components/DropDown';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import PaginationButton from '@/components/PaginationButton';
import SearchBar from '@/components/SearchBar';

import { useDeleteCustomerMutation, useGetCustomerQuery } from '@/stores/customer/customerApi';

import MySwal from '@/lib/alert';
import firstToUpperCase from '@/lib/firstToUpperCase';

export default function Customer() {
  const router = useRouter();

  const [jenisKelamin, setJenisKelamin] = useState('');
  const [search, setSearch] = useState('');

  const options = [
    { name: 'Semua', value: '' },
    { name: 'Laki Laki', value: 'laki_laki' },
    { name: 'Perempuan', value: 'perempuan' },
  ];

  const {
    isLoading: isLoadingCustomer,
    data: dataCustomer,
    isError: isErrorCustomer,
    error: errorCustomer,
  } = useGetCustomerQuery({
    page: router.query.page,
    gender: router.query.gender,
    search: router.query.search,
  });
  const [deleteCustomer, {
    isSuccess: deleteIsSuccess,
    isError: deleteIsError,
    error: deleteError,
  }] = useDeleteCustomerMutation();

  useEffect(() => {
    if (deleteIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Berhasil menghapus data pelanggan', 'success');
    }

    if (deleteIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', deleteError?.data?.message, 'error');
    }
  }, [deleteIsSuccess, deleteIsError]);

  function goDelete(id, name) {
    return () => {
      MySwal.fire({
        title: `Hapus Pelanggan ${name}?`,
        text: 'Seluruh data yang bersangkutan akan ikut terhapus',
        icon: 'question',
        iconColor: '#fbbf24',
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
          deleteCustomer(id);
        }
      });
    };
  }

  if (isLoadingCustomer) {
    return (
      <main className="grid h-screen w-full place-items-center">
        <Loading />
      </main>
    );
  }

  if (isErrorCustomer) {
    return (
      <main className="grid h-screen w-full place-items-center">
        <Error message={errorCustomer?.data?.message} />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Daftar Pelanggan</title>
      </Head>
      <div className="w-full p-6">
        <header>
          <h1 className="text-2xl font-bold">Daftar Pelanggan</h1>
        </header>

        <main className="mt-10">

          {/* filter */}
          <div className="mt-2 flex w-full items-center justify-end gap-3">
            <DropDown
              title="Jenis Kelamin"
              param="gender"
              options={options}
              value={jenisKelamin}
              changeHandler={setJenisKelamin}
            />
            <SearchBar value={search} handler={setSearch} />
          </div>

          {dataCustomer ? (
            <>
              {/* tabel */}
              <table className="mt-5 mb-3 w-full table-auto rounded-lg outline outline-[1.5px] outline-zinc-200">
                <thead className="border-b-[1.5px] bg-zinc-100 outline-zinc-200">
                  <tr>
                    <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Nama</th>
                    <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Jenis Kelamin</th>
                    <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Alamat</th>
                    <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Telepon</th>
                    <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dataCustomer.payload.map((customer) => (
                    <tr key={customer.id}>
                      <td className="p-2 px-2 text-sm">{firstToUpperCase(customer.nama)}</td>
                      <td className="p-2 px-2">
                        <span
                          className={`rounded-full py-1 px-2 text-xs font-medium ${
                            customer.jenis_kelamin === 'laki_laki'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {firstToUpperCase(customer.jenis_kelamin)}
                        </span>
                      </td>
                      <td className="p-2 px-2 text-sm">{firstToUpperCase(customer.alamat)}</td>
                      <td className="p-2 px-2 text-sm">{firstToUpperCase(customer.telepon)}</td>
                      <td className="flex gap-2 p-2 px-2 text-sm">
                        <ActionButton type="edit" href={`/kelola/pelanggan/${customer.id}/edit`} />
                        <ActionButton type="delete" handler={goDelete(customer.id, customer.nama)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* total data */}
              <small className="font-medium text-zinc-500">
                Total
                {' '}
                {dataCustomer.total}
                {' '}
                pelanggan
              </small>
            </>
          ) : (
            <div className="grid h-[510px] w-full place-items-center">
              <Loading />
            </div>
          )}
        </main>

        {/* pagination button */}
        {dataCustomer && dataCustomer.all_page > 1 ? (
          <footer className="mt-5 flex items-center gap-3">
            <PaginationButton totalPage={dataCustomer.all_page} page={dataCustomer.page} />
          </footer>
        ) : null}
      </div>
    </>
  );
}
