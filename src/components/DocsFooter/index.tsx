import React from 'react';
import Link from '@docusaurus/Link';
import Github from '@site/static/icons/github.svg';
import Twitter from '@site/static/icons/twitter.svg';
import Youtube from '@site/static/icons/youtube.svg';
import Discord from '@site/static/icons/discord.svg';

import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.scss';

function DocsFooter() {
  return (
    <footer className={styles['footer-wrapper']}>
      <div className={styles['logo-wrapper']}>
        <img src={useBaseUrl('/img/marlowe-logo-primary-black-purple.svg')} className={styles['light-logo']} />
        <img src={useBaseUrl('/img/marlowe-logo-primary-white-purple.svg')} className={styles['dark-logo']} />
      </div>
      <div className={styles['copyright-wrapper']}>
      {`© ${new Date().getFullYear()} IOHK All rights reserved`}
      </div>
      <div className={styles['footer-icon-wrapper']}>
        <div className={styles['social-icon']}>
          <Link href="https://github.com/input-output-hk/marlowe" rel="noopener noreferrer">
            <Github />
          </Link>
        </div>
        <div className={styles['social-icon']}>
          <Link href="https://discord.gg/inputoutput" rel="noopener noreferrer">
            <Discord />
          </Link>
        </div>
        <div className={styles['social-icon']}>
          <Link href="https://twitter.com/InputOutputHK" rel="noopener noreferrer">
            <Twitter />
          </Link>
        </div>
        <div className={styles['social-icon']}>
          <Link href="https://www.youtube.com/@IohkIo" rel="noopener noreferrer">
            <Youtube />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default DocsFooter;