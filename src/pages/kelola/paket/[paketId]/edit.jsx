import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Head from 'next/head';

import Loading from '@/components/Loading';
import Error from '@/components/Error';

import { useEditPackageMutation, useGetSpecificPackageQuery } from '@/stores/package/packageApi';

import MySwal from '@/lib/alert';

export default function Tambah() {
  const router = useRouter();
  const [skip, setSkip] = useState(true);
  const user = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const {
    isSuccess: getIsSuccess,
    data: getData,
    isError: getIsError,
    error: getError,
  } = useGetSpecificPackageQuery(router.query.paketId, { skip });

  const [editPackage, {
    isSuccess: registerIsSuccess,
    isError: registerIsError,
    error: registerError,
  }] = useEditPackageMutation();

  useEffect(() => {
    if (router.query.paketId) {
      setSkip(false);
    }
  }, [router.query.paketId]);

  useEffect(() => {
    if (registerIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Data sudah ditambahkan', 'success');
      reset();
    }

    if (registerIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', registerError.data.message, 'error');
    }
  }, [registerIsSuccess, registerIsError]);

  function editHandler(id, body) {
    MySwal.fire('Loading');
    MySwal.showLoading();
    editPackage({
      id,
      body: {
        ...body,
        harga: Number(body.harga),
        id_outlet: user.id_outlet,
      },
    });
  }

  if (getIsError) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Error message={getError.data?.message} />
      </main>
    );
  }

  if (getIsSuccess) {
    return (
      <>
        <Head>
          <title>Edit Paket</title>
        </Head>
        <main className="w-full h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center">
          <form className="bg-white p-8 rounded-lg shadow-lg w-1/2" onSubmit={handleSubmit((data) => editHandler(getData.id, data))}>
            <h1 className="font-bold text-xl text-center">Edit Paket</h1>

            <div className="w-full flex gap-3 flex-col my-10">
              {/* input nama */}
              <input
                type="text"
                placeholder="Nama Paket"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('nama_paket', {
                  value: getData.nama_paket,
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

              <div className="grid grid-cols-2 gap-3">
                {/* input jenis */}
                <select
                  defaultValue="Jenis"
                  className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                  {...register('jenis', {
                    value: getData.jenis,
                    required: {
                      message: 'Jenis tidak boleh kosong',
                      value: true,
                    },
                  })}
                >
                  <option disabled>Jenis</option>
                  <option value="kiloan">Kiloan</option>
                  <option value="kaos">Kaos</option>
                  <option value="selimut">Selimut</option>
                  <option value="bed_cover">Bed Cover</option>
                </select>

                {/* input harga */}
                <input
                  type="number"
                  placeholder="harga"
                  className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                  {...register('harga', {
                    value: getData.harga,
                    min: {
                      message: 'Harga minimal 10000',
                      value: 10000,
                    },
                    max: {
                      message: 'Harga maksimal 50000',
                      value: 50000,
                    },
                    required: {
                      message: 'Harga tidak boleh kosong',
                      value: true,
                    },
                  })}
                />
              </div>

              {errors ? (
                <small className="text-xs text-red-600">
                  {errors.nama_paket?.message
                  || errors.jenis?.message
                  || errors.harga?.message}
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

  return (
    <main className="w-full h-screen grid place-items-center">
      <Loading />
    </main>
  );
}
