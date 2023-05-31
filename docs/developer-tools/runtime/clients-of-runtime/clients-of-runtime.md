---
title: Clients of Runtime
sidebar_position: 1
---

The Clients of Runtime listed in this section are not part of Runtime's backend services. Rather, they serve as examples of using the Runtime services that perform useful utility functions. 

| Client | Description | 
| --- | --- | 
| **[Find active Marlowe contracts](finder.md)** | The command-line tool marlowe-finder watches a Cardano blockchain for contracts that are "active," meaning that they are awaiting input. | 
| **[Application for scale testing of Marlowe Runtime](scaling.md)** | Runs multiple Marlowe test contracts in parallel. This command-line tool is a scaling test client for Marlowe Runtime: it runs multiple contracts in parallel against a Marlowe Runtime backend, with a specified number of contracts run in sequence for each party and each party running contracts in parallel. Requires key management (creating signing and verification keys). | 
| **[General-purpose oracle for Marlowe Runtime](oracle.md)** | This oracle watches the blockchain for Marlowe contracts that have a choice action ready for input. Requires key management (creating signing and verification keys). | 
| **[A Pipe Client for Marlowe Runtime](pipe.md)** | Marlowe Pipe is a command-line tool that runs marlowe application requests. It reads lines of JSON from standard input, interprets them as Marlowe App requests, executes them, and prints the response JSON on standard output. | 

