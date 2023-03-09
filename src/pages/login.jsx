import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { BiHide as Hide, BiShowAlt as Show } from 'react-icons/bi';

import Spinner from '@/components/Spinner';

import { useLoginMutation } from '@/stores/auth/authApi';
import { pushUserData } from '@/stores/auth/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const [login, { data, isSuccess, isLoading, isError, error }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      router.push('/');
      dispatch(pushUserData({ ...data }));
    }
  });

  function loginHandler(e) {
    e.preventDefault();
    login({ username, password });
  }

  function passwordEvent() {
    if (passwordFocus) {
      setPasswordFocus(false);
    } else {
      setPasswordFocus(true);
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 px-20">
      <div className="flex w-full items-center">
        <h1 className="text-6xl font-extrabold text-white">
          Laundry
          <br />
          Staff
        </h1>
      </div>
      <main className="grid w-3/5 place-items-center">
        <div className="flex w-full flex-col items-center rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-10 text-2xl font-bold">Login</h1>

          <form action="POST" className="flex w-full flex-col items-center gap-5" onSubmit={loginHandler}>
            <input
              type="text"
              className="w-full rounded-md bg-zinc-200 px-3 py-2.5 text-sm focus:outline-1 focus:outline"
              placeholder="Username..."
              maxLength={30}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password" className={`w-full gap-2 rounded-md px-3 py-2.5 text-sm flex items-center bg-zinc-200 cursor-text${passwordFocus ? ' outline-1 outline' : ''}`}>
              <input
                type={show ? 'text' : 'password'}
                id="password"
                className="bg-zinc-200 focus:outline-none w-full"
                placeholder="Password..."
                maxLength={20}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={passwordEvent}
                onBlur={passwordEvent}
                required
              />
              <button type="button" onClick={() => setShow(!show)}>
                {show ? (
                  <Show className="scale-110 opacity-50 hover:opacity-100 duration-300" />
                ) : (
                  <Hide className="scale-110 opacity-50 hover:opacity-100 duration-300" />
                )}
              </button>
            </label>
            {isError ? <p className="text-xs font-medium text-red-500">{error.data.message}</p> : ''}

            <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-5 rounded-md bg-slate-700 py-2.5 font-semibold text-white duration-300 hover:bg-slate-800"
            >
              {isLoading ? (
                <>
                  <Spinner color={{ bgSpin: 'fill-slate-600', spin: 'fill-slate-100' }} />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
