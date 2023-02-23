---
title: Clients of Runtime
---

# Section 6: Clients of Runtime

The Clients of Runtime listed in this section are not backend services that are part of Runtime. 
Rather, they serve as examples of using the Runtime services that perform useful utility functions. 

## [6.1 Find active Marlowe contracts](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Finder.md)

* The command-line tool `marlowe-finder` watches a Cardano blockchain for contracts that are "active," meaning that they are awaiting input. 
* To run `marlowe-finder`, set environment variables to the hosts and ports for the Marlowe Runtime instances and filter the output for information of interest. 
* Document lists command options
* `marlowe-finder` can be run "out of the box" without any preliminaries and does not require you to create signing and verification keys. 

* Commands 

   * `marlowe-finder`

## [6.2 Application for scale testing of Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Scaling.md)

* Run multiple Marlowe test contracts in parallel. 
* This command-line tool is a scaling test client for Marlowe Runtime: it runs multiple contracts in parallel against a Marlowe Runtime backend, with a specified number of contracts run in sequence for each party and each party running contracts in parallel.
* Requires key management (creating signing and verification keys). 

* Commands

   * `marlowe-scaling`

## [6.3 General-purpose oracle for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-apps/Oracle.md)

* This oracle watches the blockchain for Marlowe contracts that have a `choice` action ready for input.

   * Security considerations
   * Data feeds available
   * Running the oracle
   * Creating example contracts
   * Design
   * Document lists command options

* Requires key management (creating signing and verification keys). 

* Commands

   * `marlowe-oracle`

## [6.4 A Pipe Client for Marlowe Runtime](https://github.com/input-output-hk/marlowe-cardano/blob/SCP-5012/marlowe-apps/Pipe.md)

Marlowe Pipe is a command-line tool that runs marlowe application requests. It reads lines of JSON from standard input, interpets them as Marlowe App requests, executes them, and prints the response JSON on standard output. 

* Commands

   * `marlowe-pipe`

