---
title: Marlowe transaction service
---

The `marlowe-tx` executable provides services related to building and submitting transactions for Marlowe contracts.

```console
marlowe-tx : the transaction creation server of the Marlowe Runtime

Usage: marlowe-tx [--chain-sync-port PORT_NUMBER]
                  [--chain-sync-query-port PORT_NUMBER]
                  [--chain-sync-command-port PORT_NUMBER]
                  [--chain-sync-host HOST_NAME]
                  [--contract-query-port PORT_NUMBER]
                  [--contract-host HOST_NAME] [--command-port PORT_NUMBER]
                  [-h|--host HOST_NAME] [--submit-confirmation-blocks INTEGER]
                  [--analysis-timeout SECONDS] [--http-port PORT_NUMBER]

  Marlowe runtime transaction creation server

Available options:
  -h,--help                Show this help text
  --chain-sync-port PORT_NUMBER
                           The port number of the chain sync server.
                           (default: 3715)
  --chain-sync-query-port PORT_NUMBER
                           The port number of the chain sync query server.
                           (default: 3716)
  --chain-sync-command-port PORT_NUMBER
                           The port number of the chain sync job server.
                           (default: 3720)
  --chain-sync-host HOST_NAME
                           The host name of the chain sync server.
                           (default: "127.0.0.1")
  --contract-query-port PORT_NUMBER
                           The port number of the contract query server.
                           (default: 3728)
  --contract-host HOST_NAME
                           The host name of the contract server.
                           (default: "127.0.0.1")
  --command-port PORT_NUMBER
                           The port number to run the job server on.
                           (default: 3723)
  -h,--host HOST_NAME      The host name to run the tx server on.
                           (default: "127.0.0.1")
  --submit-confirmation-blocks INTEGER
                           The number of blocks after a transaction has been
                           confirmed to wait before displaying the block in
                           which was confirmed.
                           (default: BlockNo {unBlockNo = 0})
  --analysis-timeout SECONDS
                           The amount of time allotted for safety analysis of a
                           contract. (default: 15s)
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
```
