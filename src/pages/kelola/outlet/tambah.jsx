import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Head from 'next/head';

import { useCreateOutletMutation } from '@/stores/outlet/outletApi';

import MySwal from '@/lib/alert';

export default function Tambah() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [createOutlet, {
    isLoading,
    isSuccess,
    isError,
    error,
  }] = useCreateOutletMutation();

  useEffect(() => {
    if (isLoading) {
      MySwal.fire('Loading');
      MySwal.showLoading();
    }

    if (isSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Data sudah ditambahkan', 'success');
    }

    if (isError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal menambah data', error.data.message, 'error');
    }
  }, [isLoading, isSuccess, isError]);

  function addOutlet(body) {
    createOutlet(body);
  }

  return (
    <>
      <Head>
        <title>Tambah Outlet</title>
      </Head>
      <main className="w-full h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center">
        <form className="bg-white p-8 rounded-lg shadow-lg w-1/2" onSubmit={handleSubmit((data) => addOutlet(data))}>
          <h1 className="font-bold text-xl text-center">Tambah Outlet</h1>

          <div className="w-full flex gap-3 flex-col my-10">
            {/* input nama */}
            <input
              type="text"
              placeholder="Nama"
              className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
              {...register('nama', {
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
            {errors?.nama ? <small className="text-xs text-red-600">{errors.nama.message}</small> : null}

            <div className="flex gap-3">
              {/* input telepon */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Telepon"
                  className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                  {...register('telepon', {
                    minLength: {
                      message: 'Telepon minimal 10 karakter',
                      value: 10,
                    },
                    maxLength: {
                      message: 'Telepon maksimal 20 karakter',
                      value: 20,
                    },
                    required: {
                      message: 'Telepon tidak boleh kosong',
                      value: true,
                    },
                  })}
                />
                {errors?.telepon ? <small className="text-xs text-red-600">{errors.telepon.message}</small> : null}
              </div>

              {/* input alamat */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Alamat"
                  className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                  {...register('alamat', {
                    minLength: {
                      message: 'Alamat minimal 10 karakter',
                      value: 10,
                    },
                    maxLength: {
                      message: 'Alamat maksimal 20 karakter',
                      value: 20,
                    },
                    required: {
                      message: 'Alamat tidak boleh kosong',
                      value: true,
                    },
                  })}
                />
                {errors?.alamat ? <small className="text-xs text-red-600">{errors.alamat.message}</small> : null}
              </div>
            </div>
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
