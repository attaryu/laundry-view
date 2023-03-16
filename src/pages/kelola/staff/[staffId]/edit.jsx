import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Head from 'next/head';

import Error from '@/components/Error';
import Loading from '@/components/Loading';

import { useGetNameOutletQuery } from '@/stores/outlet/outletApi';
import { useGetSpecificUserQuery, useUpdateUserMutation } from '@/stores/user/userApi';

import MySwal from '@/lib/alert';

export default function Edit() {
  const router = useRouter();
  const [skip, setSkip] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    isSuccess: outletIsSuccess,
    data: outletData,
    isError: outletIsError,
    error: outletError,
  } = useGetNameOutletQuery(null, { skip });

  const {
    isSuccess: getIsSuccess,
    data: getData,
    isError: getIsError,
    error: getError,
  } = useGetSpecificUserQuery(router.query.staffId, { skip });

  const [update, {
    isSuccess: updateIsSuccess,
    isError: updateIsError,
    error: updateError,
  }] = useUpdateUserMutation();

  if (/admin/ig.test(getData?.role)) {
    router.back();
  }

  useEffect(() => {
    if (router.query.staffId) {
      setSkip(false);
    }
  }, [router.query.staffId]);

  useEffect(() => {
    if (updateIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Data sudah diganti', 'success');
    }

    if (updateIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', updateError.data?.message || '', 'registerError');
    }
  }, [updateIsError, updateIsSuccess]);

  function updateHandler(id, body) {
    MySwal.fire('Loading');
    MySwal.showLoading();
    update({ id, body });
  }

  if (getIsError) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Error message={getError.data?.message} />
      </main>
    );
  }

  if (outletIsError) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Error message={outletError.data?.message} />
      </main>
    );
  }

  if (outletIsSuccess && getIsSuccess) {
    return (
      <>
        <Head>
          <title>Edit Staff</title>
        </Head>
        <main className="w-full h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center">
          <form className="bg-white p-8 rounded-lg shadow-lg w-1/2" onSubmit={handleSubmit((data) => updateHandler(getData.id, data))}>
            <h1 className="font-bold text-xl text-center">Edit Staff</h1>

            <div className="w-full flex gap-3 flex-col my-10">
              {/* input nama */}
              <input
                type="text"
                placeholder="Nama"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('name', {
                  value: getData.name,
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

              {/* input username */}
              <input
                type="text"
                placeholder="Username"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('username', {
                  value: getData.username,
                  minLength: {
                    message: 'Username minimal 5 karakter',
                    value: 5,
                  },
                  maxLength: {
                    message: 'Username maksimal 15 karakter',
                    value: 15,
                  },
                  required: {
                    message: 'Username tidak boleh kosong',
                    value: true,
                  },
                })}
              />

              <div className="grid grid-cols-2 gap-3">
                {/* input role */}
                <select
                  className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                  {...register('role', {
                    value: getData.role,
                    required: {
                      message: 'Role tidak boleh kosong',
                      value: true,
                    },
                  })}
                >
                  <option disabled>Role</option>
                  <option value="kasir">Kasir</option>
                  <option value="manajer">Manajer</option>
                </select>

                {/* input outlet */}
                <select
                  defaultValue="Outlet"
                  className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                  {...register('id_outlet', {
                    value: getData.tb_outlet.id,
                    required: {
                      message: 'Outlet tidak boleh kosong',
                      value: true,
                    },
                  })}
                >
                  <option disabled>Outlet</option>
                  {outletData.length !== 0 ? outletData.map((data) => (
                    <option key={data.id} value={data.id}>{data.nama}</option>
                  )) : null}
                </select>
              </div>

              {errors ? (
                <small className="text-xs text-red-600">
                  {errors.nama?.message
                  || errors.username?.message
                  || errors.role?.message
                  || errors.outlet?.message}
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
