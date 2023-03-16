import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BadgeIcon from '@mui/icons-material/Badge';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import StoreIcon from '@mui/icons-material/Store';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';

import LinkItem from '@/components/LinkItem';
import Spinner from '@/components/Spinner';

import { pushUserData } from '@/stores/auth/auth';
import { useGenerateRequestTokenQuery, useLogoutMutation } from '@/stores/auth/authApi';

export default function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((states) => states.auth);

  const [open, setOpen] = useState(true);

  const { isSuccess, data, isError } = useGenerateRequestTokenQuery();
  const [logout, {
    isSuccess: isSuccessLogout, isLoading }] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(pushUserData({ ...data.payload }));
      sessionStorage.setItem('request_token', data.payload.request_token);
    }

    if (isSuccessLogout) {
      router.push('/login');
    }

    if (isError) {
      logout();
      router.push('/login');
    }
  }, [isSuccess, isSuccessLogout, isError]);

  return (
    <div
      className={`${
        open ? 'w-[18%]' : 'w-[6%]'
      } flex h-screen flex-col items-center p-3 outline outline-1 outline-zinc-300 duration-300`}
    >

      {/* User profile */}
      <div className={`${!open ? 'justify-center' : null} mb-1 flex w-full items-center gap-3 overflow-hidden`}>
        <img
          src={`https://ui-avatars.com/api/?name=${
            user.name || 'unknown'
          }&background=random&color=random&bold=true&format=svg&rounded=true`}
          width={50}
          height={50}
          alt={`${user.name} profile's`}
        />
        {open ? (
          <div>
            <p className="whitespace-nowrap text-xs opacity-70 delay-100 duration-300">
              Halo,
              {' '}
              {user.role || 'Unknown'}
            </p>
            <p className="truncate whitespace-nowrap text-sm font-semibold delay-75 duration-300 w-[99%]">
              {user.name || 'Unknown'}
            </p>
          </div>
        ) : null}
      </div>

      {/* Open/close sidebar button */}
      <button
        type="button"
        className="mt-3 mb-5 grid w-full place-items-center rounded-[6px] bg-zinc-200 py-1.5 duration-300"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <span className="text-xs font-medium">Collapse</span>
        ) : (
          <KeyboardArrowRightIcon color="inherit" fontSize="medium" />
        )}
      </button>

      <Line />

      {/* Link list item */}
      <nav className="my-5 flex w-full flex-col gap-1.5">
        <LinkItem
          IconDefault={HomeOutlinedIcon}
          IconHover={HomeIcon}
          title="Beranda"
          to="/"
          open={open}
        />
        <LinkItem
          IconDefault={PersonOutlineOutlinedIcon}
          IconHover={PersonIcon}
          title="Pelanggan"
          to="/kelola/pelanggan?page=1"
          open={open}
        />
        <LinkItem
          IconDefault={StoreOutlinedIcon}
          IconHover={StoreIcon}
          title="Outlet"
          to="/kelola/outlet?page=1"
          open={open}
        />
        <LinkItem
          IconDefault={BadgeOutlinedIcon}
          IconHover={BadgeIcon}
          title="Staff"
          to="/kelola/staff?page=1"
          open={open}
        />
        <LinkItem
          IconDefault={LocalOfferOutlinedIcon}
          IconHover={LocalOfferIcon}
          title="Paket"
          to="/kelola/paket?page=1"
          open={open}
        />
        <LinkItem
          IconDefault={ReceiptLongOutlinedIcon}
          IconHover={ReceiptLongIcon}
          title="Transaksi"
          to="/transaksi?page=1"
          open={open}
        />

        {/admin/ig.test(user.role) ? (
          <>
            <LinkItem
              IconDefault={DescriptionOutlinedIcon}
              IconHover={DescriptionIcon}
              title="Laporan"
              to="/laporan"
              open={open}
            />
            <LinkItem
              IconDefault={HistoryIcon}
              IconHover={HistoryIcon}
              title="Logging"
              to="/log"
              open={open}
            />
          </>
        ) : null}
      </nav>

      <Line />

      {/* Logout button */}
      <div className="mt-auto w-full">
        <button
          type="button"
          onClick={() => logout()}
          className={`flex w-full items-center gap-2 rounded-[7px] bg-slate-500 p-1.5 text-white duration-200 ${
            !open ? 'justify-center' : null
          }`}
        >
          {isLoading ? (
            <>
              <Spinner color={{ bgSpin: 'fill-slate-300', spin: 'fill-slate-100' }} />
              {open ? <span className="text-xs font-medium">Loading</span> : null}
            </>
          ) : (
            <>
              <ExitToAppIcon color="inherit" sx={{ fontSize: 22 }} />
              {open ? <span className="text-xs font-medium">Logout</span> : null}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Line() {
  return <div className="w-full rounded-full outline outline-[0.05px] outline-zinc-200/50" />;
}
