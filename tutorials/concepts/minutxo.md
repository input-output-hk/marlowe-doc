---
title: Understanding minUTXO
---

The term **minUTXO** stands for minimum Unspent Transaction Output. This minimum exists because it prevents the chain from growing indefinitely in size. Additionally, minUTXO prevents users from spamming transactions.

Some [calculations](https://github.com/input-output-hk/cardano-ledger/blob/master/doc/explanations/min-utxo-alonzo.rst) are involved to determine what this minimum is. However, in the context of Marlowe, minUTXO is set in smart contracts at the time of creation. Most contracts set this amount somewhere between two to three ada.

One example in practice is the `--min-utxo` flag used in contract creation for `marlowe-runtime-cli`. A [sample application](https://github.com/input-output-hk/marlowe-cardano/blob/587333d67887998c8f15566fdcfeac713acbbf32/marlowe-apps/create-example-contract.sh#L51) demonstrates how this takes in a minimum amount of lovelace to store in the contract, otherwise, the command fails.

minUTXO is enforced similarly on other ways of interacting with Runtime. Using the REST API, the [request body](https://docs.marlowe.iohk.io/api/create-a-new-contract) requires a `minUTxODeposit`. This will be the case with the [TypeScript SDK](https://github.com/input-output-hk/marlowe-ts-sdk) or any other similar client libraries built on Marlowe.

For native tokens, minUTXO implies that some non-zero amount of ada must be sent along with the native tokens.

## Additional reading

 - [Minimum ada value requirement](https://cardano-ledger.readthedocs.io/en/latest/explanations/min-utxo-mary.html)
 - [Minimum ada value with native tokens](https://docs.cardano.org/native-tokens/minimum-ada-value-requirement/)

