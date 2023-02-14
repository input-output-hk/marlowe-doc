import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import styles from './styles.modules.css';

// @ts-ignore
import MarloweLogoLight from '@site/static/img/marlowe-run-demo-logo-light.svg';
// @ts-ignore
import LoanImageUrl from '@site/static/img/loan-image.png';
// @ts-ignore
import PurchaseImageUrl from '@site/static/img/purchase-image.png';
// @ts-ignore
import CfdImageUrl from '@site/static/img/cfd-image.png';
// @ts-ignore
import CircleTopRight from '@site/static/img/circle-top-right.svg';
// @ts-ignore
import CircleBottomLeft from '@site/static/img/circle-bottom-left.svg';

const RunView: React.FC = () => {
  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  return (
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
        <div className='flex flex-col items-center'>
            <Tabs className={styles.run}>
              <TabItem value="loan" label="Loan" default>
                <img src={LoanImageUrl} />
                <h4 className='text-lg font-medium'>Lend, borrow and pay back tokens with an agreed interest rate.</h4>
              </TabItem>
              <TabItem value="purchase" label="Purchase">
                <img src={PurchaseImageUrl} />
                <h4 className='text-lg font-medium'>Safe purchases with the help of a mediator.</h4>
              </TabItem>
              <TabItem value="cfd" label="Contract for Differences">
                <img src={CfdImageUrl} />
                <h4 className='text-lg font-medium'>Bet on value price.</h4>
              </TabItem>
            </Tabs>
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
  );
};

export default RunView;