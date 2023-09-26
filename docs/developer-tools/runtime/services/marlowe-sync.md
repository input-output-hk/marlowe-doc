---
title: Marlowe sync service
---

The `marlowe-sync` executable provides protocols that access Marlowe contract information.

```console
marlowe-sync : a contract synchronization and query service for the Marlowe
Runtime.

Usage: marlowe-sync (-d|--database-uri DATABASE_URI) [--sync-port PORT_NUMBER]
                    [--header-sync-port PORT_NUMBER] [--query-port PORT_NUMBER]
                    [-h|--host HOST_NAME] [--chain-sync-host HOST_NAME]
                    [--chain-sync-query-port PORT_NUMBER]
                    [--http-port PORT_NUMBER]

  Contract synchronization and query service for Marlowe Runtime

Available options:
  -h,--help                Show this help text
  -d,--database-uri DATABASE_URI
                           URI of the database where the contract information is
                           saved.
  --sync-port PORT_NUMBER  The port number to run the sync protocol on.
                           (default: 3724)
  --header-sync-port PORT_NUMBER
                           The port number to run the header sync protocol on.
                           (default: 3725)
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
