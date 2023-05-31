---
title: Architecture
sidebar_position: 2
---

![Marlowe Runtime Architecture](/img/Marlowe-Runtime-Architecture-8-Apr-2023.png)

## Overview of Marlowe architecture

The backend for Marlowe runtime consists of a chain-indexing and query service (`marlowe-chain-indexer` / `marlowe-chain-sync`), a contract-indexing and query service for Marlowe contracts (`marlowe-indexer` / `marlowe-sync`), and a transaction-creation service for Marlowe contracts (`marlowe-tx`). These backend services operate in concert and rely upon **[cardano-node](https://github.com/input-output-hk/cardano-node/blob/master/README.rst)** for blockchain connectivity and upon [PostgreSQL](https://www.postgresql.org/) for persistent storage. Access to the backend services is provided via a command-line client (`marlowe-runtime-cli`), or a REST/WebSocket server (`web-server`) that uses JSON payloads. Web applications can integrate with a **[CIP-30 light wallet](https://cips.cardano.org/cips/cip30/)** for transaction signing, whereas enterprise applications can integrate with **[cardano-wallet](https://github.com/input-output-hk/cardano-wallet/blob/master/README.md)**, **[cardano-cli](https://github.com/input-output-hk/cardano-node/blob/master/cardano-cli/README.md)**, or **[cardano-hw-cli](https://github.com/vacuumlabs/cardano-hw-cli/blob/develop/README.md)** for signing transactions.

## Backend services

The backend services use typed protocols over TCP sockets, with ports separate by concerns (i.e., control, query, and synchronization). Each service handles rollbacks via the use of intersection points that reference specific slots/blocks on the blockchain. Most of the data flow is stream-oriented, and the services prioritize statelessness. The information flow within the backend maximizes the node as the single source of truth, minimizing the danger of downstream components receiving inconsistent information. The Haskell types in the client API for Runtime Clients are decoupled from dependencies upon the numerous Cardano packages for the ledger, node, plutus, etc., so that a Haskell client for Runtime has very few Runtime or Cardano dependencies in its `.cabal` file.
