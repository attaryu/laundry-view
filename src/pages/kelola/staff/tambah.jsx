import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import Head from 'next/head';

import Loading from '@/components/Loading';

import { useRegisterMutation } from '@/stores/auth/authApi';
import { useGetNameOutletQuery } from '@/stores/outlet/outletApi';

import MySwal from '@/lib/alert';

export default function Tambah() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const {
    isSuccess: outletIsSuccess,
    isLoading: outletIsLoading,
    data: outletData,
  } = useGetNameOutletQuery();

  const [registerStaff, {
    isSuccess: registerIsSuccess,
    isError: registerIsError,
    error: registerError,
  }] = useRegisterMutation();

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

  function registerHandler(body) {
    if (body.password !== body.repeatPassword) {
      MySwal.fire('Peringatan', 'Password harus sama', 'warning');
      return;
    }

    if (body.role === 'Role') {
      MySwal.fire('Peringatan', 'Pilih role yang tersedia', 'warning');
      return;
    }

    if (body.id_outlet === 'Outlet') {
      MySwal.fire('Peringatan', 'Pilih outlet yang tersedia', 'warning');
      return;
    }

    MySwal.fire('Loading');
    MySwal.showLoading();
    registerStaff(body);
  }

  if (outletIsLoading) {
    return (
      <main className="w-full h-screen grid place-items-center">
        <Loading />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Tambah Staff</title>
      </Head>
      <main className="w-full h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center">
        <form className="bg-white p-8 rounded-lg shadow-lg w-1/2" onSubmit={handleSubmit((data) => registerHandler(data))}>
          <h1 className="font-bold text-xl text-center">Tambah Staff</h1>

          <div className="w-full flex gap-3 flex-col my-10">
            {/* input nama */}
            <input
              type="text"
              placeholder="Nama"
              className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
              {...register('name', {
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
              {/* input password */}
              <input
                type="text"
                placeholder="Password"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('password', {
                  minLength: {
                    message: 'Password minimal 8 karakter',
                    value: 8,
                  },
                  maxLength: {
                    message: 'Password maksimal 20 karakter',
                    value: 20,
                  },
                  required: {
                    message: 'Password tidak boleh kosong',
                    value: true,
                  },
                })}
              />

              {/* input repeat password */}
              <input
                type="text"
                placeholder="Ulangi password"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('repeatPassword', {
                  required: {
                    message: 'Repeat password tidak boleh kosong',
                    value: true,
                  },
                })}
              />

              {/* input role */}
              <select
                defaultValue="Role"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('role', {
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
                  required: {
                    message: 'Outlet tidak boleh kosong',
                    value: true,
                  },
                })}
              >
                <option disabled>Outlet</option>
                {outletIsSuccess ? outletData.map((data) => (
                  <option key={data.id} value={data.id}>{data.nama}</option>
                )) : null}
              </select>
            </div>

            {errors ? (
              <small className="text-xs text-red-600">
                {errors.nama?.message
                || errors.username?.message
                || errors.password?.message
                || errors.repeatPassword?.message
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
