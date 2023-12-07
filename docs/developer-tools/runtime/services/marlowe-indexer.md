---
title: Marlowe indexer service
---

The `marlowe-indexer` executable follows `marlowe-chain-sync` and writes Marlowe contract transactions to a database.

```console
marlowe-indexer: Contract indexing service for the Marlowe Runtime.

Usage: marlowe-indexer [--version] [--chain-sync-port PORT_NUMBER] 
                       [--chain-sync-query-port PORT_NUMBER] 
                       [--chain-sync-host HOST_NAME]
                       (-d|--database-uri DATABASE_URI) 
                       [--http-port PORT_NUMBER]

  The contract indexer for the Marlowe Runtime. It connects to a marlowe-chain-sync
  instance using both the chain seek and chain query protocol. It scans the chain for
  Marlowe contract transactions and saves them in a postgresql database. This database
  can be queried by downstream components, such as marlowe-sync.

  There should only be one instance of marlowe-indexer writing data to a given marlowe
  database. There is no need to run multiple indexers. If you would like to scale runtime
  services, it is recommended to deploy a postgres replica cluster, run one indexer to
  populate it, and as many marlowe-sync instances as required to read from it.

  Before running the indexer, the database must be created and migrated using
  sqitch. The migration plan and SQL scripts are included in the source code
  folder for marlowe-indexer.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --chain-sync-port PORT_NUMBER
                           The port number of the chain sync server.
                           (default: 3715)
  --chain-sync-query-port PORT_NUMBER
                           The port number of the chain sync query server.
                           (default: 3716)
  --chain-sync-host HOST_NAME
                           The host name of the chain sync server.
                           (default: "127.0.0.1")
  -d,--database-uri DATABASE_URI
                           URI of the database where the contract information is
                           saved.
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
```
