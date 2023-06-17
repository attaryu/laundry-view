import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const PopUpContext = createContext();

export function PopUpProvider({ children }) {
  const [popUp, setPopUpOrigin] = useState(false);

  function setPopUp() {
    setPopUpOrigin((prev) => !prev);
  }

  const value = useMemo(() => ({ popUp, setPopUp }), [popUp, setPopUp]);

  return (
    <PopUpContext.Provider value={value}>
      {children}
    </PopUpContext.Provider>
  );
}

PopUpProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PopUpContext;
