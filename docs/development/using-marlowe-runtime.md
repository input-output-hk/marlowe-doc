---
title: Using Marlowe Runtime
---

# Section 2: Using Marlowe Runtime

## [2.1 High-level introduction to Marlowe runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md)

> NOTE: The marlowe-runtime/doc/ReadMe.md needs to be updated to reflect that Marlowe History and Discovery are soon deprecated in favor of Marlowe Sync. Replace these two topics with Marlowe Sync. 

* Introduction
* Architecture
* Backend Services
* Chain Seek Daemon executable
* Marlowe Sync
* Marlowe Transaction executable
* Command-Line Interface
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

## [2.3 Chain seek protocol](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-chain-sync/docs/chain-sync-spec-1.0.md)

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

