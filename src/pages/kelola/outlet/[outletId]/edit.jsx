import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Head from 'next/head';

import { useEditOutletMutation, useGetDetailOutletQuery } from '@/stores/outlet/outletApi';

import MySwal from '@/lib/alert';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

export default function Tambah() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    isLoading: getIsLoading,
    data: getData,
    isError: getIsError,
    error: getError,
  } = useGetDetailOutletQuery(router.query.outletId);

  const [editOutlet, {
    isLoading: editIsLoading,
    isSuccess: editIsSuccess,
    isError: editIsError,
    error: editError,
  }] = useEditOutletMutation();

  useEffect(() => {
    if (editIsLoading) {
      MySwal.fire('Loading');
      MySwal.showLoading();
    }

    if (editIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Data berhasil diubah', 'success');
    }

    if (editIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', editError.data.message, 'error');
    }
  }, [editIsLoading, editIsSuccess, editIsError]);

  function editOutletHandler(body, id) {
    editOutlet({
      id,
      body: {
        nama: body.nama,
        telepon: body.telepon,
        alamat: `${body.jalan}, ${body.desa}, ${body.kecamatan}, ${body.kota}`,
      },
    });
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

  const address = getData.alamat.split(', ');

  return (
    <>
      <Head>
        <title>Tambah Outlet</title>
      </Head>
      <main className="w-full h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center">
        <form className="bg-white p-8 rounded-lg shadow-lg w-1/2" onSubmit={handleSubmit((data) => editOutletHandler(data, getData.id))}>
          <h1 className="font-bold text-xl text-center">Edit Outlet</h1>

          <div className="w-full flex gap-3 flex-col my-10">
            {/* input nama */}
            <input
              type="text"
              placeholder="Nama"
              className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
              {...register('nama', {
                value: getData.nama,
                minLength: {
                  message: 'Nama minimal 5 karakter',
                  value: 5,
                },
                maxLength: {
                  message: 'Nama maksimal 20 karakter',
                  value: 20,
                },
                required: {
                  message: 'Nama tidak boleh kosong',
                  value: true,
                },
              })}
            />

            {/* input telepon */}
            <input
              type="text"
              placeholder="Telepon"
              className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
              {...register('telepon', {
                value: getData.telepon,
                minLength: {
                  message: 'Telepon minimal 10 karakter',
                  value: 10,
                },
                maxLength: {
                  message: 'Telepon maksimal 15 karakter',
                  value: 15,
                },
                required: {
                  message: 'Telepon tidak boleh kosong',
                  value: true,
                },
              })}
            />

            {/* input alamat */}
            <div className="grid grid-cols-2 gap-3">
              {/* input jalan */}
              <input
                type="text"
                placeholder="Jalan"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('jalan', {
                  value: address[0],
                  minLength: {
                    message: 'Jalan minimal 3 karakter',
                    value: 3,
                  },
                  maxLength: {
                    message: 'Jalan maksimal 20 karakter',
                    value: 20,
                  },
                  required: {
                    message: 'Jalan tidak boleh kosong',
                    value: true,
                  },
                })}
              />

              {/* input desa */}
              <input
                type="text"
                placeholder="Desa"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('desa', {
                  value: address[1],
                  minLength: {
                    message: 'Desa minimal 3 karakter',
                    value: 3,
                  },
                  maxLength: {
                    message: 'Desa maksimal 20 karakter',
                    value: 20,
                  },
                  required: {
                    message: 'Desa tidak boleh kosong',
                    value: true,
                  },
                })}
              />

              {/* input kecamatan */}
              <input
                type="text"
                placeholder="Kecamatan"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('kecamatan', {
                  value: address[2],
                  minLength: {
                    message: 'Kecamatan minimal 3 karakter',
                    value: 3,
                  },
                  maxLength: {
                    message: 'Kecamatan maksimal 20 karakter',
                    value: 20,
                  },
                  required: {
                    message: 'Kecamatan tidak boleh kosong',
                    value: true,
                  },
                })}
              />

              {/* input kota */}
              <input
                type="text"
                placeholder="Kota"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('kota', {
                  value: address[3],
                  minLength: {
                    message: 'Kota minimal 3 karakter',
                    value: 3,
                  },
                  maxLength: {
                    message: 'Kota maksimal 20 karakter',
                    value: 20,
                  },
                  required: {
                    message: 'Kota tidak boleh kosong',
                    value: true,
                  },
                })}
              />
            </div>

            {errors ? (
              <small className="text-xs text-red-600">
                {errors.nama?.message
                || errors.telepon?.message
                || errors.jalan?.message
                || errors.desa?.message
                || errors.kecamatan?.message
                || errors.kota?.message}
              </small>
            ) : null}
          </div>

          {/* back and submit button */}
          <div className="flex gap-4">
            <button
              type="button"
              role="link"
              className="w-full bg-zinc-300 hover:bg-zinc-200 py-2.5 rounded-lg font-semibold text-sm"
              onClick={() => router.back()}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 py-2.5 rounded-lg font-semibold text-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
