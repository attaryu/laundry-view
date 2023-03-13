import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { useEffect } from 'react';
import Error from '@/components/Error';
import Loading from '@/components/Loading';

import { useGetSpecificCustomerQuery, useEditCustomerMutation } from '@/stores/customer/customerApi';

import MySwal from '@/lib/alert';

export default function Edit() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetSpecificCustomerQuery(router.query.customerId);
  const [editUser, {
    isError: editIsError,
    error: editError,
    isLoading: editIsLoading,
    isSuccess: editIsSuccess,
  }] = useEditCustomerMutation();

  useEffect(() => {
    if (editIsLoading) {
      MySwal.fire('Loading');
      MySwal.showLoading();
    }

    if (editIsError) {
      MySwal.hideLoading();
      MySwal.fire({
        title: 'Gagal',
        text: editError.data.message,
        icon: 'error',
        confirmButtonText: 'Oke',
      });
    }

    if (editIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire({
        title: 'Berhasil',
        text: 'ingin kembali ke halaman daftar?',
        icon: 'success',
        showCancelButton: true,
        cancelButtonText: 'Tetap disini',
        confirmButtonText: 'Kembali',
        showConfirmButton: true,
      }).then((ress) => {
        if (ress.isConfirmed) {
          router.push({
            pathname: '/kelola/pelanggan',
            query: { page: 1 },
          });
        }
      });
    }
  }, [editIsLoading, editIsError, editIsSuccess]);

  function submit(body) {
    editUser({ body, id: router.query.customerId });
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
        <Error message={error?.data?.message} />
      </main>
    );
  }

  return (
    <main className="w-full h-screen py-8 bg-gradient-to-bl from-emerald-200 to-emerald-500 grid place-items-center">
      <form
        onSubmit={handleSubmit((body) => submit(body))}
        className="w-1/2 bg-white p-8 rounded-lg shadow-xl"
      >
        <h1 className="text-xl text-center font-bold">Edit Pelanggan</h1>

        <div className="w-full flex flex-col gap-3 my-10">
          {/* nama */}
          <input
            type="text"
            placeholder="Nama..."
            className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
            {...register('nama', {
              value: data?.nama || '',
              required: {
                message: 'Nama harus di isi',
                value: true,
              },
              maxLength: {
                message: 'Nama maksimal 32 karakter',
                value: 32,
              },
              minLength: {
                message: 'Nama minimal 5 karakter',
                value: 5,
              },
            })}
          />
          {errors?.nama ? <small className="text-xs text-red-600">{errors.nama.message}</small> : null}

          {/* alamat */}
          <input
            type="text"
            placeholder="Alamat..."
            className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
            {...register('alamat', {
              value: data?.alamat || '',
              required: {
                message: 'Alamat harus di isi',
                value: true,
              },
              maxLength: {
                message: 'Alamat maksimal 100 karakter',
                value: 100,
              },
              minLength: {
                message: 'Alamat minimal 3 karakter',
                value: 3,
              },
            })}
          />
          {errors?.alamat ? <small className="text-xs text-red-600">{errors.alamat.message}</small> : null}

          {/* telepon */}
          <input
            type="text"
            placeholder="No.Telepon..."
            className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
            {...register(('telepon'), {
              value: data?.telepon || 0,
              required: {
                message: 'Telepon harus di isi',
                value: true,
              },
              pattern: /[^a-z]/ig,
              maxLength: {
                message: 'Telepon maksimal 15 karakter',
                value: 15,
              },
              minLength: {
                message: 'Telepon minimal 11 karakter',
                value: 11,
              },
            })}
          />
          {errors?.telepon ? <small className="text-xs text-red-600">{errors.telepon.message}</small> : null}

          {/* select gender */}
          <select
            className="rounded-md p-3 text-sm font-medium border-[1.5px] border-zinc-700"
            {...register('jenis_kelamin', {
              value: data?.jenis_kelamin || '',
            })}
          >
            <option value="laki_laki">Laki Laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </div>

        {/* back and submit button */}
        <div className="flex gap-4">
          <button
            type="button"
            role="link"
            className="w-full bg-zinc-300 hover:bg-zinc-200 py-2.5 rounded-lg font-semibold"
            onClick={() => router.back()}
          >
            Kembali
          </button>
          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-300 py-2.5 rounded-lg font-semibold"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
