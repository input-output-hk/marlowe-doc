# Runtime documentation

# Section 1: Deploying Marlowe runtime

## Deploying Marlowe runtime backend services

* [Manually](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/deployment.md)
* [Using Docker](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/docker.md)

# Section 2: Using runtime

## [2.1 High-level introduction to Marlowe runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md)

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

## [2.2 Runtime tutorial: The ACTUS principal at maturity (PAM) contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.md)

* Full-length tutorial document demonstrates how to run an example Marlowe contract, the ACTUS Principal at Maturity (PAM) contract, using the Marlowe Runtime backend and its command-line tool. 
* See [tutorial.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb) to view this tutorial as a Jupyter notebook. 

## [2.3 Introduction and overview of Marlowe chain sync](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-chain-sync/README.md)

* An efficient chain indexer and synchronization engine for Marlowe runtime

   * Overview/intro to Marlowe chain sync
   * Running the Cardano node
   * Running the chain sync
   * Adding a new query
   * Configuring the log output

* Commands 

   * `marlowe-chain-indexer`
   * `chainseekd`

## [2.4 Chain seek protocol](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-chain-sync/docs/chain-seek-spec-1.0.md)

* A modification of the Chain Sync Protocol
* Application-level protocol for writing off-chain code
* A fairly detailed document covering Chain Seek Protocol
    * Purpose
    * Requirements
    * Terminology
    * Operation
    * A Note on Intersections
    * State Machine
    * States
    * Messages
    * Appendix
    * state machine diagram

# Section 3: Runtime CLI executables for backend services

## [3.1 Application for scale testing of Marlowe runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Scaling.md)

* Run multiple Marlowe test contracts in parallel. 
* This command-line tool is a scaling test client for Marlowe Runtime: it runs multiple contracts in parallel against a Marlowe Runtime backend, with a specified number of contracts run in sequence for each party and each party running contracts in parallel.

* Commands

   * `marlowe-scaling`

## [3.2 General-purpose oracle for Marlowe runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Oracle.md)

* This oracle watches the blockchain for Marlowe contracts that have a `choice` action ready for input.

   * Security considerations
   * Data feeds available
   * Running the oracle
   * Creating example contracts
   * Design
   * Document lists command options

* Commands

   * `marlowe-oracle`

## [3.3 Find active Marlowe contracts](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Finder.md)

* The command-line tool `marlowe-finder` watches a Cardano blockchain for contracts that are "active," meaning that they are awaiting input. 
* To run `marlowe-finder`, set environment variables to the hosts and ports for the Marlowe runtime instances and filter the output for information of interest. 
* Document lists command options

* Commands 

   * `marlowe-finder`

## [3.4 Chain Seek Daemon](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/chainseekd.md)

* A chain seek server for the Marlowe runtime
* The `chainseekd` executable provides services for querying the blockchain for information that may relate to Marlowe contracts. 
* Document lists command options

* Commands

   * `chainseekd`

## [3.5 Chain indexer for Marlowe runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-chain-indexer.md)

* The `marlowe-chain-indexer` executable follows a local blockchain node and writes the blocks and transactions to a database.
* Document lists command options
* Commands

   * `marlowe-chain-indexer`

## [3.6 Marlowe discovery service](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-discovery.md)

* Contract discovery service for Marlowe runtime
* The `marlowe-discovery` executable provides services for discoverying the on-chain presence of Marlowe contracts. 
* Document lists command options

* Commands

   * `marlowe-discovery`

## [3.7 Marlowe History Service](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-discovery.md)

* Contract history service for Marlowe runtime
* The `marlowe-history` executable provides services for querying the on-chain history of Marlowe contracts. 
* Document lists command options

* Commands

   * `marlowe-history`

## [3.8 Marlowe Transaction Service](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-tx.md)

* Runtime transaction creation server
* The `marlowe-tx` executable provides services related to building and submitting transactions for Marlowe contracts. 
* Document lists command options

* Commands

   * `marlowe-tx`

# Section 4: Command-Line Interface to Marlowe runtime

## [4.1 Command-Line Interface to Marlowe runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe.md) 

* The `marlowe` executable provides a command-line interface for interacting with Marlowe runtime services. 
* The above document groups and lists the executables according to the categories shown below: 
   * Building transactions
   * Submitting transactions
   * Querying history
   * Document lists command options

   * Commands

      * `marlowe`

### Section 4.1.1 Building transactions

* [Create a Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/create.md)

* [Advance a Contract through a Timeout](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/advance.md)

* [Apply a Choice to a Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/choose.md)

* [Deposit Funds into a Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/deposit.md)

* [Notify a Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/notify.md)

* [Apply Multiple Inputs to a Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/apply.md)

* [Withdraw Funds Paid by a Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/withdraw.md)

### Section 4.1.2 Submitting transactions

* [Submit a Signed Transaction to the Node](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/submit.md)

### Section 4.1.3 Querying history

* [List the Contracts Being Tracked](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/ls.md)

* [Add a Contract to the Set of Tracked Contracts](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/add.md)

* [Remove a Contract from the Set of Tracked Contracts](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/rm.md)

* [Output the History of a Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe/ls.md)

# Section 5: Marlowe runtime examples

* These [examples](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/ReadMe.md) are Jupyter notebook files

## [5.1 Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create.ipynb) 

* ACTUS PAM contract example

## [5.2 Demonstrating the Marlowe Transaction Deposit (Advance?) Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/advance.ipynb)

* ACTUS PAM contract example

## [5.3 Demonstrating the Marlowe Transaction Deposit Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/deposit.ipynb)

* ACTUS PAM contract example

## [5.4 Demonstrating the Marlowe Transaction Choose Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/choose.ipynb)

* Contract example

## [5.5 Demonstrating the Marlowe Transaction Notify Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/notify.ipynb)

* Contract example

## [5.6 Demonstrating the Marlowe History Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/history.ipynb)

* ACTUS PAM contract example

## [5.7 Demonstrating the Marlowe Transaction Submit Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/submit.ipynb)

* ACTUS PAM contract example

## [5.8 `Close` Contract on Mainnet Using Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/runtime-close.ipynb)

* Setting the parameters for the `Close` contract

## [5.9 Demonstrating the Marlowe Transaction Deposit Component of Marlowe Runtime Using Role Tokens](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/roles.ipynb)

* ACTUS PAM contract example

## [5.10 Demonstration of Marlowe Runtime Capabilities](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/token-bid.ipynb)

* Executive Summary
   * This contract for a token sale uses nearly all of the features of the Marlowe Runtime backend. The marlowe commands create, deposit, choose, notify, and advance transition the contract, and the command withdraw redeems funds paid by the contract. It can be run using addresses for the parties, role tokens for the parties, or a mixture of addresses and role tokens for the parties.

## [5.11 Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create-close-native-tok.ipynb)

* Contract example

## [5.12 Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create-many-utxos.ipynb)

* ACTUS PAM contract example

