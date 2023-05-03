---
title: Runtime internals
---

If you choose to set up your own Runtime deployment, you will need to understand how to work with the Runtime internals. The term *Runtime internals* refers to all of the Runtime executables, their command line options, what they need in their environment, and their dependencies. 

This section describes how the Runtime internals interact, how to configure the Runtime, how to deploy it, and how to set up the services so that they communicate with each other correctly. 

In some instances, one executable will connect directly to a different executable using a TCP/IP port and communicate using a protocol. 

As an example, `marlowe-indexer` and `marlowe-tx` both connect to the `marlowe-chain-sync` executable. When you start the `marlowe-chain-sync` executable, you need to specify the port on which each of its three protocols should be running. 

Then, to start `marlowe-tx` and `marlowe-indexer`, you need to specify the IP address where `marlowe-chain-sync` is running, the ports used to connect to the chain seek protocol, the query protocol and the job protocol. 

## Runtime executables

The Runtime internals include these six executables: 

* `marlowe-chain-indexer`
* `marlowe-chain-sync`
* `marlowe-indexer`
* `marlowe-sync`
* `marlowe-tx`
* `marlowe-proxy`

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

Four of the services (which ones?) require access to a PostgreSQL database. You will learn how to set that up. 

A couple of the services (which ones?) need to be connected to a Cardano node. 

## What's next? 

Navigate through the six pages that follow to see reference details for using the executables that are part of the Runtime internals. 
