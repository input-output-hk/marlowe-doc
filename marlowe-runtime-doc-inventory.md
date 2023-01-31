# Marlowe Runtime Documentation Inventory

For planning purposes, this document lists the .md and .ipynb files found in these repos: 

- [marlowe-apps](#applications-for-marlowe-runtime)

- [marlowe-chain-sync](#marlowe-chain-sync)

- [marlowe-runtime/doc](#marlowe-runtime-doc-section)

- [marlowe-runtime/doc/marlowe/](#marlowe-runtime-doc-marlowe-section)

- [marlowe-runtime/examples](#marlowe-runtime-examples)

# Applications for Marlowe Runtime

## Application for Scale Testing of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| Scaling.md | To run multiple contracts for multiple wallets, set environment variables to the hosts and ports for the Marlowe Runtime instances (see Help), and on the command line supply that along with the number of repetitions and the pairs of addresses and keys. | [marlowe-cardano/marlowe-apps/Scaling.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Scaling.md) |

## General-Purpose Oracle for Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| Oracle.md | This oracle watches the blockchain for Marlowe contracts that have a Choice action ready for input.<br>Security Considerations<br>Data Feeds Available<br>Running the Oracle<br>Creating Example Contracts<br>Design<br>List of commands. | [marlowe-cardano/marlowe-apps/Oracle.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Oracle.md) | 

## Find Active Marlowe Contracts

| Document | Description | URL |
| --- | --- | --- |
| Finder.md | The command-line tool `marlowe-finder` watches a Cardano blockchain for contracts that are "active" (i.e., awaiting input). To run it, set environment variables to the hosts and ports for the Marlowe Runtime instances and filter the output for information of interest. <br>Lists commands. | [marlowe-cardano/marlowe-apps/Finder.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Finder.md) | 

# Marlowe Chain Sync

### README.md

| Document | Description | URL |
| --- | --- | --- |
| README.md | Overview/intro to Marlowe Chain Sync<br>Running the Cardano Node<br>Running the chain sync<br>Adding a new query<br>Configuring the log output | [marlowe-chain-sync/README.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-chain-sync/README.md) | 

## marlowe-chain-sync/docs

### Chain Seek Protocol

| Document | Description | URL |
| --- | --- | --- |
| chain-seek-spec-1.0.md | A fairly detailed document covering Chain Seek Protocol. <br>Purpose<br>Requirements<br>Terminology<br>Operation<br>A Note on Intersections<br>State Machine<br>States<br>Messages<br>Appendix<br>state machine diagram | [marlowe-chain-sync/docs/chain-seek-spec-1.0.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-chain-sync/docs/chain-seek-spec-1.0.md)

# marlowe-runtime/doc

## marlowe-runtime-doc-section

## ReadMe.md

| Document | Description | URL |
| --- | --- | --- |
| Marlowe Runtime Documentation | Top-level intro page to runtime docs | [marlowe-runtime/doc/ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md) | 

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

* Links to related documentation

   * Overview of Marlowe Language

   * Example Marlowe Contracts

   * Marlowe Language and Semantics

   * Marlowe Implementation on Cardano

   * Testing tools

## Chain Seek Daemon

| Document | Description | URL |
| --- | --- | --- |
| chainseekd.md | The `chainseekd` executable provides services for querying the blockchain for information that may relate to Marlowe contracts. <br> - Lists available commands.| [marlowe-runtime/doc/chainseekd.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/chainseekd.md) | 

## Deploying Marlowe Runtime Backend Services Manually

| Document | Description | URL |
| --- | --- | --- |
| deployment.md | Deploying the Marlowe Runtime requires running six backend services. <br>Topics included:<br>- Six backend services need to deploy Marlowe Runtime<br>- Building the Executables<br>- Configuring the Backend Services<br>- Running the Backend Services<br>- Checking the Deployment | [marlowe-runtime/doc/deployment.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/deployment.md) | 

## Deploying Marlowe Runtime Backend Services Using Docker

| Document | Description | URL |
| --- | --- | --- |
| docker.md | This document describes how to deploy using Docker. | [marlowe-runtime/doc/docker.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/docker.md) | 

### Topics included

* Four marlowe-cardano services

   * `chanseekd`

   * `marlowe-history`

   * `marlowe-discovery`

   * `marlowe-tx`

* cardano-node

* PostgreSQL

## Chain Indexer Daemon

| Document | Description | URL |
| --- | --- | --- |
| marlowe-chain-indexer.md | The `marlowe-chain-indexer` executable follows a local blockchain node and writes the blocks and transactions to a database. <br> - Describes commands.| [marlowe-runtime/doc/marlowe-chain-indexer.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-chain-indexer.md) | 

## Marlowe Discovery Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-discovery.md | The `marlowe-discovery` executable provides services for discoverying the on-chain presence of Marlowe contracts. <br> - Describes commands. | [marlowe-runtime/doc/marlowe-discovery.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-discovery.md) | 

## Marlowe History Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-history.md | The `marlowe-history` executable provides services for querying the on-chain history of Marlowe contracts. <br> - Describes commands.| [marlowe-runtime/doc/marlowe-history.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-history.md) | 

## Marlowe Transaction Service

| Document | Description | URL |
| --- | --- | --- |
| marlowe-tx.md | The `marlowe-tx` executable provides services related to building and submitting transactions for Marlowe contracts. <br> - Describes commands.| [marlowe-runtime/doc/marlowe-tx.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-tx.md) | 

## Command-Line Interface to Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| marlowe.md | The `marlowe` executable provides a command-line interface to interacting with Marlowe Runtime services. <br>Topics included:<br>- Building transactions<br>- Submitting transactions<br>- Querying history<br>- Explanation of commands | [marlowe-runtime/doc/marlowe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe.md) | 

## Marlowe Runtime Tutorial: The ACTUS Principal at Maturity (PAM) Contract

| Document | Description | URL |
| --- | --- | --- |
| tutorial.md | This tutorial demonstrates how to run an example Marlowe contract, the ACTUS Principal at Maturity (PAM) contract, using the Marlowe Runtime backend and its command-line tool. See [tutorial.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb) to view this tutorial as a Jupyter notebook. | [marlowe-runtime/doc/tutorial.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.md) | 

# marlowe-runtime/doc/marlowe/

## marlowe-runtime-doc-marlowe-section

## Add a Contract to the Set of Tracked Contracts

| Document | Description | URL |
| --- | --- | --- |
| marlowe-runtime/doc/marlowe/add.md | Start managing a new contract. <br> - Shows commands. | [marlowe-runtime/doc/marlowe/add.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/add.md) |

## Build a Transaction to Advance a Contract through a Timeout

| Document | Description | URL |
| --- | --- | --- |
| advance.md | Advance a timed-out contract by applying an empty set of inputs. <br> - Shows commands. | [marlowe-runtime/doc/marlowe/advance.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/advance.md) | 

## Build a Transaction to Apply Multiple Inputs to a Contract

| Document | Description | URL |
| --- | --- | --- |
| apply.md | Apply inputs to a contract | [marlowe-runtime/doc/marlowe/apply.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/apply.md) | 

## Build a Transaction to Apply a Choice to a Contract

| Document | Description | URL |
| --- | --- | --- |
| choose.md | Notify a contract to proceed | [marlowe-runtime/doc/marlowe/choose.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/choose.md) | 

## Build a Transaction to Create a Contract

| Document | Description | URL |
| --- | --- | --- |
| create.md | Create a new Marlowe Contract. <br> - Shows and explains commands. | [marlowe-runtime/doc/marlowe/create.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/create.md) | 

## Build a Transaction to Deposit Funds into a Contract

| Document | Description | URL |
| --- | --- | --- |
| deposit.md | Deposit funds into a contract. <br> - Shows commands. | [marlowe-runtime/doc/marlowe/deposit.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/deposit.md) | 

## Output the History of a Contract

| Document | Description | URL |
| --- | --- | --- |
| log.md | Display the history of a contract. <br> - Shows commands. | [marlowe-runtime/doc/marlowe/log.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/log.md) | 

## List the Contracts Being Tracked

| Document | Description | URL |
| --- | --- | --- |
| ls.md | List managed contracts. <br>- Shows commands | [marlowe-runtime/doc/marlowe/ls.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/ls.md) | 

## Build a Transaction to Notify a Contract

| Document | Description | URL |
| --- | --- | --- |
| notify.md | Notify a contract to proceed. <br>- Shows commands. | [marlowe-runtime/doc/marlowe/notify.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/notify.md) | 

## Remove a Contract from the Set of Tracked Contracts

| Document | Description | URL |
| --- | --- | --- |
| rm.md | Stop managing a contract. <br>- Shows commands. | [marlowe-runtime/doc/marlowe/rm.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/rm.md) | 

## Submit a Signed Transaction to the Node

| Document | Description | URL |
| --- | --- | --- |
| submit.md | Submit a signed transaction to the Cardano node. Expects the CBOR bytes of the signed Tx from stdin. <br>- Shows commands. | [marlowe-runtime/doc/marlowe/submit.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/submit.md) | 

## Build a Transaction to Withdraw Funds Paid by a Contract

| Document | Description | URL |
| --- | --- | --- |
| withdraw.md | Withdraw funds paid to a role in a contract. <br>- Shows commands. | [marlowe-runtime/doc/marlowe/withdraw.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/withdraw.md) | 

# Marlowe Runtime Examples

## Miscellaneous Examples for Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| ReadMe.md | List of examples for Marlowe Runtime | [marlowe-runtime/examples/ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/ReadMe.md) | 

## Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| create.ipynb | Preliminaries<br>Setup the faucet<br>Select network<br>Check that the reference script has been published<br>Participants<br>Time computations<br>The Contract<br>Run the Contract<br>Cleanup | [marlowe-runtime/examples/create.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create.ipynb) | 

## Demonstrating the Marlowe Transaction Deposit (Advance?) Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| advance.ipynb | Preliminaries<br>Setup the faucet<br>Select network<br>Check that the reference script has been published<br>Participants<br>Time computations<br>The Contract<br>Run the Contract<br>Cleanup | [marlowe-runtime/examples/advance.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/advance.ipynb) | 

## Demonstrating the Marlowe Transaction Deposit Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| deposit.ipynb | Preliminaries<br>Setup the faucet<br>Select network<br>Check that the reference script has been published<br>Participants<br>The Party<br>The Counterparty<br>Time computations<br>The Contract<br>Run the Contract<br>Transaction 1. Create the contract<br>Transaction 2. Party deposits loan amount<br>Transaction 3. Counterparty repays the loan's interest<br>Transaction 4. Counterparty repays the loan's principal<br>Cleanup | [marlowe-runtime/examples/deposit.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/deposit.ipynb) | 

## Demonstrating the Marlowe Transaction Choose Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| choose.ipynb | Preliminaries<br>Setup the faucet<br>Select network<br>Check that the reference script has been published<br>Participants<br>Time computations<br>The Contract<br>Run the Contract<br>Transaction 1. Create the contract<br>Transaction 2. Make the choice<br>Cleanup | [marlowe-runtime/examples/choose.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/choose.ipynb) | 

## Demonstrating the Marlowe Transaction Notify Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| notify.ipynb | Run the Contract<br>Transaction 1. Create the contract<br>Transaction 2. Make the notification | [marlowe-runtime/examples/notify.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/notify.ipynb) | 

## Demonstrating the Marlowe History Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| history.ipynb | The Contract<br>Create two transactions so that they can be viewed by Marlowe History<br>Transaction 1. Create the contract<br>Transaction 2. Party deposits loan amount<br>Contract history commands<br>Add the contract to Marlowe History<br>List the contracts managed by Marlowe History<br>Check removal of the contract from Marlowe History<br>List all Marlowe contracts<br>See if there are any failed contracts<br>View the basic information about the contract<br>View the contract itself<br>Finish running the contract<br>Transaction 3. Counterparty repays the loan's interest<br>Transaction 4. Counterparty repays the loan's principal<br>Cleanup | [marlowe-runtime/examples/history.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/history.ipynb) | 

## Demonstrating the Marlowe Transaction Submit Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| submit.ipynb | The Contract<br>Run the Contract<br>Transaction 1. Create the contract<br>Transaction 2. Party deposits loan amount<br>Transaction 3. Counterparty repays the loan's interest<br>Transaction 4. Counterparty repays the loan's principal | [marlowe-runtime/examples/submit.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/submit.ipynb) |

## Close Contract on Mainnet Using Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| runtime-close.ipynb | This is the first contract executed on `mainnet` solely using the Marlowe Runtime backend. <br>Transaction 1. Create the contract<br>Build the transaction.<br>Sign the transaction.<br>Submit the transaction using Marlowe Runtime.<br>View the contract's UTxO.<br>Watch the contract.<br>View the contract's history.<br>Transaction 2. Party deposits loan amount<br>Sign the transaction.<br>Submit the transaction using Marlowe Runtime.<br>We see that the contract did indeed close.<br>The contract address is empty.<br>The party received their 2 Ada. | [marlowe-runtime/examples/runtime-close.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/runtime-close.ipynb) | 

## Demonstrating the Marlowe Transaction Deposit Component of Marlowe Runtime Using Role Tokens

| Document | Description | URL |
| --- | --- | --- |
| roles.ipynb | The Contract<br>We set the parameters for the ACTUS PAM contract.<br>Create the contract.<br>Since we are testing, we don't really want to wait months or years for timeouts, so we edit the contract file to change the maturity date to 15 minutes from now and the initial deposit to 10 minutes from now.<br>View the contract.<br>Run the Contract<br>Transaction 1. Create the contract<br>Transaction 2. Party deposits loan amount<br>Transaction 3. Counterparty repays the loan's interest<br>Transaction 4. Counterparty repays the loan's principal | [marlowe-runtime/examples/roles.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/roles.ipynb) | 

## Demonstration of Marlowe Runtime Capabilities 

| Document | Description | URL |
| --- | --- | --- |
| token-bid.ipynb | Executive Summary<br>This contract for a token sale uses nearly all of the features of the Marlowe Runtime backend. The marlowe commands create, deposit, choose, notify, and advance transition the contract, and the command withdraw redeems funds paid by the contract. It can be run using addresses for the parties, role tokens for the parties, or a mixture of addresses and role tokens for the parties. | [marlowe-runtime/examples/token-bid.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/token-bid.ipynb) | 

## Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime 

| Document | Description | URL |
| --- | --- | --- |
| create-close-native-tok.ipynb | Transaction 1. Create the contract<br>See what UTxOs the transaction-creation will have available to select from.<br>Build the transaction.<br>Sign the transaction.<br>Submit the transaction using Marlowe Runtime.<br>Watch the contract.<br>View the contract's UTxO.<br>Advance the contract | [marlowe-runtime/examples/create-close-native-tok.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create-close-native-tok.ipynb) | 

## Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime

| Document | Description | URL |
| --- | --- | --- |
| create-many-utxos.ipynb | We set the parameters for the ACTUS PAM contract.<br>Create the contract.<br>Since we are testing, we don't really want to wait months or years for timeouts, so we edit the contract file to change the maturity date to 15 minutes from now and the initial deposit to 10 minutes from now.<br>View the contract.<br>Run the Contract<br>Transaction 1. Create the contract | [marlowe-runtime/examples/create-many-utxos.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create-many-utxos.ipynb) | 

