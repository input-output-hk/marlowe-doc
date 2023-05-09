---
title: Deploying Runtime manually
---

If you choose to set up your own Runtime deployment, you will need to understand how to work with the Runtime internals. The term *Runtime internals* refers to all of the Runtime executables, their command line options, what they need in their environment, and their dependencies. 

This section describes how the Runtime internals interact, how to configure the Runtime, how to deploy it, and how to set up the services so that they communicate with each other correctly. 

In some instances, one executable will connect directly to a different executable using a TCP/IP port and communicate using a protocol. 

## Overview

As an example, `marlowe-tx` and `marlowe-indexer` need to know an IP address and port where they can connect and speak to the protocol. This might be the actual host and port of a `marlowe-chain-sync` instance, or it could be a TCP proxy/TCP load balancer or some other intermediary. When you start the `marlowe-chain-sync` executable, you need to specify the port on which each of its three protocols should be running. 

Then, to start `marlowe-tx` and `marlowe-indexer`, you need to specify the IP address where `marlowe-chain-sync` is running, the ports used to connect to the chain seek protocol, the query protocol and the job protocol. 

There can also be instances when the components don't communicate via a protocol, wherein a shared database is used. Runtime components either communicate synchronously via TCP/IP, or asynchronously through shared databases (such as PostgreSQL). 

For example, `marlowe-tx` and `marlowe-indexer` communicate synchronously with `marlowe-chain-sync` via TCP/IP, and must be configured to connect to the correct IP address and port. Conversely, `marlowe-sync` communicates asynchronously with `marlowe-indexer` via a shared database.

In all cases where a shared database is used, one component has exclusive write access to that database, and all other components only read from it. In the above example, `marlowe-indexer` writes to the shared database and `marlowe-sync` reads from it. 

`marlowe-chain-indexer` and `marlowe-chain-sync` need access to the same database (`marlowe-chain-sync` is read-only). `marlowe-chain-indexer` and `marlowe-chain-sync` both need to connect to a node. 

`marlowe-indexer` and `marlowe-sync` need access to the same database (`marlowe-sync` is read-only). 

## Creating and selecting PostgreSQL database

Select a database name for the `marlowe-chain-sync` database and create it using PostgreSQL's `createdb` command. 

Edit the file [`sqitch.conf`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-chain-sync/sqitch.conf) to reflect the PostgreSQL user and database names for your PostgreSQL installation.

### Tuning the PostgreSQL performance

Database performance on `mainnet` will be slow unless you tune the write-ahead log and other parameters in the `postgresql.conf` file as follows:
```console
shared_buffers = 2GB
huge_pages = try
temp_buffers = 2GB
max_prepared_transactions = 256
max_wal_size = 4GB
max_pred_locks_per_transaction = 256
```

:::note

If you are using our Docker images, you don't need to tune PostgreSQL or deal with sqitch because they are already packaged. 

:::

## Migrating the databases using sqitch

You will need to migrate the databases using `sqitch`. See the following two sections for instructions on how to do this. 

### Marlowe Chain Indexer Daemon

See the [help page](marlowe-chain-indexer.md) for all of the command-line options for `marlowe-chain-indexer`. One needs to specify a few options explicitly:
- `--socket-path` for the filesystem path to the Cardano node's socket.
- `--database-uri` for the location and name of the PostgreSQL database.
- `--genesis-config-file` for the filesystem path to the genesis file used by the Cardano node.
- `--shelley-genesis-config-file` for the filesystem path to the shelley genesis file used by the Cardano node.
- `--genesis-config-file-hash` for the hash of the genesis file.

A typical invocation of `marlowe-chain-indexer` will be something like the following:
```console
$ cd marlowe-chain-sync
$ sqitch deploy

$ marlowe-chain-indexer \
    --socket-path "$CARDANO_NODE_SOCKET_PATH" \
    --database-uri postgresql://postgresql@0.0.0.0/chain \
    --genesis-config-file byron-genesis.json \
    --shelley-genesis-config-file shelley-genesis.json \
    --genesis-config-file-hash 5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb
```
The `sqitch deploy` command handles database creation and migration, so it is only necessary to run that on new installations or after upgrading `marlowe-chain-sync`.
To be safe, consider running this command before each invocation of `marlowe-chain-indexer`.


### Marlowe Indexer Daemon

See the [help page](marlowe-indexer.md) for all of the command-line options for `marlowe-indexer`. One needs to specify a few options explicitly:
- `--database-uri` for the location and name of the PostgreSQL database.

A typical invocation of `marlowe-indexer` will be something like the following:
```console
$ cd marlowe-runtime/marlowe-indexer
$ sqitch deploy

$ marlowe-indexer \
    --database-uri postgresql://postgresql@0.0.0.0/chain \
```
The `sqitch deploy` command handles database creation and migration, so it is only necessary to run that on new installations or after upgrading `marlowe-indexer`.
To be safe, consider running this command before each invocation of `marlowe-indexer`.

## Runtime executables

The Runtime internals include these six executables: 

* [`marlowe-chain-indexer`](marlowe-chain-indexer.md)
* [`marlowe-chain-sync`](marlowe-chain-sync.md)
* [`marlowe-indexer`](marlowe-indexer.md)
* [`marlowe-sync`](marlowe-sync.md)
* [`marlowe-tx`](marlowe-tx.md)
* [`marlowe-proxy`](marlowe-proxy.md)

The majority of what you need to know about the executables will be in the help text pages in the subsequent pages of this section. 

For each executable, you will need to know the following: 

* what it does 

* how it communicates with other executables

* what it needs to connect to 

* how to set it up in order to run it 

* its command line options

* what environment variables are available for configuration

* when it depends on another executable

## What's next? 

Navigate through the six pages that follow to see reference details for using the executables that are part of deploying the Runtime manually. 
