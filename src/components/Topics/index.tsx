import React from 'react';

import Link from '@docusaurus/Link';
import ArrowRight from '@site/static/icons/arrow_right.svg';
import Brain from '@site/static/icons/brain.svg';
import Book from '@site/static/icons/book.svg';
import Cube from '@site/static/icons/cube.svg';
import Puzzle from '@site/static/icons/puzzle.svg';
import Scroll from '@site/static/icons/scroll.svg';
import Tool from '@site/static/icons/tools.svg';

import styles from './styles.module.scss';

function Topics() {
  return (
    <div className={styles.gallery}>
      <div className="sub-heading">
        <div className="front-matter">
          <p>Marlowe is an ecosystem of tools and languages to enable development of financial and transactional smart contracts. Formal proofs, extensive testing, and analysis tools provide strong assurances for the safety of Marlowe smart contracts. <br />
          <br />
          Marlowe includes a full suite of tooling to support all skill levels, for both the community and enterprises.
          <br />
          <br />
          A Marlowe smart contract is built by combining a small number of building blocks that describe making a payment, making an observation of something in the "real world," waiting until a certain condition becomes true, and other similar types of concepts.
          </p>
        </div>
      </div>
      <div className="sub-heading">
        <h3>Popular topics</h3>
      </div>
      <div className={styles.card}>
        <div className="card-header">
          <Puzzle />
          <h4>Infrastructure</h4>
        </div>
        <p>Learn about the different components of Marlowe for deploying smart contracts in testnet and mainnet</p>
        <Link to="platform-and-architecture/architecture">
          Infrastructure <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <Tool />
          <h4>Tools</h4>
        </div>
        <p>Use provided tools such as the CLI and REST API for simplified workflows</p>
        <Link to="developer-tools/overview">
          Tools <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <Scroll />
          <h4>Smart Contract Language</h4>
        </div>
        <p>Read about Marlowe as a language to provide powerful abstractions to build faster</p>
        <Link to="platform-and-architecture/dsl">
          Smart contract language <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <Brain />
          <h4>Playground</h4>
        </div>
        <p>Explore how to write smart contracts directly in a browser</p>
        <Link to="https://play.marlowe.iohk.io/">
          Playground <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
        <Cube />
          <h4>Blockly</h4>
        </div>
        <p>Visually design smart contracts with a drag and drop interface</p>
        <Link to="https://play.marlowe.iohk.io/#/blockly">
          Blockly <ArrowRight className="arrow" />
        </Link>
      </div>
        <div className={styles.card}>
        <div className="card-header">
          <Book />
          <h4>API Reference</h4>
        </div>
        <p>Learn how to work with Marlowe on a lower level through the command line</p>
        <Link to="/api/get-contracts">
          API reference <ArrowRight className="arrow" />
        </Link>
      </div>
    </div>
  );
}

export default Topics;