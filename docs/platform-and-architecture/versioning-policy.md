---
title: Versioning policy
sidebar_position: 8
---

This document is intended to provide guidance for compatibility of tools within Marlowe with Cardano node. Developers can use this for tracking purposes and more formal support policies as the project matures.

## Support and release cadence

At the moment, Marlowe does not strictly adhere to [**Semantic Versioning**](https://semver.org/). Prior to a `v1` release, changes may be breaking and backporting future fixes is to be determined.

Releases are not operating at a regular cadence yet, although critical bug fixes will typically lead to faster releases.

## Release history

**Marlowe Runtime**

| Version | Date | 
| ------- | ---- |
| 0.0.5   | September 26, 2023 |
| 0.0.4   | August 11, 2023 |
| 0.0.3   | July 11, 2023 |
| 0.0.2   | June 15, 2023 |
| 0.0.1   | April 4, 2023 |

**Marlowe CLI**

| Version  | Date | 
| -------- | ---- |
| [0.1.0.0](https://github.com/input-output-hk/marlowe-cardano/tree/marlowe-cli%40v0.1.0.0)  | September 26, 2023 |
| [0.0.12.0](https://github.com/input-output-hk/marlowe-cardano/tree/marlowe-cli%40v0.0.12.0) | August 11, 2023 |
| [0.0.11.0](https://github.com/input-output-hk/marlowe-cardano/tree/marlowe-cli%40v0.0.11.0) | June 15, 2023 |


**Compatibility matrix**

|        | Cardano Node 1.35.7 | Cardano Node 8.0.8 | Cardano Node 8.1.1 | Cardano Node 8.1.2 |
| -------| ------------------| --------------| ------------| -----------|
| `marlowe-cli-0.1.0.0` | ✗ | ✗ | ✗ | ✓ |
| `marlowe-cli-0.0.12.0` | ✓ | ✓ | ✓ | ? |
| `marlowe-cli-0.0.11.0` | ✓ | ✓ | ✓ | ? |

:::note

The jump in Cardano node versions represent the version number matching the protocol version of Cardano.

`✗` - Incompatible

`✓` - Compatible

`?` - Untested

:::
