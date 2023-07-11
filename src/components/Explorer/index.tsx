import React from 'react';

import Link from '@docusaurus/Link';
import ArrowRight from '@site/static/icons/arrow_right.svg';

import styles from './styles.module.scss';

function Explorer() {
  return(
    <div className={styles.gallery}>
      <div className={styles.card}>
        <div className="card-header">
          <h4>Preview</h4>
        </div>
        <p>Preview Network Scanner.</p>
        <Link to="https://preview.marlowescan.com/">
          Open <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <h4>Preprod</h4>
        </div>
        <p>PreProd Network Scanner.</p>
        <Link to="https://preprod.marlowescan.com/">
          Open <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <h4>Mainnet</h4>
        </div>
        <p>Mainnet Network Scanner.</p>
        <Link to="https://mainnet.marlowescan.com/">
          Open <ArrowRight className="arrow" />
        </Link>
      </div>
    </div>
  );
}

export default Explorer;