---
title: Managing large contracts (Merkleization)
sidebar_position: 6
---

In many real world scenarios, the size of a Marlowe contract can pose challenges. For instance,
a contract may be too big to fit on a Cardano transaction. To handle this
situation, the Marlowe semantics and plutus validator both support a size optimization
called merkleization. Merkleization is a process that transforms a contract
from a tree structure into a merkle DAG (directed-acyclic graph) consisting of
multiple contract fragments that reference each other by hashes.

Merkle DAGs translate well to storage in UTxO-based blockchains like Cardano,
because these blockchains are themselves merkle DAGs. Transactions reference
outputs of previous transactions by their hashes.

A merkleized Marlowe contract gives just enough information to validate the
next transaction. When applying an input to a merkleized contract, the next
contract fragment must be provided alongside the input. As long as the
continuation's hash matches the hash contained in the existing fragment, we
know the continuation is genuine. The provided continuation can then be used to
compute the next contract that will be in effect after the input is applied.

## When to merkleize

Merkleization can be helpful in the following circumstances:

1. The contract is too large to fit on a transaction otherwise. This is the
   most common reason to use merkleization.
2. It can lower the Plutus execution costs and transaction fees. It is
   important to analyze the contract to make sure this is actually the case for
   the full lifetime of the contract.
3. It provides a degree of privacy, as future contract terms are obfuscated by
   hashes. Note that as a contract progresses, the intermediate terms will be
   made public so this privacy is very limited.

## Downsides of merkleization

There are some reasons why you may not want to merkleize a contract:

1. It introduces on-chain overhead. This overhead can lead to increased Plutus
   execution costs. An example is any contract that has `Close` as a case
   continuation. It does not make sense to merkleize this case, as the
   merkleized representation is larger on-chain than the unmerkleized contract.
2. It introduces off-chain book-keeping obligations. As the creator of a
   merkleized contract, it is your responsibility to manage the off-chain
   storage of the continuations and their distribution to contract parties. The
   runtime provides a tool for this via the contract store, but this is a local
   solution and distribution is still the responsibility of the contract creator.
3. It adds additional complexity.

In general, you should avoid merkleization if it is not necessary or does not
provide sufficient benefit to justify its usage.

## Merkleization in detail

The process of merkleizing a contract involves replacing sub-contracts with
hashes. Specifically, the `Case` language construct supports a merkleized and a
non-merkleized variant. A non-merkleized `Case` consists of an `Action`  and a
`Contract` that will be in effect should the associated `Action` be matched by
an `Input` supplied during a transaction.  A merkleized `Case` also consists of
an `Action`, but instead of a `Contract`, it only specifies the hash of the
`Contract` that will be in effect when the `Action` is matched.

### Merkleizing a contract

To merkleize a contract, one must replace all `Case` constructors with
`MerkleizedCase` constructors:

```hs
merkleizeCase :: Case Contract -> Case Contract
merkleizeCase (Case action continuation) = MerkleizedCase action (hashContract continuation)
merkleizeCase (MerkleizedCase action hash) = MerkleizedCase action hash
```

When this is done only to the first layer of `When` contracts encountered, we
say the contract has been shallowly merkleized. When the routine is applied
recursively from the bottom of the contract upward, we say the contract has
been deeply merkleized.

Once a contract is merkleized, it is the client's responsibility to remember
which contracts are associated with which hashes, because there is no way to
determine the original contract from a hash. The Marlowe Runtime provides tools
for managing merkleized contract continuations using a content-addressable
store.

### Merkleizing an input

To apply an input to a merkleized contract, it is necessary to supply the actual
contract for the hash in `Case` which the input matches. The `Input` language
construct has a non-merkleized and a merkleized variant. `NormalInput` is
non-merkleized and accepts an `InputContent`. `MerkleizedInput` accepts an
`InputContent`, the hash of the continuation contract, and the continuation
contract.

### Aside on hashing functions

Strictly speaking, this hash can be any sequence of bytes. The semantics do not
prescribe a specific hashing function to compute the hash from the contract.
They only require the hash in the `MerkleizedCase` to match the hash in the
`MerkleizedInput`. In order to be safe, the implementation must guarantee that
the same hashing function is used to produce the hash in the `MerkleizedCase` as
in the `MerkleizedInput`. The Cardano implementation uses the datum hash of the
contract for this purpose.

## Semantics

The rules for matching an `Input` with a `MerkleizedCase` are the same as
matching a regular `Case` with the following exceptions:

- The `Input` must be a `MerkleizedInput`
- The continuation hash contained in the `MerkleizedInput` must be equal to the
  continuation hash contained in the `MerkleizedCase`

Matching the `Input` with the `MerkleizedCase` causes the continuation contract
contained in the `Input` to come into effect as if the `MerkleizedCase` was a
regular `Case` which contained the same contract. The usual reduction rules
apply thereafter.

## On-chain requirements

The Marlowe validator does not use the `Input` type from the semantics module
in its redeemer type. Instead, it uses a `MarloweTxInput`, which does not
include the continuation contract in the merkleized case. Instead, the
merkleized case just contains the hash. This is to avoid having to hash the
continuation contract in the validator to check the integrity of the hash, which
is expensive. Instead, when building a transaction with a `MerkleizedInput` in
the redeemer, the continuation contract must be added as a script datum to an
additional transaction output on the transaction. This will cause the hash of
that datum to be verified by the ledger rules instead, saving Plutus execution
costs. The validator then looks up this additional datum from the script
context using the hash provided by the `MerkleizedInput`, and converts the
`MarloweTxInput` to an `Input`, which is passed to the semantic validator.
