import Head from 'next/head';
import PropTypes from 'prop-types';

export default function Error({ message }) {
  return (
    <>
      <Head>
        <title>Error</title>
      </Head>
      <p className="font-semibold opacity-40">{message || 'Oh no, error!'}</p>
    </>
  );
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
};
