---
title: Marlowe contract service
---

The `marlowe-contract` executable provides services related to managing the Marlowe Runtime contract store.

```console
marlowe-contract: Contract storage service for the Marlowe Runtime.

Usage: marlowe-contract [--version] [-h|--host HOST_NAME] 
                        [-p|--port PORT_NUMBER] [--query-port PORT_NUMBER] 
                        [--transfer-port PORT_NUMBER] 
                        [--chain-sync-host HOST_NAME] 
                        [--chain-sync-query-port PORT_NUMBER] 
                        [--marlowe-sync-host HOST_NAME] 
                        [--marlowe-bulk-port PORT_NUMBER] 
                        [-b|--buffer-size INTEGER] [-s|--store-dir DIR] 
                        [--store-staging-dir DIR] 
                        [--store-lock-microseconds-between-retries MICRO_SECONDS]
                        [--http-port PORT_NUMBER] [--min-contract-age MINUTES] 
                        [--max-store-size BYTES]

  The contract storage service for the Marlowe Runtime. It manages a crucial component of the
  Marlowe runtime: the contract store. The contract store is a content-addressable store of
  contracts indexed by their hashes. Contracts can refer to sub-contracts via their hashes via
  the MerkleizedCase construct. The contract store is used to store the continuations of a contract
  after it has been merkleized (a process which recursively replaces Case constructs with MerkleizedCase
  constructs). It is also used to lookup continuations when applying inputs to a merkleized contract.
  This component exposes three protocols: marlowe load, marlowe transfer, and contract store query.

  The marlowe load protocol is one way to import a contract incrementally into the store. It presents
  a stack-based interface for pushing a contract depth-first into the store.

  The marlowe transfer protocol is the other way to import a contract incrementally into the store.
  It leverages the Marlowe object model to allow bundles of user-defined marlowe objects to be streamed
  into the store. marlowe-contract will link the contract on-the-fly, merkleize the intermediate contracts,
  and build the final contract incrementally. This protocol is generally more efficient and flexible than
  Marlowe load because it allows duplicate sub-contracts to be pre-abstracted by the user. It also supports
  An export mode which will stream the closure of a contract from the store to the client as a Marlowe object
  bundle. This can be used to export continuations from the store and share it with other contract stores.

  The contract store query protocol provides queries that allow clients to fetch contracts by their hash,
  fetch the adjacency or closure sets of a contract, or merkleize an input.

  marlowe-contract depends on a marlowe-sync and marlowe-chain-sync instance to run automatic
  Garbage collection. These must both be running in order for marlowe-contract to run.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  -h,--host HOST_NAME      The host name to run the server on.
                           (default: "127.0.0.1")
  -p,--port PORT_NUMBER    The port number to run the marlowe load server on.
                           (default: 3727)
  --query-port PORT_NUMBER The port number to run the query server on.
                           (default: 3728)
  --transfer-port PORT_NUMBER
                           The port number to run the transfer server on.
                           (default: 3729)
  --chain-sync-host HOST_NAME
                           The host name of the chain sync server.
                           (default: "127.0.0.1")
  --chain-sync-query-port PORT_NUMBER
                           The chain sync server's query protocol port.
                           (default: 3716)
  --marlowe-sync-host HOST_NAME
                           The hostname of the Marlowe Runtime marlowe-sync
                           server. Can be set as the environment variable
                           MARLOWE_RT_SYNC_HOST (default: "127.0.0.1")
  --marlowe-bulk-port PORT_NUMBER
                           The port number of the marlowe-sync server's bulk
                           synchronization API. Can be set as the environment
                           variable MARLOWE_RT_SYNC_MARLOWE_BULK_PORT
                           (default: 3730)
  -b,--buffer-size INTEGER The number of contracts to accept from the client
                           before flushing to disk. (default: 512)
  -s,--store-dir DIR       The root directory of the contract store
                           (default: "/home/jamie/.local/share/marlowe/runtime/marlowe-contract/store")
  --store-staging-dir DIR  The root directory of the contract store staging
                           areas (default: "/tmp/nix-shell.er7Lmt")
  --store-lock-microseconds-between-retries MICRO_SECONDS
                           The number of microseconds to wait between retries
                           when acquiring the store lock (default: 500000)
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
  --min-contract-age MINUTES
                           The minimum age contracts in the store must reach
                           before they can be garbage collected.
                           (default: 86400s)
  --max-store-size BYTES   The maximum allowed size of the contract store, in
                           bytes. (default: 34359738368)
```
