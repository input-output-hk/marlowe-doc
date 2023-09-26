---
title: Marlowe chain sync service
---

The `marlowe-chain-sync` executable provides services for querying the blockchain for information that may relate to Marlowe contracts.

```console
marlowe-chain-sync : a chain sync server for the Marlowe Runtime.

Usage: marlowe-chain-sync [--version] (-s|--socket-path SOCKET_FILE)
                          [-m|--testnet-magic INTEGER]
                          (-d|--database-uri DATABASE_URI) [-h|--host HOST_NAME]
                          [--port PORT_NUMBER] [--query-port PORT_NUMBER]
                          [--job-port PORT_NUMBER] [--http-port PORT_NUMBER]

  Chain sync server for Marlowe Runtime.

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
