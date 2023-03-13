import PropTypes from 'prop-types';

import Image from 'next/image';

export default function Card({ imgUrl, title, text, additionalText, isCustomImage }) {
  return (
    <div className="bg-zinc-100 border-2 border-zinc-200 shadow-xl flex flex-col pt-5 pb-8 items-center rounded-lg gap-5">
      <div className="my-2">
        {isCustomImage ? (
          <Image src={imgUrl} alt={`${title} images`} width={120} height={120} className="rounded-full" priority />
        ) : (
          <img src={imgUrl} alt={`${title} images`} className="w-[120px] h-[120px] rounded-full" />
        )}
      </div>
      <div>
        <h1 className="text-center font-semibold">{title}</h1>
        <p className={`text-center font-medium text-xs mt-1 ${additionalText ? 'mb-4' : ''} opacity-50`}>{text}</p>

        {additionalText ? (
          <p className="text-center text-xs font-semibold opacity-80">{additionalText}</p>
        ) : null}
      </div>
    </div>
  );
}

Card.propTypes = {
  imgUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  additionalText: PropTypes.string,
  isCustomImage: PropTypes.bool,
};

Card.defaultProps = {
  additionalText: null,
  isCustomImage: false,
};
