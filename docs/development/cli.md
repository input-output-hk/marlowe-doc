---
title: Marlowe CLI Tool
sidebar_position: 6
---

An important distinction to understand is that there are two CLIs: 

   * Marlowe CLI 
   * Marlowe Runtime CLI 

| Tool | Definition | 
|-------------|-----------|
| Marlowe CLI Tool | `marlowe-cli` is a command-line tool built specifically for running Marlowe contracts. It enables developers to submit transactions with Marlowe contracts on the Cardano blockchain, just as the `cardano-cli` tool has enabled them to do for plain transactions, simple scripts, and Plutus scripts. |
| [Marlowe Runtime CLI](marlowe-runtime-cli.md) | Explanation |

## Marlowe CLI use cases

The Marlowe CLI tool facilitates your ability to interact with and develop Marlowe contracts. For example, you can measure transaction size, submit transactions to the blockchain, test your integration with wallets, and debug validators. 

Marlowe CLI provides access to Marlowe capabilities on testnet and mainnet. You can run Marlowe contracts directly without needing a web browser, a mobile app. You can create your own workflow that operates Marlowe. 

Can integrate with your own workflow or toolset so you can wrap the Marlowe cli tool in the way that folks have wrapped cardano cli to create services such as libraries, faucets, marketplaces, etc. Can be used for training in the use of Marlowe to help people get a deeper understanding of how Marlowe transactions work. 

Marlowe cli provides a very concrete representation of them that's quite close to what is occurring on chain. 

Three levels of interaction with Marlowe on the blockchain. 


## [ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md)

See the [ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md) file for details about the following topics: 

* installation instructions (Nix or Cabal) 
* `marlowe-cli` command descriptions 
* descriptions of high-level and low-level workflows for specific use cases 
* examples 
* test cases 
* automated tests 

## Commands

Use the `marlowe-cli` commands to perform these types of tasks: 

* read and write transactions 
* run a contract 
* create a contract 
* test a contract 
* create inputs to a contract 
* create and submit transactions 
* other utilities 


## [Marlowe CLI video tutorials](../tutorials/video-tutorials-index.md#marlowe-cli)

