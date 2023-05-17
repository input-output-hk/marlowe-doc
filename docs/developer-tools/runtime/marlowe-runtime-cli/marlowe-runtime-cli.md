---
title: Marlowe Runtime CLI
sidebar_position: 1
---

## Command-line interface to Marlowe Runtime

The `marlowe-runtime-cli` executable provides a command-line interface to interacting with Marlowe Runtime services. All communication is via TCP sockets. 

## Prerequisite

All of the Marlowe Runtime services must be installed and running in order for Marlowe Runtime CLI to work.

## Executable program

`marlowe-runtime-cli` 


```console
Usage: marlowe-runtime-cli [--history-host HOST_NAME] [--history-sync-port PORT_NUMBER]
                           [--tx-host HOST_NAME] [--tx-command-port PORT_NUMBER]
                           (COMMAND | COMMAND | COMMAND)

  Command line interface for managing Marlowe smart contracts on Cardano.

Available options:
  -h,--help                Show this help text
  --history-host HOST_NAME The hostname of the Marlowe Runtime history server.
                           Can be set as the environment variable
                           MARLOWE_RT_HISTORY_HOST (default: "127.0.0.1")
  --history-sync-port PORT_NUMBER
                           The port number of the history server's
                           synchronization API. Can be set as the environment
                           variable MARLOWE_RT_HISTORY_SYNC_PORT (default: 3719)
  --tx-host HOST_NAME      The hostname of the Marlowe Runtime transaction
                           server. Can be set as the environment variable
                           MARLOWE_RT_TX_HOST (default: "127.0.0.1")
  --tx-command-port PORT_NUMBER
                           The port number of the transaction server's job API.
                           Can be set as the environment variable
                           MARLOWE_RT_TX_COMMAND_PORT (default: 3723)

Contract history commands
  log                      Display the history of a contract

Contract transaction commands
  apply                    Apply inputs to a contract
  advance                  Advance a timed-out contract by applying an empty set
                           of inputs.
  deposit                  Deposit funds into a contract
  choose                   Notify a contract to proceed
  notify                   Notify a contract to proceed
  create                   Create a new Marlowe Contract
  withdraw                 Withdraw funds paid to a role in a contract

Low level commands
  submit                   Submit a signed transaction to the Cardano node.
                           Expects the CBOR bytes of the signed Tx from stdin.
```

## Additional command-line help documentation

Navigate through the nine pages that follow in this section of the documentation to access details about the associated Marlowe Runtime CLI commands regarding building transactions, submitting transactions and querying history. 

## See also:

### [Lecture: Running Marlowe Contracts on the Blockchain](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/lectures/04-marlowe-cli-concrete.md)

* This is a lecture that demonstrates how to use `marlowe-runtime-cli` to run Marlowe contracts on the blockchain, but without using the Marlowe Backend. 

### [Tutorial for Marlowe Runtime -- The ACTUS Principal at Maturity (PAM) Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb)
