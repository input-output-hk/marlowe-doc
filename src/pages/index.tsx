import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import MarloweLogoDark from '@site/static/img/marlowe-logo-dark.svg';

// @ts-ignore
import MarloweRunUrl from '@site/static/img/marlowe-run-image.png';
// @ts-ignore
import MarloweBuildUrl from '@site/static/img/marlowe-build-image.png';
// @ts-ignore
import ChevronSVG from '@site/static/img/chevron-down-dark.svg';
// @ts-ignore
import CircleTopRight from '@site/static/img/circle-top-right.svg';
// @ts-ignore
import CircleBottomLeft from '@site/static/img/circle-bottom-left.svg';
// @ts-ignore
import MarloweLogoLight from '@site/static/img/marlowe-run-demo-logo-light.svg';
// @ts-ignore
import LoanImageUrl from '@site/static/img/loan-image.png';
// @ts-ignore
import PurchaseImageUrl from '@site/static/img/purchase-image.png';
// @ts-ignore
import CfdImageUrl from '@site/static/img/cfd-image.png';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main>
        <section className={clsx('relative block bg-gradient-to-r from-purple to-lightpurple text-white h-auto w-full text-center lg:pt-44 md:pt-40 md:pb-20 pt-32 pb-14')}>
          <div className='mx-3 md:mx-5vw flex justify-center'>
            <div className='w-full max-w-screen-widest'>
              <MarloweLogoDark className="mx-auto lg:pb-0 md:pb-8 pb-8 lg:h-logo-wider h-logo" />
              <h1 className='md:font-comfortaa-bolder text-2xl md:text-4xl xl:text-5xl flex flex-col font-comfortaa-bold leading-tight lg:pt-8 pb-4'>Peer to peer financial agreements</h1>
              <h2 className='text-lg md:text-2xl xl:text-3xl pb-8'>Try our demo products built around Marlowe, the language made for finance.</h2>
            </div>
          </div>
          <div className='mx-3 md:mx-5vw flex justify-center'>
            <div className='grid grid-cols-1 md:grid-cols-2 md:mt-12 mt-8 w-full max-w-screen-widest'>
              <div className='mb-20 md:mb-0'>
                <h3 className='text-27px font-semibold pb-4 md:hidden block mt-12'>Run Marlowe contracts</h3>
                <img src={MarloweRunUrl} className={clsx('lg:w-2/3 w-full mx-auto')} />
                <h3 className='text-27px font-semibold pb-4 md:block hidden'>Run Marlowe contracts</h3>
                <p className='text-lg font-semibold'>Run our first collection of smart contract templates with the Marlowe Run app.</p>
              </div>
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

        <section className={clsx('relative bg-grayblue md:pt-24 md:pb-20 pt-16 pb-20 text-center')}>
          <div className='mx-3 md:mx-5vw flex justify-center'>
            <div className='w-full max-w-screen-widest'>
              <div>
                <MarloweLogoLight className='mx-auto lg:pb-0 md:pb-8 pb-8 h-logo lg:h-logo-wider' />
                <h2 className='md:text-3xl lg:text-4xl flex flex-col md:font-comfortaa-bolder font-comfortaa-bold leading-tight lg:pt-8 pb-4 text-27px'>Financial smart contracts made easy</h2>
                <h3 className='text-xl lg:text-2xl xl:text-27px pb-8'>Interact with running smart contracts on the web.</h3>
                <h4 className='text-lg lg:text-xl xl:text-2xl pb-8'>Try our first smart contract templates now (many more to come!).</h4>
              </div>
            </div>
          </div>
          <div className='mx-3 md:mx-5vw max-w-screen-widest widest:mx-auto'>
            <div id='contract-carousel' className='flex flex-col items-center'>
              <div id="carousel-selectors" className='mb-4 flex w-full max-w-2xl'>
                <span className='active cursor-pointer border-b flex-1 mr-2'>Loan</span>
                <span className='cursor-pointer border-b flex-1'>Purchase</span>
                <span className='cursor-pointer border-b flex-1 ml-2'>
                  <span className='hidden md:inline'>Contract for Differences</span>
                  <span className='md:hidden'>CFD</span>
                </span>
              </div>

              <div id='carousel-items' className='mb-4'>
                <div className='active hidden'>
                  <img src={LoanImageUrl} />
                  <h4 className='text-lg font-medium'>Lend, borrow and pay back tokens with an agreed interest rate.</h4>
                </div>
                <div className='hidden'>
                  <img src={PurchaseImageUrl} />
                  <h4 className='text-lg font-medium'>Safe purchases with the help of a mediator.</h4>
                </div>
                <div className='hidden'>
                  <img src={CfdImageUrl} />
                  <h4 className='text-lg font-medium'>Bet on value price.</h4>
                </div>
              </div>
            </div>
          </div>
          
          <div className='flex flex-col items-center justify-center'>
            <div className='mx-3 md:mx-5vw max-w-2xl w-full'>
              <h3 className='pt-16 text-xl font-semibold pb-4'>See how it works</h3>
            </div>
          </div>
          <div className='mt-16 mx-3 md:mx-5vw flex justify-center'>
            <div className='w-full max-w-screen-widest flex justify-center'>
              <Link to='https://run.marlowe-finance.io' className='primary-button text-lg text-center flex-grow md:flex-grow-0'>Try demo</Link>
            </div>
          </div>
          <CircleTopRight className='section-circle-top-right hidden lg:block' />
          <CircleBottomLeft className='section-circle-bottom-left hidden lg:block' />
          <span id="build"></span>
        </section>
      </main>
    </Layout>
  );
}
