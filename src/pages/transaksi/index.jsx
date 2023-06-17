import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Head from 'next/head';
import Link from 'next/link';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import Moment from 'react-moment';

import Error from '@/components/Error';
import FilterGroup from '@/components/FilterGroup';
import Loading from '@/components/Loading';
import PopUp from '@/components/PopUp';

import { registerFilter } from '@/stores/filter/filter';
import { useGetNameOutletQuery } from '@/stores/outlet/outletApi';
import { useCancelTransactionMutation, useGetTransactionQuery } from '@/stores/transaction/transactionApi';

import ActionButton from '@/components/ActionButton';
import PaginationButton from '@/components/PaginationButton';

import PopUpContext from '@/contexts/popUp';

import MySwal from '@/lib/alert';
import firstToUpperCase from '@/lib/firstToUpperCase';

export default function Transaction() {
  const { setPopUp } = useContext(PopUpContext);
  const [filter, setFilter] = useState(null);
  const user = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const privileges = /kasir/ig.test(user.role);

  const {
    isSuccess: outletIsSuccess,
    data: outletData,
  } = useGetNameOutletQuery();

  const {
    isError: getIsError,
    isLoading: getIsLoading,
    isSuccess: getIsSuccess,
    data: getData,
  } = useGetTransactionQuery({
    page: router.query.page,
    filter,
  });

  const [deleteUser, {
    isError: deleteIsError,
    isSuccess: deleteIsSuccess,
    error: deleteError,
  }] = useCancelTransactionMutation();

  useEffect(() => {
    if (deleteIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Berhasil menghapus transaksi', 'success');
    }

    if (deleteIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', deleteError?.data?.message, 'error');
    }
  }, [deleteIsError, deleteIsSuccess]);

  useEffect(() => {
    if (getIsSuccess && outletIsSuccess) {
      dispatch(registerFilter([
        {
          title: 'Outlet',
          value: 'id_outlet',
          type: 'option',
          inUse: false,
          option: outletData.map((data) => ({ name: data.nama, value: data.id })),
        },
        {
          title: 'Status',
          value: 'status',
          type: 'option',
          inUse: false,
          option: [
            {
              name: 'Antrian',
              value: 'antrian',
            },
            {
              name: 'Proses',
              value: 'proses',
            },
            {
              name: 'Selesai',
              value: 'selesai',
            },
            {
              name: 'Diambil',
              value: 'diambil',
            },
          ],
        },
        {
          title: 'Lunas',
          value: 'lunas',
          type: 'option',
          inUse: false,
          option: [
            {
              name: 'Lunas',
              value: true,
            },
            {
              name: 'Belum Lunas',
              value: false,
            },
          ],
        },
        {
          title: 'Tanggal',
          value: 'tanggal',
          type: 'date',
          inUse: false,
        },
        {
          title: 'Total',
          value: 'total',
          type: 'number',
          inUse: false,
        },
      ]));
    }
  }, [getIsSuccess, outletIsSuccess]);

  function goDelete(id) {
    return () => {
      MySwal.fire({
        title: `Membatalkan transaksi ${id}?`,
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Tidak',
        cancelButtonColor: '#4ade80',
        showConfirmButton: true,
        confirmButtonText: 'Oke',
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
        <Error message={getData?.data?.message} />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Daftar Transaksi</title>
      </Head>
      <div className="w-full p-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Daftar Transaksi</h1>
          {privileges ? (
            <Link
              href="/transaksi/buat"
              className="py-1.5 px-2.5 w-fit bg-emerald-400 hover:bg-emerald-500 font-semibold text-white rounded-md text-sm"
            >
              Tambah Transaksi
            </Link>
          ) : null}
        </header>

        <main className="mt-5">

          {/* filter */}
          <div className="mt-2 flex w-full items-center justify-end gap-3">
            <button type="button" className="bg-yellow-400 py-2 px-3 rounded-md flex gap-2 items-center font-medium text-sm hover:bg-yellow-400/80" onClick={setPopUp}>
              Filter Box
              <SortOutlinedIcon sx={{ fontSize: 19 }} />
            </button>
          </div>

          {/* tabel */}
          <table className="mt-5 mb-3 w-full table-auto rounded-lg outline outline-[1.5px] outline-zinc-200">
            <thead className="border-b-[1.5px] bg-zinc-100 outline-zinc-200">
              <tr>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Kode Invoice</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Pelanggan</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Outlet</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Total</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Status</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">Tanggal</th>
                <th className="p-2 px-2 text-start text-xs font-medium text-zinc-400">{' '}</th>
              </tr>
            </thead>
            <tbody>
              {getData.payload.map((transaksi) => (
                <tr key={transaksi.id}>
                  <td className="p-2 px-2 text-sm font-semibold">
                    <Link href={`/transaksi/${transaksi.kode_invoice}`} className="hover:underline">
                      {transaksi.kode_invoice}
                    </Link>
                  </td>
                  <td className="p-2 px-2 text-sm">{firstToUpperCase(transaksi.tb_pelanggan.nama)}</td>
                  <td className="p-2 px-2 text-sm">{firstToUpperCase(transaksi.tb_outlet.nama)}</td>
                  <td className="p-2 px-2 text-sm">{(transaksi.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                  <td className="p-2 px-2 text-sm">{firstToUpperCase(transaksi.status)}</td>
                  <td className="p-2 px-2 text-sm">
                    <Moment format="DD MMMM YYYY" locale="id">
                      {transaksi.tanggal}
                    </Moment>
                  </td>
                  <td className="flex gap-2 p-2 px-2 text-sm">
                    {transaksi.lunas ? (
                      <CheckCircleIcon className="text-emerald-500" />
                    ) : (
                      <ActionButton type="delete" handler={goDelete(transaksi.kode_invoice)} />
                    )}
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
            transaksi
          </small>
        </main>

        {/* pagination button */}
        {getData && getData.all_page > 1 ? (
          <footer className="mt-5 flex items-center gap-3">
            <PaginationButton totalPage={getData.all_page} page={getData.page} url="/transaksi" />
          </footer>
        ) : null}
      </div>

      <PopUp>
        <h1 className="font-bold text-2xl">Filter</h1>
        <FilterGroup refetch={setFilter} />
      </PopUp>
    </>
  );
}
