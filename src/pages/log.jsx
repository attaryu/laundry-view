import Head from 'next/head';
import Link from 'next/link';
import Moment from 'react-moment';

import Error from '@/components/Error';
import Loading from '@/components/Loading';

import { useGetLogQuery } from '@/stores/log/logApi';

export default function Log() {
  const { isSuccess, isError, data, error } = useGetLogQuery(null, {
    pollingInterval: 60000,
  });

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
        <Head>
          <title>Logging User</title>
        </Head>
        <div className="w-full p-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Logging User</h1>
          </header>

          <main className="mt-10">
            {/* tabel */}
            <table className="mt-5 mb-3 w-4/5 table-auto rounded-lg outline outline-[1.5px] outline-zinc-200">
              <thead className="border-b-[1.5px] bg-zinc-100 outline-zinc-200">
                <tr>
                  <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Aksi</th>
                  <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user.id}>
                    <td className="p-2 px-2 text-sm">
                      <Link href={`/kelola/staff/${user.id_user}`} className="text-blue-500">
                        User
                        {' '}
                        {user.id_user}
                      </Link>
                      {' '}
                      Membuat transaksi pada
                      {' '}
                      <Link href={`/kelola/outlet/${user.id_outlet}`} className="text-blue-500">
                        Outlet
                        {' '}
                        {user.id_outlet}
                      </Link>
                    </td>
                    <td className="p-2 px-2 text-sm">
                      <Moment format="DD MMMM YYYY - hh:mm:ss" locale="id">
                        {user.dateNow}
                      </Moment>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
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
