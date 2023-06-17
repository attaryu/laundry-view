import { Outfit } from 'next/font/google';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Sidebar from '@/components/Sidebar';
import { PopUpProvider } from '@/contexts/popUp';

import store from '@/stores/store';

import 'moment/locale/id';
import '../styles/global.css';

const outfit = Outfit({
  style: ['normal'],
  subsets: ['latin'],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  return (
    <Provider store={store}>
      <PopUpProvider>
        <div className={`${outfit.className}${isLoginPage ? '' : ' flex'}`}>
          {isLoginPage ? null : <Sidebar />}
          <div className="w-full">
            <Component {...pageProps} />
          </div>
        </div>
      </PopUpProvider>
    </Provider>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.any.isRequired,
};
