---
title: Marlowe Runtime
sidebar_position: 5
---

Marlowe Runtime is the application backend for managing Marlowe contracts on the Cardano blockchain. It provides easy-to-use, higher-level APIs and complete backend services that enable developers to build and deploy enterprise and Web 3 DApp solutions using Marlowe, but without having to assemble the “plumbing” that manually orchestrates a backend workflow for a Marlowe-based application. 

## Marlowe Runtime's role

Marlowe has a refined view of the Cardano ledger model. The job of Runtime is to map between the Marlowe conceptual model and the Cardano ledger model in both directions. Runtime takes commands relevant to Marlowe ledger and maps them to Cardano ledger. This can also be done with the REST API. 

Primarily, you can do two types of things with Runtime: 

* Discovering and querying on-chain Marlowe contracts 
* Creating Marlowe transactions

More specifically, the tasks you can do with Runtime include the following: 

* Creating contracts
* Building transactions 
* Submitting transactions 
* Querying contract history
* Listing contracts
* Other tasks 

## Comprehensive overview

For a detailed overview description of Runtime, please see: 

* [Marlowe Runtime's GitHub repository ReadMe](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/ReadMe.md) file

The ReadMe file covers the following topics: 

* Marlowe Runtime diagrams
* Architecture
* Backend Services
>   * Chain Sync Daemon executable
>   * Marlowe Transaction executable
>   * UTxO diagrams
* Marlowe Runtime command-line interface
* Web services
* Related documentation
>   * Overview of Marlowe language
>   * Example Marlowe contracts
>   * Marlowe language and semantics
>   * Marlowe implementation on Cardano
>   * Testing tools

## Using Runtime

| Additional Runtime documentation sections | 
|-------------------------------------------| 
| [Section 1. Deploying Marlowe Runtime](deploying-marlowe-runtime.md) | 
| [Section 2. Using Runtime](using-marlowe-runtime.md) | 
| [Section 3. Runtime Executables for Backend Services](runtime-executables-for-backend-services.md) | 
| [Section 4. Marlowe Runtime CLI](marlowe-runtime-cli.md) | 
| [Section 5. Marlowe Web Server](marlowe-web-server.md) | 
| [Section 6. Clients of Runtime](clients-of-runtime.md) | 
| [Section 7. Marlowe Runtime Examples](marlowe-runtime-examples.md) | 
| [Section 8. TxPipe and Demeter](txpipe-and-demeter.md) | 
| [Section 9. Runtime Tutorial: The ACTUS Principal at Maturity (PAM) Contract](runtime-tutorial-actus-pam.md) | 

See also: 

## Runtime video tutorials

| Video Title | Presenter | Date |
|-------------|-----------|-------------|
| [Using the Marlowe Runtime backend to execute a Marlowe contract on Cardano's preview network](https://youtu.be/WlsX9GhpKu8) | Brian Bush | Oct 2022 | 
| [Marlowe Runtime](https://youtu.be/8Bx2b2Gag0o) | Brian Bush | Oct 2022 | 
