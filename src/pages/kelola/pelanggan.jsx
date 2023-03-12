import { useRouter } from 'next/router';
import { useState } from 'react';

import Head from 'next/head';

import ActionButton from '@/components/ActionButton';
import DropDown from '@/components/DropDown';
import Loading from '@/components/Loading';
import PaginationButton from '@/components/PaginationButton';
import SearchBar from '@/components/SearchBar';

import { useGetCustomerQuery } from '@/stores/customer/customerApi';

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

  const { isLoading, data, isError, error } = useGetCustomerQuery({
    page: router.query.page,
    gender: router.query.gender,
    search: router.query.search,
  });

  function goEdit(id) {
    return () => router.push(`/kelola/pelanggan/${id}/edit`);
  }

  if (isLoading) {
    return (
      <main className="grid h-screen w-full place-items-center">
        <Loading />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="grid h-screen w-full place-items-center">
        <div className="grid h-screen w-full place-items-center gap-5 bg-zinc-100 px-7 py-5">
          <p className="font-semibold opacity-40">{error?.data?.message}</p>
        </div>
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
          <h1 className="text-xl font-bold">Daftar Pelanggan</h1>
        </header>

        <main className="mt-10">
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

          {data ? (
            <>
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
                  {data.payload.map((customer) => (
                    <tr key={Math.random()}>
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
                        <ActionButton type="edit" handler={goEdit(customer.id)} />
                        <ActionButton type="delete" handler={goEdit(customer.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <small className="font-medium text-zinc-500">
                Total
                {' '}
                {data.total}
                {' '}
                data
              </small>
            </>
          ) : (
            <div className="grid h-[510px] w-full place-items-center">
              <Loading />
            </div>
          )}
        </main>

        {data && data.all_page > 1 ? (
          <footer className="mt-5 flex items-center gap-3">
            <PaginationButton totalPage={data.all_page} page={data.page} />
          </footer>
        ) : null}
      </div>
    </>
  );
}
