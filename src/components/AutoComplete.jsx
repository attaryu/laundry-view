import PropTypes from 'prop-types';
import { useState } from 'react';

export default function AutoComplete({ data, control, setValue, register }) {
  const [focus, setFocus] = useState(false);

  const watch = control()?.nama ?? '';
  const mathcing = data.filter((name) => {
    if (watch.length !== 0) {
      if (new RegExp(watch, 'ig').test(name)) {
        return name;
      }
      return false;
    }
    return false;
  });

  function setValueHandler(name) {
    setValue('nama', name);
    setFocus(false);
  }

  return (
    <div className="w-full bg-zinc-200 rounded-md relative">
      <input
        type="text"
        placeholder="Nama"
        className="w-full bg-transparent h-full p-3 rounded-md"
        autoComplete="off"
        onFocus={() => setFocus(true)}
        onDoubleClick={() => setFocus(false)}
        {...register}
      />
      {watch.length !== 0 && focus ? (
        <ul className="absolute left-0 top-14 rounded-sm shadow-md outline outline-1 outline-zinc-400">
          {mathcing.map((name, i) => {
            if (i < 5) {
              return (
                <li
                  className="bg-white px-2.5 py-1.5 cursor-pointer hover:bg-zinc-200 whitespace-nowrap"
                  key={name}
                  onClickCapture={() => setValueHandler(name)}
                >
                  {name}
                </li>
              );
            }
            return null;
          })}
        </ul>
      ) : null}
    </div>
  );
}

AutoComplete.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  control: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  register: PropTypes.any.isRequired,
};
