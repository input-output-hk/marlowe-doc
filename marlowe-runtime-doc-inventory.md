# Marlowe Runtime Documentation Inventory

For planning purposes, this document lists the .md and .ipynb files found in these repos: 

* [marlowe-cardano/marlowe-runtime/doc/](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime/doc)

* [marlowe-cardano/marlowe-runtime/doc/marlowe/](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime/doc/marlowe)

* [marlowe-cardano/marlowe-runtime/examples/](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime/examples)

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
| chainseekd.md | The `chainseekd` executable provides services for querying the blockchain for information that may relate to Marlowe contracts. <br> - Lists available commands.| https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/chainseekd.md | 

------
------

## Deploying Marlowe Runtime Backend Services Manually

| Document | Description | URL |
| --- | --- | --- |
| deployment.md | Deploying the Marlowe Runtime requires running six backend services. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/deployment.md | 

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
| marlowe-chain-indexer.md | The `marlowe-chain-indexer` executable follows a local blockchain node and writes the blocks and transactions to a database. <br> - Describes commands.| https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-chain-indexer.md | 

------
------

## Marlowe Discovery Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-discovery.md | The `marlowe-discovery` executable provides services for discoverying the on-chain presence of Marlowe contracts. <br> - Describes commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-discovery.md | 

------
------

## Marlowe History Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-history.md | The `marlowe-history` executable provides services for querying the on-chain history of Marlowe contracts. <br> - Describes commands.| https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-history.md | 

------
------

## Marlowe Transaction Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-tx.md | The `marlowe-tx` executable provides services related to building and submitting transactions for Marlowe contracts. <br> - Describes commands.| https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-tx.md | 

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

## Marlowe Runtime Tutorial: The ACTUS Principal at Maturity (PAM) Contract

| Document | Description | URL |
| --- | --- | --- |
| tutorial.md | This tutorial demonstrates how to run an example Marlowe contract, the ACTUS Principal at Maturity (PAM) contract, using the Marlowe Runtime backend and its command-line tool. See [tutorial.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb) to view this tutorial as a Jupyter notebook. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.md | 

------
------

## Add a Contract to the Set of Tracked Contracts

| Document | Description | URL |
| --- | --- | --- |
| marlowe-runtime/doc/marlowe/add.md | Start managing a new contract. <br> - Shows commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/add.md |

------
------

## Build a Transaction to Advance a Contract through a Timeout

| Document | Description | URL |
| --- | --- | --- |
| advance.md | Advance a timed-out contract by applying an empty set of inputs. <br> - Shows commands.| https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/advance.md | 

------
------

## Build a Transaction to Apply Multiple Inputs to a Contract

| Document | Description | URL |
| --- | --- | --- |
| apply.md | Apply inputs to a contract | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/apply.md | 

------
------

## Build a Transaction to Apply a Choice to a Contract

| Document | Description | URL |
| --- | --- | --- |
| choose.md | Notify a contract to proceed | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/choose.md | 

------
------

## Build a Transaction to Create a Contract

| Document | Description | URL |
| --- | --- | --- |
| create.md | Create a new Marlowe Contract. <br> - Shows and explains commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/create.md | 

------
------

## Build a Transaction to Deposit Funds into a Contract

| Document | Description | URL |
| --- | --- | --- |
| deposit.md | Deposit funds into a contract. <br> - Shows commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/deposit.md | 

------
------

## Output the History of a Contract

| Document | Description | URL |
| --- | --- | --- |
| log.md | Display the history of a contract. <br> - Shows commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/log.md | 

------
------

## List the Contracts Being Tracked

| Document | Description | URL |
| --- | --- | --- |
| ls.md | List managed contracts. <br>- Shows commands | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/ls.md | 

------
------

## Build a Transaction to Notify a Contract

| Document | Description | URL |
| --- | --- | --- |
| notify.md | Notify a contract to proceed. <br>- Shows commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/notify.md | 

------
------

## Remove a Contract from the Set of Tracked Contracts

| Document | Description | URL |
| --- | --- | --- |
| rm.md | Stop managing a contract. <br>- Shows commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/rm.md | 

------
------

## Submit a Signed Transaction to the Node

| Document | Description | URL |
| --- | --- | --- |
| submit.md | Submit a signed transaction to the Cardano node. Expects the CBOR bytes of the signed Tx from stdin. <br>- Shows commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/submit.md | 

------
------

## Build a Transaction to Withdraw Funds Paid by a Contract

| Document | Description | URL |
| --- | --- | --- |
| withdraw.md | Withdraw funds paid to a role in a contract. <br>- Shows commands. | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/withdraw.md | 

------
------

# Marlowe Runtime Examples

## Miscellaneous Examples for Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| ReadMe.md | List of examples for Marlowe Runtime | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/ReadMe.md | 

------
------

## Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| create.ipynb | Preliminaries<br>Setup the faucet<br>Select network<br>Check that the reference script has been published<br>Participants<br>Time computations<br>The Contract<br>Run the Contract<br>Cleanup | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create.ipynb | 

------
------

## Demonstrating the Marlowe Transaction Deposit (Advance?) Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| advance.ipynb | Preliminaries<br>Setup the faucet<br>Select network<br>Check that the reference script has been published<br>Participants<br>Time computations<br>The Contract<br>Run the Contract<br>Cleanup | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/advance.ipynb | 

------
------

## Demonstrating the Marlowe Transaction Deposit Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| deposit.ipynb | Preliminaries<br>Setup the faucet<br>Select network<br>Check that the reference script has been published<br>Participants<br>The Party<br>The Counterparty<br>Time computations<br>The Contract<br>Run the Contract<br>Transaction 1. Create the contract<br>Transaction 2. Party deposits loan amount<br>Transaction 3. Counterparty repays the loan's interest<br>Transaction 4. Counterparty repays the loan's principal<br>Cleanup | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/deposit.ipynb | 

------
------

## Demonstrating the Marlowe Transaction Choose Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| choose.ipynb | Preliminaries<br>Setup the faucet<br>Select network<br>Check that the reference script has been published<br>Participants<br>Time computations<br>The Contract<br>Run the Contract<br>Transaction 1. Create the contract<br>Transaction 2. Make the choice<br>Cleanup | https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/choose.ipynb | 

------
------

* marlowe-runtime/examples/notify.ipynb

* marlowe-runtime/examples/history.ipynb

* marlowe-runtime/examples/submit.ipynb

* marlowe-runtime/examples/runtime-close.ipynb

* marlowe-runtime/examples/roles.ipynb

* marlowe-runtime/examples/token-bid.ipynb

* marlowe-runtime/examples/create-close-native-tok.ipynb

* marlowe-runtime/examples/create-many-utxos.ipynb

