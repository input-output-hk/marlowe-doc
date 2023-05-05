---
title: Deploying Runtime manually
---

If you choose to set up your own Runtime deployment, you will need to understand how to work with the Runtime internals. The term *Runtime internals* refers to all of the Runtime executables, their command line options, what they need in their environment, and their dependencies. 

This section describes how the Runtime internals interact, how to configure the Runtime, how to deploy it, and how to set up the services so that they communicate with each other correctly. 

In some instances, one executable will connect directly to a different executable using a TCP/IP port and communicate using a protocol. 

As an example, `marlowe-tx` and `marlowe-indexer` need to know an IP address and port where they can connect and speak to the protocol. This might be the actual host and port of a `marlowe-chain-sync` instance, or it could be a TCP proxy/TCP load balancer or some other intermediary. When you start the `marlowe-chain-sync` executable, you need to specify the port on which each of its three protocols should be running. 

Then, to start `marlowe-tx` and `marlowe-indexer`, you need to specify the IP address where `marlowe-chain-sync` is running, the ports used to connect to the chain seek protocol, the query protocol and the job protocol. 

There can also be instances when the components don't communicate via a protocol, wherein a shared database is used. Runtime components either communicate synchronously via TCP/IP, or asynchronously through shared databases (such as PostgreSQL). 

For example, `marlowe-tx` and `marlowe-indexer` communicate synchronously with `marlowe-chain-sync` via TCP/IP, and must be configured to connect to the correct IP address and port. Conversely, `marlowe-sync` communicates asynchronously with `marlowe-indexer` via a shared database.

In all cases where a shared database is used, one component has exclusive write access to that database, and all other components only read from it. In the above example, `marlowe-indexer` writes to the shared database and `marlowe-sync` reads from it. 

## Runtime executables

The Runtime internals include these six executables: 

* [`marlowe-chain-indexer`](marlowe-chain-indexer.md)
* [`marlowe-chain-sync`](marlowe-chain-sync.md)
* [`marlowe-indexer`](marlowe-indexer.md)
* [`marlowe-sync`](marlowe-sync.md)
* [`marlowe-tx`](marlowe-tx.md)
* [`marlowe-proxy`](marlowe-proxy.md)

:::note

The majority of what you need to know about the executables will be in each of their respective help text pages available in the subsequent pages in this Runtime internals section. 

:::

For each executable, you will need to know the following: 

* what it does 

* how it communicates with other executables

* what it needs to connect to 

* how to set it up in order to run it 

* its command line options

* what environment variables are available for configuration

* when it depends on another executable

## What's next? 

Navigate through the six pages that follow to see reference details for using the executables that are part of the Runtime internals. 
