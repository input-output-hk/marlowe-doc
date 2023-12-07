---
title: Marlowe sync service
---

The `marlowe-sync` executable provides protocols that access Marlowe contract information.

```console
marlowe-sync: Contract synchronization and query service for the Marlowe
Runtime.

Usage: marlowe-sync [--version] (-d|--database-uri DATABASE_URI) 
                    [--sync-port PORT_NUMBER] [--header-sync-port PORT_NUMBER] 
                    [--bulk-sync-port PORT_NUMBER] [--query-port PORT_NUMBER] 
                    [-h|--host HOST_NAME] [--chain-sync-host HOST_NAME] 
                    [--chain-sync-query-port PORT_NUMBER] 
                    [--http-port PORT_NUMBER]

  The contract query engine for the Marlowe Runtime. This component exposes four
  protocols through which downstream components can interact with the blockchain.
  These are: marlowe sync, marlowe header sync, marlowe bulk sync, and marlowe query.

  The marlowe sync protocol is a synchronization protocol which follows the history
  of a specific marlowe contract.

  The marlowe header sync protocol is a synchronization protocol which scans the chain
  for new Marlowe contracts and presents them as a compact summary called a header.

  The marlowe bulk sync protocol is a synchronization protocol which combines the
  capabilities of marlowe header sync and marlowe sync. It presents a stream of blocks
  which contain a combination of all three contract transaction types: creation, input
  application, and payout withdrawal.

  The marlowe query protocol supports multiple queries that allow clients to fetch
  data about marlowe contracts as of the current blockchain tip. This means that it
  cannot guarantee consistent results between different queries, because the chain could
  update in between queries, changing the result of queries. If consistency is needed,
  use one of the sync protocols.

  marlowe-sync relies on the connected database being migrated and populated by a
  marlowe-indexer instance. While marlowe-sync can operate without marlowe-indexer running,
  The sqitch migrations must first be performed in order to create the expected tables, and
  marlowe-indexer must be running to keep the database up-to-date.

  marlowe-sync is designed to scale horizontally. That is to say, multiple instances can run
  in parallel to scale with demand. A typical setup for this would involve running multiple
  marlowe-sync instances in front of a load balancer against a scalable postgres replica
  cluster being populated by a single marlowe-indexer.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  -d,--database-uri DATABASE_URI
                           URI of the database where the contract information is
                           saved.
  --sync-port PORT_NUMBER  The port number to run the sync protocol on.
                           (default: 3724)
  --header-sync-port PORT_NUMBER
                           The port number to run the header sync protocol on.
                           (default: 3725)
  --bulk-sync-port PORT_NUMBER
                           The port number to run the bulk sync protocol on.
                           (default: 3730)
  --query-port PORT_NUMBER The port number to run the query protocol on.
                           (default: 3726)
  -h,--host HOST_NAME      The host name to run the server on.
                           (default: "127.0.0.1")
  --chain-sync-host HOST_NAME
                           The host name of the chain sync server.
                           (default: "127.0.0.1")
  --chain-sync-query-port PORT_NUMBER
                           The port number of the chain sync query server.
                           (default: 3716)
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
```
