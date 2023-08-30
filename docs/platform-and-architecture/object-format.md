---
title: Marlowe object bundle format
sidebar_position: 6
---

One limitation of the Marlowe language is its lack of named abstraction (with
the exception of the `Let` contract and `UseValue` value). This can lead to a
lot of duplication of things such as continuations, actions, and so on, because
all definitions must be fully inlined at the usage site.

The Marlowe object bundle format addresses this limitation by representing a
contract as a list of labeled objects which may reference other objects by
label. A related concept is [merkleization](large-contracts.md) which allows
contract terms to be defined incrementally and deterministically as the contract
progresses. The object bundle format is more general than merkleization, and is
generally aimed at reducing the size of contracts off-chain (whereas the goal
of merkleization is to reduce the size of contracts on-chain).

## Objects, labels and references

An object bundle is a list of labeled objects. A label is an arbitrary name
used as a unique identifier for an object within a bundle. An object is either
an action, contract, observation, token, value, or party. Objects can reference
other objects by label.

### Objects

An object can be an action, a contract, an observation, a token, a value, or a
party. Each of these is structurally the same as their corresponding core Marlowe
language construct, with the exception that the object versions allow for
references. For example, in core Marlowe, a party can either be a role or an
address. In object Marlowe, a party can be a role, and address, or a label that
references a previously defined party.

### Labels

A label is a unique identifier for an object in a bundle. Labels are required
to be unique in a bundle. A label is arbitrary text data.

### References

A reference is a use of a label to reference a previously defined object of the
correct type. Note that there is no type safety when constructing a reference -
it is the responsibility of the application to ensure the label has been
previously defined and that it references an object of the correct type. This
will be enforced during linking.

## Ordering

In order to avoid circular dependencies, and to allow for more efficient
ingestion of an object bundle, objects in a bundle are required to be sorted in
a define-before-use order. This means that for an object "bar" to reference
another object with a label "foo", "foo" must be defined before "bar". A result
of this is that the main contract is always the last contract defined in a bundle,
and any non-contract object defined after the main contract is dead code and
serves no functional purpose.

## Linking

Linking is the process of converting an object bundle into a set of core
Marlowe language constructs. The primary purpose of this is to produce a core
Marlowe contract from a bundle. The general linking algorithm is:

- Allocate an empty linked object buffer
- For each labeled object in the bundle:
    - If the label is present in the linked object buffer, halt with a `DuplicateLabel` error.
    - Resolve any references in the object.
        - If a reference is not present in the linked object buffer, halt with an `UnknownSymbol` error.
        - If the referenced object is of the wrong type, halt with a `TypeMismatch` error.
        - Replace the reference with the referenced object.
    - Add the linked object to the linked object buffer.
- Yield the linked object buffer.

## Archive format

An extension of the bundle format is the bundle archive format. A bundle
archive is a zip archive with the following entries:

- 1 entry per object in the bundle. The entry name is the label of the object
  and the entry contents are the JSON encoding of the object.
- 1 entry with the name `manifest.json`. This entry contains a JSON object with
  two keys: `mainIs` and `objects`. `mainIs` is the label of the top-level
  contract in the bundle. `objects` is an array of labels that defines their
  order in the bundle.
