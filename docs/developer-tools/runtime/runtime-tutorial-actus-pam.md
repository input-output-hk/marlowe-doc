---
title: Runtime tutorial
sidebar_position: 6
---

ACTUS (Algorithmic Contract Types Unified Standards) is a project aiming to simplify financial agreements by removing legal components and focusing on cash flow obligations. ACTUS provides **[specifications](https://www.actusfrf.org/techspecs)** for these components in order to establish such standards.

These components can be represented by Input Elements, Contract Events, and Analysis Elements which are further described on the [ACTUS website](https://www.actusfrf.org/methodology).

## [The ACTUS principal at maturity (PAM) contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.md)

Marlowe is well suited to implement contracts described by the ACTUS standard. An example is **[PAM](http://demo.actusfrf.org/form/PAM)**, or Principal at Maturity, where a principle payment is paid on some initial date, then repaid at some maturity date in the future with interest.

Using Marlowe Playground, the PAM contract can be represented in JSON or visually through Blockly. The tutorial provides an example of how to use tools within the Marlowe ecosystem to run the contract with two parties.

* See **[tutorial.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/doc/tutorial.ipynb)** to view this tutorial as a Jupyter notebook file. 

