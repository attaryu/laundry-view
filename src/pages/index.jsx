import { MdPlayArrow } from 'react-icons/md/index';

// import { useRegisterMutation } from '@/stores/api/auth';

export default function Home() {
  return (
    <div className="w-100 h-screen flex justify-center items-center flex-col">
      <h1 className="font-extrabold text-4xl text-znic-900 selection:bg-zinc-800 selection:text-white">Hello World</h1>
      <p className="w-1/2 text-center text-zinc-900/70 mt-5 my-14 selection:bg-zinc-800 selection:text-white">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi vitae hic dignissimos sunt
        provident, labore blanditiis ipsum pariatur odit ipsa velit, eligendi magni. Vitae officiis
        maxime id omnis harum labore.
      </p>
      <button
        type="button"
        className="px-6 py-3 bg-zinc-800 hover:bg-zinc-900 transition duration-300 rounded-lg text-white font-semibold gap-1 flex items-center"
      >
        Start Code
        <MdPlayArrow className="scale-125" />
      </button>
    </div>
  );
}
