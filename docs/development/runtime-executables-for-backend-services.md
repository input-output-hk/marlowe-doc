---
title: Runtime Executables for Backend Services
---

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

## [3.1 Chain Sync Daemon](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-chain-sync.md)

* A chain sync server for the Marlowe Runtime
* The `marlowe-chain-sync` executable provides services for querying the blockchain for information that may relate to Marlowe contracts. 
* Document lists command options

* Commands

   * `marlowe-chain-sync`

## [3.2 Chain indexer for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/marlowe-chain-indexer.md)

* The `marlowe-chain-indexer` executable follows a local blockchain node and writes the blocks and transactions to a database.
* Document lists command options
* Commands

   * `marlowe-chain-indexer`

## 3.3 Marlowe indexer

`marlowe-indexer`

**Missing content here**

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

