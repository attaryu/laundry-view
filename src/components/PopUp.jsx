import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import { useContext } from 'react';
import PopUpContext from '@/contexts/popUp';

export default function PopUp({ children }) {
  const { popUp, setPopUp } = useContext(PopUpContext);

  return (
    <div className={`fixed w-full h-screen bg-black/40 top-0 left-0 backdrop-blur-[2px] place-items-center ${popUp ? 'grid' : 'hidden'}`}>
      <div className="bg-white p-8 rounded-lg max-h-[500px] max-w-5xl overflow-y-auto shadow-lg overscroll-contain">
        <div className="fixed top-0 right-0 p-5">
          <button type="button" onClick={setPopUp}>
            <CloseIcon sx={{ fontSize: 30, color: 'white' }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

PopUp.propTypes = {
  children: PropTypes.any.isRequired,
};
