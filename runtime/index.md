# Runtime documentation

<br>

> NOTE
> 
> This is a review draft to identify essential topics and clarify overall organization. 
> 
> Are we missing any major pieces? 
> 
> The following topics are not yet addressed: 
> 
> * REST API using OpenAPI spec
> 
> * Haddock documentation

<br>

## Intended audience

This documentation is intended for anyone who needs to deploy or use [Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/tree/SCP-5012/marlowe-runtime). With Runtime, you can create a contract, apply inputs to it, list its history, and list contracts, among other tasks. 

The documentation here provides the information you need to build transactions, submit transactions, and query contract history. You can also learn essential information for working with the following resources: 

* Runtime executables for backend services
* Command-Line Interface to Marlowe Runtime
* Clients of Runtime

The last main section includes for your reference many contract examples as Jupyter notebook files. 

If you need to install and deploy Runtime, here you will find instructions for deploying manually or by using Docker. 

## What can you do with Marlowe Runtime? 

Primarily, you can do two types of things with Runtime: 

* Discovering and querying on-chain Marlowe contracts 
* Creating Marlowe transactions

Marlowe has a refined view of the Cardano ledger model. The job of Runtime is to map between the Marlowe conceptual model and the Cardano ledger model in both directions. Runtime takes commands relevant to Marlowe ledger and maps them to Cardano ledger. 

REST API is one of the methods you can use to do this.

# Section 1: Deploying Marlowe Runtime

## Deploying Marlowe Runtime backend services

* [Manually](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/deployment.md)
* [Using Docker](https://github.com/input-output-hk/marlowe-cardano#docker-compose)

# Section 2: Using Runtime

## [2.1 High-level introduction to Marlowe runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md)

> NOTE: The marlowe-runtime/doc/ReadMe.md needs to be updated to reflect that Marlowe History and Discovery are soon deprecated in favor of Marlowe Sync. Replace these two topics with Marlowe Sync. 

* Introduction
* Architecture
* Backend Services
* Chain Seek Daemon executable
* Marlowe Sync
* Marlowe Transaction executable
* Command-Line Interface
* AWS Lambda Interface -- *Retiring soon?*
* Web Services
* Links to related documentation

## [2.2 Introduction and overview of Marlowe chain sync](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-chain-sync/README.md)

* An efficient chain indexer and synchronization engine for Marlowe Runtime

   * Overview/intro to Marlowe chain sync
   * Running the Cardano node
   * Running the chain sync
   * Adding a new query
   * Configuring the log output

* Commands 

   * `marlowe-chain-indexer`
   * `chainseekd`

## [2.3 Chain seek protocol](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-chain-sync/docs/chain-seek-spec-1.0.md)

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

## [2.4 Marlowe sync](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-sync.md)

The `marlowe-sync` executable provides protocols that access Marlowe contract information.
It performs contract synchronization and query services for Marlowe Runtime. 

`marlowe-sync` accesses the database tables from `marlowe-indexer` that indexes all Marlowe contracts. There is not selective indexing. 

* Commands 

   * `marlowe-sync`

# Section 3: Runtime executables for backend services

Runtime executables for backend services help you run Marlowe contracts. 
"Backend services" refers to code that's running behind the scenes such as Marlowe web-server, Marlowe lambda, and Marlowe CLI. 
Backend services help out with running the front end with utilities and support. 

Backend services may reside in a docker container. 
If you are not using a docker container, you will need to launch them separately. 

The backend services are CLIs, but they are not utilities you would use. Rather, they are running in the background. 

> NOTE 
> 
> Looking ahead, Jamie will be writing something like `marlowe-proxy` to simplify the process so that it won't be necessary to work with all five items for backend services shown in this section. 

## [3.1 Chain Seek Daemon](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/chainseekd.md)

* A chain seek server for the Marlowe Runtime
* The `chainseekd` executable provides services for querying the blockchain for information that may relate to Marlowe contracts. 
* Document lists command options

* Commands

   * `chainseekd`

## [3.2 Chain indexer for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-chain-indexer.md)

* The `marlowe-chain-indexer` executable follows a local blockchain node and writes the blocks and transactions to a database.
* Document lists command options
* Commands

   * `marlowe-chain-indexer`

## [3.3 Marlowe indexer]()

`marlowe-indexer`

## [3.4 Marlowe Transaction Service](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-tx.md)

* Runtime transaction creation server
* The `marlowe-tx` executable provides services related to building and submitting transactions for Marlowe contracts. 
* Document lists command options

* Commands

   * `marlowe-tx`

## 3.5 Marlowe Sync Service

Add info about Marlow Sync Service. 

> NOTE: See the latest Runtime architecture diagram in slide 28 of https://docs.google.com/presentation/d/1KVkrlbJbUGxydcYlvrOO13kJWL4tov0GNqPLJFMEpew/edit?usp=sharing
> It is missing Marlowe Proxy and we should delete Marlowe Lambda. Perhaps we should clean up the diagram and have a separate box for utilities like the finder, oracle, and scaling? 

# Section 4: Command-Line Interface to Marlowe Runtime

## [4.1 Command-Line Interface to Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe.md) 

> NOTE 
> 
>  The document `marlowe-runtime/doc/marlowe.md` is out of date. It's likely that the `add`, `rm`, and `submit` commands will be removed, perhaps before the end of this PI. 

* The `marlowe` executable provides a command-line interface for interacting with Marlowe Runtime services. 
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

# [Section 5: Marlowe web-server](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime/web-server-app)

Nearly all Marlowe users would typically use the web-server. 
The web-server supports the Marlowe Runtime REST API. 

> NOTE 
> 
> We need to say more about Marlowe web-server. 

# Section 6: Clients of Runtime

The Clients of Runtime listed in this section are not backend services that are part of Runtime. 
Rather, they serve as examples of using the Runtime services that perform useful utility functions. 

## [6.1 Find active Marlowe contracts](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Finder.md)

* The command-line tool `marlowe-finder` watches a Cardano blockchain for contracts that are "active," meaning that they are awaiting input. 
* To run `marlowe-finder`, set environment variables to the hosts and ports for the Marlowe Runtime instances and filter the output for information of interest. 
* Document lists command options
* `marlowe-finder` can be run "out of the box" without any preliminaries and does not require you to create signing and verification keys. 

* Commands 

   * `marlowe-finder`

## [6.2 Application for scale testing of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Scaling.md)

* Run multiple Marlowe test contracts in parallel. 
* This command-line tool is a scaling test client for Marlowe Runtime: it runs multiple contracts in parallel against a Marlowe Runtime backend, with a specified number of contracts run in sequence for each party and each party running contracts in parallel.
* Requires key management (creating signing and verification keys). 

* Commands

   * `marlowe-scaling`

## [6.3 General-purpose oracle for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Oracle.md)

* This oracle watches the blockchain for Marlowe contracts that have a `choice` action ready for input.

   * Security considerations
   * Data feeds available
   * Running the oracle
   * Creating example contracts
   * Design
   * Document lists command options

* Requires key management (creating signing and verification keys). 

* Commands

   * `marlowe-oracle`

## [6.4 A Pipe Client for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/SCP-5012/marlowe-apps/Pipe.md)

Marlowe Pipe is a command-line tool that runs marlowe application requests. It reads lines of JSON from standard input, interpets them as Marlowe App requests, executes them, and prints the response JSON on standard output. 

* Commands

   * `marlowe-pipe`

# Section 7: Marlowe Runtime examples

> NOTE: These examples should primarily live in Runtime, but cross-referencing them from "browse examples" would make sense. 

* These [examples](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/ReadMe.md) are Jupyter notebook files

## [7.1 Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create.ipynb) 

* ACTUS PAM contract example

## [7.2 Demonstrating the Marlowe Transaction Deposit (Advance?) Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/advance.ipynb)

* ACTUS PAM contract example

## [7.3 Demonstrating the Marlowe Transaction Deposit Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/deposit.ipynb)

* ACTUS PAM contract example

## [7.4 Demonstrating the Marlowe Transaction Choose Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/choose.ipynb)

* Contract example

## [7.5 Demonstrating the Marlowe Transaction Notify Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/notify.ipynb)

* Contract example

## [7.6 Demonstrating the Marlowe History Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/history.ipynb)

* ACTUS PAM contract example

## [7.7 Demonstrating the Marlowe Transaction Submit Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/submit.ipynb)

* ACTUS PAM contract example

## [7.8 `Close` Contract on Mainnet Using Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/runtime-close.ipynb)

* Setting the parameters for the `Close` contract

## [7.9 Demonstrating the Marlowe Transaction Deposit Component of Marlowe Runtime Using Role Tokens](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/roles.ipynb)

* ACTUS PAM contract example

## [7.10 Demonstration of Marlowe Runtime Capabilities](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/token-bid.ipynb)

* Executive Summary
   * This contract for a token sale uses nearly all of the features of the Marlowe Runtime backend. The marlowe commands create, deposit, choose, notify, and advance transition the contract, and the command withdraw redeems funds paid by the contract. It can be run using addresses for the parties, role tokens for the parties, or a mixture of addresses and role tokens for the parties.

## [7.11 Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create-close-native-tok.ipynb)

* Contract example

## [7.12 Demonstrating the Marlowe Transaction Creation Component of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/examples/create-many-utxos.ipynb)

* ACTUS PAM contract example

# Section 7: TxPipe and Demeter

## Starter kit for TxPipe and Demeter

* [Placeholder for starter kit for TxPipe and Demeter]

<br>
<br>

# [Section 8: Runtime tutorial: The ACTUS principal at maturity (PAM) contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.md)

> NOTE: This tutorial section should be moved to the "Getting Started" category instead of under "Runtime." 

* Full-length tutorial document demonstrates how to run an example Marlowe contract, the ACTUS Principal at Maturity (PAM) contract, using the Marlowe Runtime backend and its command-line tool. 
* See [tutorial.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb) to view this tutorial as a Jupyter notebook. 

