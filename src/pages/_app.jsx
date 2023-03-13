import { Outfit } from 'next/font/google';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Sidebar from '@/components/Sidebar';

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
      <div className={`${outfit.className}${isLoginPage ? '' : ' flex'}`}>
        {isLoginPage ? null : <Sidebar />}
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.any.isRequired,
};
