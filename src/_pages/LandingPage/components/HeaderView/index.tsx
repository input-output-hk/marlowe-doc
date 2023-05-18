import React from 'react';
import clsx from 'clsx';

// @ts-ignore
import MarloweBuildUrl from '@site/static/img/marlowe-build-image.png';
// @ts-ignore
import ChevronSVG from '@site/static/img/chevron-down-dark.svg';
// @ts-ignore
import CircleTopRight from '@site/static/img/circle-top-right.svg';
// @ts-ignore
import CircleBottomLeft from '@site/static/img/circle-bottom-left.svg';

const HeaderView: React.FC = () => {
  return (
    <section className={clsx('relative block bg-gradient-to-r from-purple to-lightpurple text-white h-auto w-full text-center lg:pt-44 md:pt-40 md:pb-20 pt-32 pb-14')}>
      <div className='mx-3 md:mx-5vw flex justify-center'>
        <div className='w-full max-w-screen-widest'>
          <h1 className='md:font-comfortaa-bolder text-2xl md:text-4xl xl:text-5xl flex flex-col font-comfortaa-bold leading-tight lg:pt-8 pb-4'>Peer to peer financial agreements</h1>
          <h2 className='text-lg md:text-2xl xl:text-3xl pb-8'>Try our demo products built around Marlowe, the language made for finance.</h2>
        </div>
      </div>
      <div className='mx-3 md:mx-5vw flex justify-center'>
        <div className='grid grid-cols-1 md:grid-cols-2 md:mt-12 mt-8 w-full max-w-screen-widest'>
          <div>
            <h3 className='text-27px font-semibold pb-4 md:hidden block'>Build Marlowe contracts</h3>
            <img src={MarloweBuildUrl} className='lg:w-2/3 w-full mx-auto' />
            <h2 className='text-27px font-semibold pb-4 md:block hidden'>Build Marlowe contracts</h2>
            <p className='text-lg font-semibold'>Write, build and simulate financial smart contracts with the Marlowe Build sandbox.</p>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:mt-20 mt-5 md:w-5/6 mx-auto w-11/12'>
        <a href="#run" className="scale">
          <h3 className="text-xl md:text-27px pb-2 mx-auto">Discover more</h3>
          <ChevronSVG className="w-12 mx-auto pb-0" />
        </a>
      </div>
      <CircleTopRight className='section-circle-top-right hidden lg:block' />
      <CircleBottomLeft className='section-circle-bottom-left hidden lg:block' />
      <span id="run"></span>
    </section>
  );
};

export default HeaderView;