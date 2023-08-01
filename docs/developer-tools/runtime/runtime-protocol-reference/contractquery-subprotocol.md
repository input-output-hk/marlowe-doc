---
title: ContractQuery sub-protocol
sidebar_position: 7
---

The ContractQuery sub-protocol is defined here: 

- **[https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/contract-api/Language/Marlowe/Runtime/Contract/Api.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-runtime/contract-api/Language/Marlowe/Runtime/Contract/Api.hs)**

The `ContractRequest` type is a set of requests for use with the
**[generic query protocol](query-protocol.md)** that allows clients to query the contract store.

### Request types

The following requests are supported:

| Request | Parameter | Description |
| --- | --- | --- |
| `GetContract hash` |  | Returns information about the contract with the given hash, including the contract and its deep and shallow dependencies. |
|  | `hash` | The hash of the contract to inspect. |
| `MerkleizeInputs hash state input` |  | Returns a version of `input` suitable for application to the merkleized contract with the given `hash`. |
|  | `hash` | The hash of the contract to which to apply the input. |
|  | `state` | The state of the contract against which to evaluate the input. |
|  | `input` | A marlowe transaction input consisting of a validity interval and a sequence of input actions. |
