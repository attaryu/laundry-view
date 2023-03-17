import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Head from 'next/head';

import AutoComplete from '@/components/AutoComplete';
import Loading from '@/components/Loading';

import { useGetNameCustomerQuery } from '@/stores/customer/customerApi';
import { useGetNamePackageQuery } from '@/stores/package/packageApi';
import { useCreateTransactionMutation } from '@/stores/transaction/transactionApi';

import MySwal from '@/lib/alert';

export default function Tambah() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {
      errors,
    },
  } = useForm();

  const {
    isSuccess: packageIsSuccess,
    data: packageData,
  } = useGetNamePackageQuery();

  const {
    isSuccess: customerIsSuccess,
    data: customerData,
  } = useGetNameCustomerQuery();

  const [createTransaction, {
    isSuccess: transactionIsSuccess,
    isError: transactionIsError,
    error: transactionError,
  }] = useCreateTransactionMutation();

  useEffect(() => {
    if (transactionIsSuccess) {
      MySwal.hideLoading();
      MySwal.fire('Berhasil', 'Transaksi sudah ditambahkan', 'success');
      reset();
    }

    if (transactionIsError) {
      MySwal.hideLoading();
      MySwal.fire('Gagal', transactionError.data.message, 'error');
    }
  }, [transactionIsSuccess, transactionIsError]);

  function transactionHandler(body) {
    if (body.id_paket === 'Paket') {
      MySwal.fire('Peringatan', 'Pilih paket yang tersedia', 'warning');
      return;
    }

    if (body.jenis_kelamin === 'Jenis Kelamin') {
      MySwal.fire('Peringatan', 'Pilih jenis kelamin yang tersedia', 'warning');
      return;
    }

    MySwal.fire('Loading');
    MySwal.showLoading();

    const { id_paket: idPaket, ...pelanggan } = body;
    createTransaction({
      id_paket: idPaket,
      pelanggan: { ...pelanggan },
    });
  }

  if (packageIsSuccess && customerIsSuccess) {
    const names = customerData.map((data) => data.nama);
    const control = names.filter((name) => name === watch().nama).length > 0;

    return (
      <>
        <Head>
          <title>Tambah Transaksi</title>
        </Head>
        <main className="w-full h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center">
          <form className="bg-white p-8 rounded-lg shadow-lg w-1/2" onSubmit={handleSubmit((data) => transactionHandler(data))}>
            <h1 className="font-bold text-xl text-center">Tambah Transaksi</h1>

            <div className="w-full flex gap-3 flex-col my-10">
              {/* input outlet */}
              <select
                defaultValue="Paket"
                className="p-3 w-full bg-zinc-200 focus:outline-1 focus:outline rounded-md text-sm font-medium"
                {...register('id_paket')}
              >
                <option disabled>Paket</option>
                {packageIsSuccess ? packageData.map((data) => (
                  <option key={data.id} value={data.id}>{data.nama_paket}</option>
                )) : null}
              </select>

              <div className="grid grid-cols-2 gap-3">
                {/* nama */}
                <AutoComplete
                  data={names}
                  control={watch}
                  setValue={setValue}
                  register={register('nama', {
                    required: {
                      message: 'Nama harus di isi',
                      value: true,
                    },
                    maxLength: {
                      message: 'Nama maksimal 40 karakter',
                      value: 40,
                    },
                    minLength: {
                      message: 'Nama minimal 5 karakter',
                      value: 5,
                    },
                  })}
                />

                {/* alamat */}
                <input
                  type="text"
                  placeholder="Alamat..."
                  className={`p-3 w-full ${control ? 'bg-zinc-100 placeholder:text-zinc-200' : 'bg-zinc-200'} focus:outline-1 focus:outline rounded-md text-sm font-medium`}
                  {...register('alamat', {
                    disabled: control,
                    required: {
                      message: 'Alamat harus di isi',
                      value: control,
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

                <input
                  type="text"
                  placeholder="No.Telepon..."
                  className={`p-3 w-full ${control ? 'bg-zinc-100 placeholder:text-zinc-200' : 'bg-zinc-200'} focus:outline-1 focus:outline rounded-md text-sm font-medium`}
                  {...register(('telepon'), {
                    disabled: control,
                    required: {
                      message: 'Telepon harus di isi',
                      value: control,
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

                {/* select gender */}
                <select
                  defaultValue="Jenis Kelamin"
                  className={`p-3 w-full ${control ? 'bg-zinc-100 placeholder:text-zinc-200' : 'bg-zinc-200'} focus:outline-1 focus:outline rounded-md text-sm font-medium`}
                  {...register('jenis_kelamin')}
                >
                  <option disabled>Jenis Kelamin</option>
                  <option value="laki_laki">Laki Laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>

              {errors ? (
                <small className="text-xs text-red-600">
                  {errors.nama?.message
                  || errors.alamat?.message
                  || errors.telepon?.message
                  || errors.jenis_kelamin?.message
                  || errors.id_paket?.message}
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
