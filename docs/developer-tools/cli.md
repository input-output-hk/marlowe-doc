---
title: Marlowe CLI
sidebar_position: 5
---

## About Marlowe CLI

* Provides capabilities to work with Marlowe's Plutus validators and run Marlowe contracts manually. 
* Lightweight: No other tools or services needed.
* Executable program: `marlowe-cli`.

Marlowe CLI is a command-line tool that provides access to Marlowe capabilities on testnet and mainnet. It is specifically built for running Marlowe contracts directly without needing a web browser or mobile app. 

Just as the `cardano-cli` tool has enabled you to do for plain transactions, simple scripts, and Plutus scripts, the Marlowe CLI tool facilitates your ability to interact with and develop Marlowe contracts. You can measure transaction size, submit transactions, test your integration with wallets, and debug validators. It provides a very concrete representation of Marlowe contracts that is quite close to what is occurring on chain. 

You can create your own workflow that operates Marlowe or your own toolset so you can wrap the Marlowe CLI tool in the way that developers have wrapped `cardano-cli` to create services such as libraries, faucets and marketplaces. 

## [ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md)

See the [ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md) file for details about the following topics: 

* installation instructions (Nix or Cabal) 
* Marlowe CLI command descriptions 
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

