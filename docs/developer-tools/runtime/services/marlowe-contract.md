---
title: Marlowe contract service
---

The `marlowe-contract` executable provides services related to managing the Marlowe Runtime contract store.

```console
marlowe-contract : a contract storage service for the Marlowe Runtime.

Usage: marlowe-contract [-h|--host HOST_NAME] [-p|--port PORT_NUMBER] 
                        [--query-port PORT_NUMBER] [--transfer-port PORT_NUMBER]
                        [-b|--buffer-size INTEGER] [-s|--store-dir DIR] 
                        [--store-staging-dir DIR] 
                        [--store-lock-microseconds-between-retries MICRO_SECONDS]
                        [--http-port PORT_NUMBER]

  Contract storage service for Marlowe Runtime

Available options:
  -h,--help                Show this help text
  -h,--host HOST_NAME      The host name to run the server on.
                           (default: "127.0.0.1")
  -p,--port PORT_NUMBER    The port number to run the marlowe load server on.
                           (default: 3727)
  --query-port PORT_NUMBER The port number to run the query server on.
                           (default: 3728)
  --transfer-port PORT_NUMBER
                           The port number to run the transfer server on.
                           (default: 3729)
  -b,--buffer-size INTEGER The number of contracts to accept from the client
                           before flushing to disk. (default: 512)
  -s,--store-dir DIR       The root directory of the contract store
                           (default: "$XDG_DATA_DIR/marlowe/runtime/marlowe-contract/store")
  --store-staging-dir DIR  The root directory of the contract store staging
                           areas
  --store-lock-microseconds-between-retries MICRO_SECONDS
                           The number of microseconds to wait between retries
                           when acquiring the store lock (default: 500000)
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
```
