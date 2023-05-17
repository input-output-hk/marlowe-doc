import React from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import Bridge from '@site/static/img/bridge.svg';
import Tools from '@site/static/img/tools.svg';
import Contract from '@site/static/img/contract.svg';

import styles from './styles.module.css';

// import Button from './../components/global/Button';
// import Card from './../components/global/Card';


const Docs = () => {
  return <Layout>
    <div className="container">
      <div className="hero shadow--lw">
        <div className="container">
          <h1 className="hero__title">Introduction to Marlowe</h1>
          <p className="hero__subtitle">Enabling smart contracts for all</p>
        </div>
      </div>

    <div className={styles.title}>Get Started With Marlowe</div>
    <div className="row">
      <div className="col">
        <div className="card-demo">
          <div className={clsx(styles.card, "card")}>
            <div className="card__header">
              <div className={styles.header}>
                <Bridge className={styles.icx} />
                <h3>Infrastructure</h3>
              </div>
            </div>
            <div className="card__body">
              <p>
                Learn about the different components of Marlowe for deploying smart contracts in testnet and mainnet
              </p>
            </div>
            <div className="card__footer">
                <button className="button button--link">Installation with Nix</button>
              <div>
                <button className="button button--link">Marlowe Architecture</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card-demo">
          <div className={clsx(styles.card, "card")}>
            <div className="card__header">
              <div className={styles.header}>
                  <Tools className={styles.icx} />
                  <h3>Tools</h3>
                </div>
              </div>
            <div className="card__body">
              <p>
                Use provided tools such as the CLI and REST API for simplified workflows
              </p>
            </div>
            <div className="card__footer">
              <button className="button button--link">API Reference</button>
              <div>
                <button className="button button--link">Tutorials</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card-demo">
          <div className={clsx(styles.card, "card")}>
            <div className="card__header">
              <div className={styles.header}>
                  <Contract className={styles.icx} />
                  <h3>Smart Contract Language</h3>
                </div>
              </div>
            <div className="card__body">
              <p>
                Read about Marlowe as a language to provide powerful abstractions to build faster
              </p>
            </div>
            <div className="card__footer">
              <button className="button button--link">Marlow Language Reference</button>
              <div>
              <button className="button button--link">Contract Examples</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.title}>Key Features</div>
      <div className="row">
        <div className="col">
          <div className="card-demo">
            <div className={clsx(styles.card, "card")}>
              <div className="card__header">
                <div className={styles.header}>
                  <h3>Playground</h3>
                </div>
              </div>
              <div className="card__body">
                <p>
                  Explore how to write smart contracts directly in a browser
                </p>
              </div>
              <div className="card__footer">
                <button className="button button--link">Go to Playground</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card-demo">
            <div className={clsx(styles.card, "card")}>
              <div className="card__header">
                <div className={styles.header}>
                  <h3>Blockly</h3>
                </div>
              </div>
              <div className="card__body">
                <p>
                  Visually design smart contracts with a drag and drop interface
                </p>
              </div>
              <div className="card__footer">
                <button className="button button--link">Go to Blockly</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card-demo">
            <div className={clsx(styles.card, "card")}>
              <div className="card__header">
                <div className={styles.header}>
                  <h3>CLI</h3>
                </div>
              </div>
              <div className="card__body">
                <p>
                  Learn how to work with Marlowe on a lower level through the command line
                </p>
              </div>
              <div className="card__footer">
                <button className="button button--link">Marlowe CLI Reference</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </Layout>
};

export default Docs;