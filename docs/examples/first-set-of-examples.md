---
title: Example Contracts
---

## ZERO-COUPON BOND

> * Which version should we use for our polished example? 

### 1. Test of a Zero-Coupon Bond 

> * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/zcb/ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/zcb/ReadMe.md)
> * Has one party borrow and another pay back with interest. It uses role tokens. 
> * Leads to a broken link for `ZeroCouponBond.hs` file

### 2. Test of an ACTUS Contract (Zero-Coupon Bond)

> * [https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli/examples/actus](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli/examples/actus)
> * Has one party borrow and another pay back with interest. It uses role tokens. 

### 3. A Zero-Coupon Bond

> * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-contracts/src/Marlowe/Contracts/ZeroCouponBond.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-contracts/src/Marlowe/Contracts/ZeroCouponBond.hs)

### 4. Test of a Zero-Coupon Bond -- Jupyter notebook -- Marlowe CLI, cookbook

> * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/zcb.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/zcb.ipynb) 
> * We introduce new variants of marlowe-cli run execute and marlowe-cli run withdraw that automatically handle the UTxOs management, coin selection, and balancing, so that one doesn't need to specify --tx-in and --tx-out for Marlowe transactions. These commands are experimental, and lightly tested so far. Last commit: Sept. 4, 2022

## SWAP

### 1. Test of a Swap Contract

> * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/swap/ReadMe.md](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/swap/ReadMe.md)
> > * Leads to this broken link: 
> > * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/src/Language/Marlowe/CLI/Examples/Swap.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/src/Language/Marlowe/CLI/Examples/Swap.hs)

### 2. Swap tokens between two parties

> * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-contracts/src/Marlowe/Contracts/Swap.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-contracts/src/Marlowe/Contracts/Swap.hs)

## ESCROW

---

Comment from Sam: 

The first step is address in the documentation is being able to run these contracts on a testnet. 

And in each of these examples, what features of Marlowe are expressed through that contract?

---

Comment from Brian: 

We should rewrite the examples from scratch to use Marlowe Runtime's REST API.

Additionally, we could present them in parallel alternative formats:

Marlowe Runtime's command-line interface, `marlowe`.

Marlowe CLI, `marlowe-cli`

Maybe there could be tabs or something that folks could click to see REST vs `marlowe` vs `marlowe-cli`. 

That's common in a lot of multi-language/tool developer websites.

---

Brian comment to Pablo: 

I guess I'm assuming that the REST API is the default entry point for new Marlowe users now. 

Will they be okay with examples using `curl`? or should we use the command-line `marlowe` as the entry point? 

(There will still be some folks who don't want to use Runtime because of its larger footprint, and they'd want `marlowe-cli`.) 

Pablo's response: If the target user is a dApp developer then probably. But yes, many things can only be done through `marlowe` and not the REST API. Maybe it would be a good goal to aim for `marlowe` to just be a client to the REST API eventually. 
