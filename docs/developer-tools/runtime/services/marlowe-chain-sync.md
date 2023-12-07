---
title: Marlowe chain sync service
---

The `marlowe-chain-sync` executable provides services for querying the blockchain for information that may relate to Marlowe contracts.

```console
marlowe-chain-sync: Chain query and sync server for the Marlowe Runtime.

Usage: marlowe-chain-sync [--version] (-s|--socket-path SOCKET_FILE) 
                          [-m|--testnet-magic INTEGER]
                          (-d|--database-uri DATABASE_URI) [-h|--host HOST_NAME]
                          [--port PORT_NUMBER] [--query-port PORT_NUMBER] 
                          [--job-port PORT_NUMBER] [--http-port PORT_NUMBER]

  The chain query engine for the Marlowe Runtime. This component exposes three
  protocols through which downstream components can interact with the blockchain.
  These are: chain seek, chain query, and chain command.

  The chain seek protocol is a synchronization protocol which allows the follower
  to jump directly ahead to blocks that match a particular query.

  The chain query protocol allows various network parameters and UTxO state to be
  queried.

  The chain command protocol allows transactions to be submitted to the connected node.

  marlowe-chain-sync relies on the connected database being migrated and populated by
  a marlowe-chain-indexer instance. While marlowe-chain-sync can operate without
  marlowe-chain-indexer running, marlowe-chain-indexer must be run first to insert
  the genesis UTxOs before marlowe-chain-sync can be used, and relies on
  marlowe-chain-indexer to keep the database up-to-date.

  marlowe-chain-sync is designed to scale horizontally. That is to say, multiple
  instances can run in parallel to scale with demand. A typical setup for this would
  involve running multiple marlowe-chain-sync instances in front of a load balancer
  against a scalable postgres replica cluster being populated by a single chain indexer.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  -s,--socket-path SOCKET_FILE
                           Location of the cardano-node socket file. Defaults to
                           the CARDANO_NODE_SOCKET_PATH environment variable.
  -m,--testnet-magic INTEGER
                           Testnet network ID magic. Defaults to the
                           CARDANO_TESTNET_MAGIC environment variable.
  -d,--database-uri DATABASE_URI
                           URI of the database where the chain information is
                           saved.
  -h,--host HOST_NAME      The hostname to serve the chain sync protocol on.
                           (default: "127.0.0.1")
  --port PORT_NUMBER       The port number to serve the chain sync protocol on.
                           (default: 3715)
  --query-port PORT_NUMBER The port number to serve the query protocol on.
                           (default: 3716)
  --job-port PORT_NUMBER   The port number to serve the job protocol on.
                           (default: 3720)
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
```
