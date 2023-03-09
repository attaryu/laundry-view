import { Outfit } from 'next/font/google';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import store from '@/stores/store';

import '../styles/global.css';

const outfit = Outfit({
  style: ['normal'],
  subsets: ['latin'],
});

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className={outfit.className}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.any.isRequired,
};
