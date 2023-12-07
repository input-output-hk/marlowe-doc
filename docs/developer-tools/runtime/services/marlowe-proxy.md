---
title: Marlowe proxy service
---

The `marlowe-proxy` executable provides a single unified public API for the whole runtime.

```console
marlowe-proxy: The API gateway server for the Marlowe Runtime.

Usage: marlowe-proxy [--version] [-h|--host HOST_NAME] [-p|--port PORT_NUMBER] 
                     [--port-traced PORT_NUMBER] [--marlowe-sync-host HOST_NAME]
                     [--marlowe-sync-port PORT_NUMBER] 
                     [--marlowe-header-port PORT_NUMBER] 
                     [--marlowe-bulk-port PORT_NUMBER] 
                     [--marlowe-query-port PORT_NUMBER] 
                     [--marlowe-contract-host HOST_NAME] 
                     [--marlowe-load-port PORT_NUMBER] 
                     [--marlowe-transfer-port PORT_NUMBER] 
                     [--contract-query-port PORT_NUMBER] [--tx-host HOST_NAME] 
                     [--tx-command-port PORT_NUMBER] [--http-port PORT_NUMBER]

  The API gateway server for the Marlowe Runtime. It exposes all the public protocols of the
  Marlowe runtime as a single multiplexed protocol: marlowe sync, marlowe header sync, marlowe
  bulk sync, marlowe query, marlowe transaction job, marlowe load, marlowe transfer, and contract
  store query. Please consult the help text for the individual services for detailed descriptions
  of these individual protocols.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  -h,--host HOST_NAME      The host name to run the server on.
                           (default: "127.0.0.1")
  -p,--port PORT_NUMBER    The port number to run the server on. (default: 3700)
  --port-traced PORT_NUMBER
                           The port number to run the server with tracing on.
                           (default: 3701)
  --marlowe-sync-host HOST_NAME
                           The hostname of the Marlowe Runtime marlowe-sync
                           server. Can be set as the environment variable
                           MARLOWE_RT_SYNC_HOST (default: "127.0.0.1")
  --marlowe-sync-port PORT_NUMBER
                           The port number of the marlowe-sync server's
                           synchronization API. Can be set as the environment
                           variable MARLOWE_RT_SYNC_MARLOWE_SYNC_PORT
                           (default: 3724)
  --marlowe-header-port PORT_NUMBER
                           The port number of the marlowe-sync server's header
                           synchronization API. Can be set as the environment
                           variable MARLOWE_RT_SYNC_MARLOWE_HEADER_PORT
                           (default: 3725)
  --marlowe-bulk-port PORT_NUMBER
                           The port number of the marlowe-sync server's bulk
                           synchronization API. Can be set as the environment
                           variable MARLOWE_RT_SYNC_MARLOWE_BULK_PORT
                           (default: 3730)
  --marlowe-query-port PORT_NUMBER
                           The port number of the marlowe-sync server's query
                           API. Can be set as the environment variable
                           MARLOWE_RT_SYNC_MARLOWE_QUERY_PORT (default: 3726)
  --marlowe-contract-host HOST_NAME
                           The hostname of the Marlowe Runtime marlowe-contract
                           server. Can be set as the environment variable
                           MARLOWE_RT_CONTRACT_HOST (default: "127.0.0.1")
  --marlowe-load-port PORT_NUMBER
                           The port number of the marlowe-contract server's load
                           API. Can be set as the environment variable
                           MARLOWE_RT_CONTRACT_MARLOWE_LOAD_PORT (default: 3727)
  --marlowe-transfer-port PORT_NUMBER
                           The port number of the marlowe-contract server's
                           transfer API. Can be set as the environment variable
                           MARLOWE_RT_CONTRACT_MARLOWE_TRANSFER_PORT
                           (default: 3729)
  --contract-query-port PORT_NUMBER
                           The port number of the marlowe-contract server's
                           query API. Can be set as the environment variable
                           MARLOWE_RT_CONTRACT_QUERY_PORT (default: 3728)
  --tx-host HOST_NAME      The hostname of the Marlowe Runtime transaction
                           server. Can be set as the environment variable
                           MARLOWE_RT_TX_HOST (default: "127.0.0.1")
  --tx-command-port PORT_NUMBER
                           The port number of the transaction server's job API.
                           Can be set as the environment variable
                           MARLOWE_RT_TX_COMMAND_PORT (default: 3723)
  --http-port PORT_NUMBER  Port number to serve the http healthcheck API on
                           (default: 8080)
```
