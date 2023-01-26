# Marlowe Runtime Documentation Plan

For planning purposes, this document lists the .md and .ipynb files found in these repos: 

* [marlowe-cardano/marlowe-runtime/doc/](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime/doc)

* [marlowe-cardano/marlowe-runtime/examples/](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime/examples)

* [marlowe-cardano/marlowe-runtime/doc/marlowe/](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime/doc/marlowe)

* What additional sources of documentation should we be looking at? 

------
------

## ReadMe.md

| Document | Description | URL |
| --- | --- | --- |
| Marlowe Runtime Documentation | Top-level intro page to runtime docs | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md | 

### Topics included

* Introduction

* Architecture

* Backend Services

* Chain Seek Daemon executable

* Marlowe History executable

* Marlowe Discovery executable

* Marlowe Transaction executable

* Command-Line Interface

* AWS Lambda Interface

* Web Services

* Related Documentation

   * Overview of Marlowe Language

   * Example Marlowe Contracts

   * Marlowe Language and Semantics

   * Marlowe Implementation on Cardano

   * Testing tools

------
------

## Chain Seek Daemon

| Document | Description | URL |
| --- | --- | --- |
| Chain Seek Daemon | The `chainseekd` executable provides services for querying the blockchain for information that may relate to Marlowe contracts. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/chainseekd.md | 

### Topics included

* Lists available commands

------
------

## Deploying Marlowe Runtime Backend Services Manually

| Document | Description | URL |
| --- | --- | --- |
| Deploying Marlowe Runtime Backend Services Manually | Deploying the Marlowe Runtime requires running six backend services. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/deployment.md | 

### Topics included

* Six backend services need to deploy Marlowe Runtime

* Building the Executables

* Configuring the Backend Services

* Running the Backend Services

* Checking the Deployment

------
------

## Deploying Marlowe Runtime Backend Services Using Docker

| Document | Description | URL |
| --- | --- | --- |
| docker.md | This document describes how to deploy using Docker. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/docker.md | 

### Topics included

* Four marlowe-cardano services

   * `chanseekd`

   * `marlowe-history`

   * `marlowe-discovery`

   * `marlowe-tx`

* cardano-node

* PostgreSQL

------
------

## Chain Indexer Daemon

| Document | Description | URL |
| --- | --- | --- |
| marlowe-chain-indexer.md | The `marlowe-chain-indexer` executable follows a local blockchain node and writes the blocks and transactions to a database. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-chain-indexer.md | 

### Topics included

* Describes commands

------
------

## Marlowe Discovery Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-discovery.md | The `marlowe-discovery` executable provides services for discoverying the on-chain presence of Marlowe contracts. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-discovery.md | 

### Topics included

* Describes commands

------
------

## Marlowe History Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-history.md | The `marlowe-history` executable provides services for querying the on-chain history of Marlowe contracts. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-history.md | 

### Topics included

* Describes commands

------
------

## Marlowe Transaction Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-tx.md | The `marlowe-tx` executable provides services related to building and submitting transactions for Marlowe contracts. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-tx.md | 

### Topics included

* Describes commands

------
------

## Command-Line Interface to Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| marlowe.md | The `marlowe` executable provides a command-line interface to interacting with Marlowe Runtime services. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe.md | 

### Topics included

* Building transactions

* Submitting transactions

* Querying history

* Explanation of commands

------
------

## Add a Contract to the Set of Tracked Contracts

| Document | Description | URL |
| --- | --- | --- |
| marlowe-runtime/doc/marlowe/add.md | Start managing a new contract | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/add.md |

## Topics

* Shows commands

------
------

## Build a Transaction to Advance a Contract through a Timeout

| Document | Description | URL |
| --- | --- | --- |
| marlowe-runtime/doc/marlowe/advance.md | Advance a timed-out contract by applying an empty set of inputs. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/advance.md | 

## Topics

* Shows commands

------
------

## Build a Transaction to Apply Multiple Inputs to a Contract

| Document | Description | URL |
| --- | --- | --- |
| marlowe-runtime/doc/marlowe/apply.md | Apply inputs to a contract | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/apply.md | 

------
------

## Build a Transaction to Apply a Choice to a Contract

| Document | Description | URL |
| --- | --- | --- |
| marlowe-runtime/doc/marlowe/choose.md | Notify a contract to proceed | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/choose.md | 

------
------

## Build a Transaction to Create a Contract

| Document | Description | URL |
| --- | --- | --- |
| marlowe-runtime/doc/marlowe/create.md | Create a new Marlowe Contract | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/create.md | 

* Shows and explains commands

------
------

## marlowe-runtime/doc/marlowe/deposit.md

* Build a Transaction to Deposit Funds into a Contract

------
------

## marlowe-runtime/doc/marlowe/log.md

* Output the History of a Contract

------
------

## marlowe-runtime/doc/marlowe/ls.md

* List the Contracts Being Tracked

------
------

## marlowe-runtime/doc/marlowe/notify.md

* Build a Transaction to Notify a Contract

------
------

## marlowe-runtime/doc/marlowe/rm.md

* Remove a Contract from the Set of Tracked Contracts

------
------

## marlowe-runtime/doc/marlowe/submit.md

* Submit a Signed Transaction to the Node

------
------

## marlowe-runtime/doc/marlowe/withdraw.md

* Build a Transaction to Withdraw Funds Paid by a Contract

------
------

## marlowe-runtime/doc/tutorial.md

* Marlowe Runtime Tutorial: The ACTUS Principal at Maturity (PAM) Contract

------
------

## marlowe-runtime/examples/ReadMe.md

* Miscellaneous Examples for Marlowe Runtime

------
------

# Marlowe Runtime Examples

## marlowe-runtime/examples/ repo

* marlowe-runtime/examples/advance.ipynb

* marlowe-runtime/examples/choose.ipynb

* marlowe-runtime/examples/create-close-native-tok.ipynb

* marlowe-runtime/examples/create-many-utxos.ipynb

* marlowe-runtime/examples/create.ipynb

* marlowe-runtime/examples/deposit.ipynb

* marlowe-runtime/examples/history.ipynb

* marlowe-runtime/examples/notify.ipynb

* marlowe-runtime/examples/roles.ipynb

* marlowe-runtime/examples/runtime-close.ipynb

* marlowe-runtime/examples/submit.ipynb

* marlowe-runtime/examples/token-bid.ipynb

