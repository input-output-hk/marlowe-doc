---
title: Example Contracts
---

## Purpose of this page is to identify which examples we will polish for first release

## ZERO-COUPON BOND

### Version 1. Test of an ACTUS Contract (Zero-Coupon Bond)

> * [https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli/examples/actus](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli/examples/actus)
> * Has one party borrow and another pay back with interest. It uses role tokens. 
> * This example is an extensive and detailed ReadMe.md file, but it doesn't give the impression that it is simple to use for a low-code user. 

### Version 2. Test of a Zero-Coupon Bond (appears to be very similar to version 3)

> * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/zcb/ReadMe.md]
> * Has one party borrow and another pay back with interest. It uses role tokens. 
> * Well-documented example. Doesn't come across as a low-code easily-accessible contract. 
> * Need to update the ReadMe.md file (Leads to a broken link for `ZeroCouponBond.hs` file)
> * Correct link: [`ZeroCouponBond.hs`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-contracts/src/Marlowe/Contracts/ZeroCouponBond.hs)

### Version 3. Test of a Zero-Coupon Bond -- Jupyter notebook -- Marlowe CLI, cookbook

> * [https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/zcb.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/zcb.ipynb) 
> * We introduce new variants of `marlowe-cli run execute` and `marlowe-cli run withdraw` that automatically handle the UTxOs management, coin selection, and balancing, so that one doesn't need to specify `--tx-in` and `--tx-out` for Marlowe transactions. These commands are experimental, and lightly tested so far. Last commit: Sept. 4, 2022

## SWAP

### Version 1. Test of a Swap Contract

> * [`marlowe-cli/examples/swap/ReadMe.md`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/swap/ReadMe.md)
> > * Leads to this broken link: 
> > * [`marlowe-cli/src/Language/Marlowe/CLI/Examples/Swap.hs`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/src/Language/Marlowe/CLI/Examples/Swap.hs)

### Version 2. Test of a Swap Contract

> * [`marlowe-cli/cookbook/swap.ipynb`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/swap.ipynb) 

### Version 3. Marlowe "Swap" Contract Run on Mainnet Using a Reference Script 

> * [marlowe-cli/cookbook/marlowe-1st-reference-script.ipynb](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/cookbook/marlowe-1st-reference-script.ipynb) 

### Version 4. Swap tokens between two parties

> * [`marlowe-contracts/src/Marlowe/Contracts/Swap.hs`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-contracts/src/Marlowe/Contracts/Swap.hs)

## ESCROW

* [Example Escrow Contract](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/ReadMe.md)

> * [Example Escrow Contract, Everything is alright](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/everything-is-alright.md)

> * [Example Escrow Contract, Confirm Problem](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/confirm-problem.md)

> * [Example Escrow Contract, Dismiss Claim](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/dismiss-claim.md)

> * [Example Escrow Contract, Confirm Claim](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/examples/escrow/confirm-claim.md)

> * [`module Marlowe.Contracts.Escrow | Escrow.hs`](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-contracts/src/Marlowe/Contracts/Escrow.hs)


---

## Running contracts on a testnet

## What features of Marlowe are expressed through each contract? 

---

Comment from Brian: 

* Rewrite the examples from scratch to use Marlowe Runtime's REST API.

* Present them in parallel alternative formats:

> * Marlowe Runtime's command-line interface, `marlowe`.

> * Marlowe CLI, `marlowe-cli`

Maybe there could be tabs or something that folks could click to see REST vs `marlowe` vs `marlowe-cli`. 

That's common in a lot of multi-language/tool developer websites.

---

Brian comment to Pablo: 

I guess I'm assuming that the REST API is the default entry point for new Marlowe users now. 

Will they be okay with examples using `curl`? Or should we use the command-line `marlowe` as the entry point? 

(There will still be some folks who don't want to use Runtime because of its larger footprint, and they'd want `marlowe-cli`.) 

Pablo's response: If the target user is a DApp developer then probably. But yes, many things can only be done through `marlowe` and not the REST API. Maybe it would be a good goal to aim for `marlowe` to just be a client to the REST API eventually. 
