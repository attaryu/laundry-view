import PropTypes from 'prop-types';

import Moment from 'react-moment';

export default function TransactionItem({ total, codeInvoice, date }) {
  return (
    <div className="p-6 bg-gradient-to-tr from-amber-200 to-amber-100 rounded-xl flex justify-between items-center shadow-lg">
      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg">{total.toLocaleString('id-ID', { currency: 'IDR', style: 'currency' })}</p>
        <small className="font-medium text-xs opacity-70">{codeInvoice}</small>
      </div>
      <div className="flex flex-col items-end">
        <Moment format="DD MMMM YYYY" locale="id" className="font-medium text-sm opacity-50">{date}</Moment>
        <Moment format="hh:mm:ss" locale="id" className="font-medium text-sm opacity-50">{date}</Moment>
      </div>
    </div>
  );
}

TransactionItem.propTypes = {
  total: PropTypes.number.isRequired,
  codeInvoice: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
