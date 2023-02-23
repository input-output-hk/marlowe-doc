---
title: Marlowe Runtime
sidebar_position: 5
---

Marlowe Runtime is the application backend for managing Marlowe contracts on the Cardano blockchain. It provides easy-to-use, higher-level APIs and complete backend services that enable developers to build and deploy enterprise and Web(3) DApp solutions using Marlowe, but without having to assemble the “plumbing” that manually orchestrates a backend workflow for a Marlowe-based application. 

For a detailed overview description, see the [ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md) file in the [marlowe-runtime github repository](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-runtime). 

# Marlowe Runtime's job description

Marlowe has a refined view of the Cardano ledger model. The job of Runtime is to map between the Marlowe conceptual model and the Cardano ledger model in both directions. Runtime takes commands relevant to Marlowe ledger and maps them to Cardano ledger. This can also be done with the REST API. 

Primarily, you can do two types of things with Runtime: 

* Discovering and querying on-chain Marlowe contracts 
* Creating Marlowe transactions

In slightly more granular terms, the tasks involved include the following: 

* Creating contracts
* Building transactions 
* Submitting transactions 
* Querying contract history
* Listing contracts
* Other tasks 

> Add link to contract examples

Please see the following Runtime documentation subsections according to your specific project requirements: 

* > [Section 1. Deploying Marlowe Runtime](deploying-marlowe-runtime.md)

* > [Section 2. Using Runtime](using-marlowe-runtime.md)

* > [Section 3. Runtime Executables for Backend Services](runtime-executables-for-backend-services.md)

* > [Section 4. Command-Line Interface to Marlowe Runtime](command-line-interface-to-marlowe-runtime.md)

* > [Section 5. Marlowe Web Server](marlowe-web-server.md)

* > [Section 6. Clients of Runtime](clients-of-runtime.md)

* > [Section 7. Marlowe Runtime Examples](marlowe-runtime-examples.md)

* > [Section 8. TxPipe and Demeter](txpipe-and-demeter.md)

* > [Section 9. Runtime Tutorial: The ACTUS Principal at Maturity (PAM) Contract](runtime-tutorial-actus-pam.md)

