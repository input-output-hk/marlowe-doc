---
title: "Escrow Using Marlowe Runtime's REST API"
sidebar_position: 5
---

***Before running this notebook, you might want to use Jupyter's "clear output" function to erase the results of the previous execution of this notebook. That will make more apparent what has been executed in the current session.***

The escrow contract example is a simple Marlowe contract where a seller offers merchandise for sale and a buyer purchases it; if the buyer is not satisfied with the merchandise, they may dispute the purchase, in which case a mediator may rule for the buyer or seller.

[A video works through this Jupyter notebook.](https://youtu.be/E8m-PKbS9TI)

You can ask questions about Marlowe in [the #ask-marlowe channel on the IOG Discord](https://discord.com/channels/826816523368005654/936295815926927390) or post problems with this lesson to [the issues list for the Marlowe Starter Kit github repository](https://github.com/input-output-hk/marlowe-starter-kit/issues).

In this demonstration we use Marlowe Runtime\'s REST API, served via `marlowe-web-server`, to run this contract on Cardano\'s `preprod` public testnet. Marlowe contracts may use either addresses or role tokens for authorization: here we use role tokens and we have Marlowe Runtime mint them.

In [Marlowe Playground](https://play.marlowe-finance.io/), the contract looks like this in Blockly format.

![Marlowe contract for escrow](/img/escrow-playground.png)

In Marlowe format it appears as
```
When [
  (Case
     (Deposit Role "Seller" Role "Buyer"
        (Token "" "")
        (ConstantParam "Price"))
     (When [
           (Case
              (Choice
                 (ChoiceId "Everything is alright" Role "Buyer") [
                 (Bound 0 0)]) Close)
           ,
           (Case
              (Choice
                 (ChoiceId "Report problem" Role "Buyer") [
                 (Bound 1 1)])
              (Pay Role "Seller"
                 (Account Role "Buyer")
                 (Token "" "")
                 (ConstantParam "Price")
                 (When [
                       (Case
                          (Choice
                             (ChoiceId "Confirm problem" Role "Seller") [
                             (Bound 1 1)]) Close)
                       ,
                       (Case
                          (Choice
                             (ChoiceId "Dispute problem" Role "Seller") [
                             (Bound 0 0)])
                          (When [
                                (Case
                                   (Choice
                                      (ChoiceId "Dismiss claim" Role "Mediator") [
                                      (Bound 0 0)])
                                   (Pay Role "Buyer"
                                      (Party Role "Seller")
                                      (Token "" "")
                                      (ConstantParam "Price") Close))
                                ,
                                (Case
                                   (Choice
                                      (ChoiceId "Confirm problem" Role "Mediator") [
                                      (Bound 1 1)]) Close)]
                                      (TimeParam "Mediation deadline") Close))] 
                                      (TimeParam "Complaint response deadline") Close)))] 
                                      (TimeParam "Complaint deadline") Close))] 
                                      (TimeParam "Payment deadline") Close
```

The flow chart below shows the possible execution paths of the escrow contract. This example demonstrates the shaded path.

![Flow chart for escrow contract, with the "dismiss claim" execution path highlighted](/img/04-dismiss-claim.svg)

## Preliminaries

See [Preliminaries](preliminaries.md) for information on setting up one's environment for using this tutorial.

The lesson assumes that the following environment variables have been set.
- `CARDANO_NODE_SOCKET_PATH`: location of Cardano node's socket.
- `CARDANO_TESTNET_MAGIC`: testnet magic number.
- `MARLOWE_RT_WEBSERVER_HOST`: IP address of the Marlowe Runtime web server.
- `MARLOWE_RT_WEBSERVER_PORT`: Port number for the Marlowe Runtime web server.

It also assumes that the parties have addresses, signing keys, and funds.
- Seller
    - [keys/lender.address](keys/lender.address): Cardano address for the seller
    - [keys/lender.skey](keys/lender.skey): location of signing key file for the seller
- Buyer
    - [keys/borrower.address](keys/borrower.address): Cardano address for the buyer
    - [keys/borrower.skey](keys/borrower.skey): location of signing key file for the buyer
- Mediator
    - [keys/mediator.address](keys/mediator.address): Cardano address for the mediator
    - [keys/mediator.skey](keys/mediator.skey): location of signing key file for the mediator

### Access to Cardano node and Marlowe Runtime

If we're using [demeter.run](https://demeter.run/)'s Cardano Marlowe Runtime extension, then we already have access to Cardano Node and Marlowe Runtime. The following commands will set the required environment variables to use a local docker deployment on the default ports. It will also set some supplementary environment variables.


```bash
if [[ -z "$MARLOWE_RT_WEBSERVER_PORT" ]]
then

  # Only required for `marlowe-cli` and `cardano-cli`.
  export CARDANO_NODE_SOCKET_PATH="$(docker volume inspect marlowe-starter-kit_shared | jq -r '.[0].Mountpoint')/node.socket"
  export CARDANO_TESTNET_MAGIC=1 # Note that preprod=1 and preview=2. Do not set this variable if using mainnet.

  # Only required for Marlowe Runtime REST API.
  export MARLOWE_RT_WEBSERVER_HOST="127.0.0.1"
  export MARLOWE_RT_WEBSERVER_PORT=3780

fi

# FIXME: This should have been inherited from the parent environment.
if [[ -z "$CARDANO_NODE_SOCKET_PATH" ]]
then
  export CARDANO_NODE_SOCKET_PATH=/ipc/node.socket
fi

# FIXME: This should have been set in the parent environment.
if [[ -z "$CARDANO_TESTNET_MAGIC" ]]
then
  export CARDANO_TESTNET_MAGIC=$CARDANO_NODE_MAGIC
fi

case "$CARDANO_TESTNET_MAGIC" in
  1)
    export "EXPLORER_URL=https://preprod.cardanoscan.io"
    ;;
  2)
    export "EXPLORER_URL=https://preview.cardanoscan.io"
    ;;
  *)
    # Use `mainnet` as the default.
    export "EXPLORER_URL=https://cardanoscan.io"
    ;;
esac

MARLOWE_RT_WEBSERVER_URL="http://$MARLOWE_RT_WEBSERVER_HOST":"$MARLOWE_RT_WEBSERVER_PORT"

echo "CARDANO_NODE_SOCKET_PATH = $CARDANO_NODE_SOCKET_PATH"
echo "CARDANO_TESTNET_MAGIC = $CARDANO_TESTNET_MAGIC"
echo "MARLOWE_RT_WEBSERVER_HOST = $MARLOWE_RT_WEBSERVER_HOST"
echo "MARLOWE_RT_WEBSERVER_PORT = $MARLOWE_RT_WEBSERVER_PORT"
echo "MARLOWE_RT_WEBSERVER_URL = $MARLOWE_RT_WEBSERVER_URL"
```

    CARDANO_NODE_SOCKET_PATH = ~/.local/share/containers/storage/volumes/marlowe-starter-kit_shared/_data/node.socket
    CARDANO_TESTNET_MAGIC = 1
    MARLOWE_RT_WEBSERVER_HOST = 127.0.0.1
    MARLOWE_RT_WEBSERVER_PORT = 3780
    MARLOWE_RT_WEBSERVER_URL = http://127.0.0.1:3780


Note the test network magic number:
- `preprod` = 1
- `preview` = 2

### Seller address and funds

Check that an address and key has been created for the seller. If not, see "Creating Addresses and Signing Keys" in [Preliminaries](preliminaries.md).


```bash
SELLER_SKEY=keys/lender.skey
SELLER_ADDR=$(cat keys/lender.address)
echo "SELLER_ADDR = $SELLER_ADDR"
```

    SELLER_ADDR = addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck


Check that the seller has at least one hundred ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$SELLER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    f2d8203e5e72830c22f7cc6ea9faeeda1ccc07bb6be203ec36dc6d99723bcfa4     1        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$SELLER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck


### Buyer address and funds

Check that an address and key has been created for the buyer. If not, see "Creating Addresses and Signing Keys" in [Preliminaries](preliminaries.md).


```bash
BUYER_SKEY=keys/borrower.skey
BUYER_ADDR=$(cat keys/borrower.address)
echo "BUYER_ADDR = $BUYER_ADDR"
```

    BUYER_ADDR = addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d


Check that the buyer has at least one hundred ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BUYER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    f2d8203e5e72830c22f7cc6ea9faeeda1ccc07bb6be203ec36dc6d99723bcfa4     2        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$BUYER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d


### Mediator address and funds

Check that an address and key has been created for the mediator. If not, see "Creating Addresses and Signing Keys" in [Preliminaries](preliminaries.md).


```bash
MEDIATOR_SKEY=keys/mediator.skey
MEDIATOR_ADDR=$(cat keys/mediator.address)
echo "MEDIATOR_ADDR = $MEDIATOR_ADDR"
```

    MEDIATOR_ADDR = addr_test1vr6tytqs3x8qgewhw89m3xrz58t3tqu2hfsecw0u06lf3hg052wsv


Check that the mediator has at least one hundred ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$MEDIATOR_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    8461a35e612b38d4cb592e4ba1b7f13c2ff2825942d66e7200acc575cd4c8f1c     3        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$MEDIATOR_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vr6tytqs3x8qgewhw89m3xrz58t3tqu2hfsecw0u06lf3hg052wsv


## Design the contract

The escrow contract can be downloaded from the [Marlowe Playground](https://play.marlowe-finance.io/) as a JSON file, or it can be generated using [Marlowe CLI](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli#readme) using the `marlowe-cli template` command.

Set the purchase prices to 75 ada.


```bash
ADA=1000000  # 1 ada = 1,000,000 lovelace
PRICE=$((75 * ADA))
echo "PRICE = $PRICE lovelace"
```

    PRICE = 75000000 lovelace


On the Cardano blockchain, the protocol parameters require that each UTxO contain at least some ada. Here we will start the contract with 2 ada.


```bash
MIN_LOVELACE="$((2 * ADA))"
echo "MIN_LOVELACE = $MIN_LOVELACE lovelace"
```

    MIN_LOVELACE = 2000000 lovelace


Later in the example we will need some constants for converting times.


```bash
SECOND=1000 # 1 second = 1000 milliseconds
MINUTE=$((60 * SECOND)) # 1 minute = 60 seconds
HOUR=$((60 * MINUTE)) # 1 hour = 60 minutes
```

### *Alternative 1:* Use Marlowe Playground to design the contract

If you want to create the contract in Marlowe Playground, do the following:

1. Visit https://play.marlowe-finance.io/ in a web browser.
2. Select "Open an Example".
3. Select "Marlowe" or "Blockly" under "Escrow".
4. Select "Send to Simulator".
5. Set the "Payment deadline" to one hour into the future.
6. Set the "Complaint deadline" to two hours into the future
7. Set the "Complaint response deadline" to three hours into the future.
8. Set the "Mediation deadline" to four hours into the future.
9. Set the "Price" to 75 ada.
10. Select "Download as JSON", set the file name to "escrow-contract.json", and store the file in this folder, namely [marlowe-starter-kit/](.). Note that most interfaces for Jupyter notebooks allow one to drag and drop a file into their explorer panel.

***Be careful setting the deadlines because, if these mistakenly are in the past or in the too-near future, then parts of the contract will time out and not operate as described in this tutorial.***

![Setting parameters for the escrow bond contract in Marlowe Playground](/img/escrow-simulation.png)

### *Alternative 2:* Use Marlowe CLI to generate the contract

Below we generate the contract using Marlowe CLI.

First find the current time, measured in [POSIX milliseconds](https://en.wikipedia.org/wiki/Unix_time).


```bash
NOW="$((`date -u +%s` * SECOND))"
echo NOW = "$NOW" POSIX milliseconds = "`date -d @$((NOW / SECOND))`"
```

    NOW = 1679662369000 POSIX milliseconds = Fri Mar 24 06:52:49 AM MDT 2023


The contract has four deadlines. For convenience in this example, set the deadlines to the near future.


```bash
PAYMENT_DEADLINE=$((NOW+1*HOUR))    # The payment deadline, one hour from now.
COMPLAINT_DEADLINE=$((NOW+2*HOUR))  # The complaint deadline, two hours from now.
DISPUTE_DEADLINE=$((NOW+3*HOUR))    # The dispute deadline, three hours from now.
MEDIATION_DEADLINE=$((NOW+4*HOUR))  # The mediation deadline, four hours from now.

echo PAYMENT_DEADLINE = "$PAYMENT_DEADLINE" POSIX milliseconds = "`date -d @$((PAYMENT_DEADLINE / SECOND))`"
echo COMPLAINT_DEADLINE = "$COMPLAINT_DEADLINE" POSIX milliseconds = "`date -d @$((COMPLAINT_DEADLINE / SECOND))`"
echo DISPUTE_DEADLINE = "$DISPUTE_DEADLINE" POSIX milliseconds = "`date -d @$((DISPUTE_DEADLINE / SECOND))`"
echo MEDIATION_DEADLINE = "$MEDIATION_DEADLINE" POSIX milliseconds = "`date -d @$((MEDIATION_DEADLINE / SECOND))`"
```

    PAYMENT_DEADLINE = 1679665969000 POSIX milliseconds = Fri Mar 24 07:52:49 AM MDT 2023
    COMPLAINT_DEADLINE = 1679669569000 POSIX milliseconds = Fri Mar 24 08:52:49 AM MDT 2023
    DISPUTE_DEADLINE = 1679673169000 POSIX milliseconds = Fri Mar 24 09:52:49 AM MDT 2023
    MEDIATION_DEADLINE = 1679676769000 POSIX milliseconds = Fri Mar 24 10:52:49 AM MDT 2023


Now create the JSON file for the contract, `zcb-contract.json`.


```bash
marlowe-cli template escrow \
  --minimum-ada "$MIN_LOVELACE" \
  --price "$PRICE" \
  --seller Seller \
  --buyer Buyer \
  --mediator Mediator \
  --payment-deadline "$PAYMENT_DEADLINE" \
  --complaint-deadline "$COMPLAINT_DEADLINE" \
  --dispute-deadline "$DISPUTE_DEADLINE" \
  --mediation-deadline "$MEDIATION_DEADLINE" \
  --out-contract-file escrow-contract.json \
  --out-state-file /dev/null
```

The various command-line options are described by the help system.


```bash
marlowe-cli template escrow --help
```

    Usage: marlowe-cli template escrow --minimum-ada INTEGER --price INTEGER
                                       --seller PARTY --buyer PARTY --mediator PARTY
                                       --payment-deadline TIMEOUT
                                       --complaint-deadline TIMEOUT
                                       --dispute-deadline TIMEOUT
                                       --mediation-deadline TIMEOUT
    
      Create an escrow contract.
    
    Available options:
      --minimum-ada INTEGER    Lovelace in the initial state.
      --price INTEGER          The price of the sale, in lovelace.
      --seller PARTY           The seller.
      --buyer PARTY            The buyer.
      --mediator PARTY         The mediator.
      --payment-deadline TIMEOUT
                               The deadline for the buyer to pay. POSIX milliseconds
                               or duration: `INTEGER[s|m|d|w|h]`.
      --complaint-deadline TIMEOUT
                               The deadline for the buyer to complain. POSIX
                               milliseconds or duration: `INTEGER[s|m|d|w|h]`.
      --dispute-deadline TIMEOUT
                               The deadline for the seller to dispute a complaint.
                               POSIX milliseconds or duration: `INTEGER[s|m|d|w|h]`.
      --mediation-deadline TIMEOUT
                               The deadline for the mediator to decide. POSIX
                               milliseconds or duration: `INTEGER[s|m|d|w|h]`.
      -h,--help                Show this help text


## Examine the contract

View the contract file as YAML.


```bash
json2yaml escrow-contract.json
```

    timeout: 1679665969000
    timeout_continuation: close
    when:
    - case:
        deposits: 75000000
        into_account:
          role_token: Seller
        of_token:
          currency_symbol: ''
          token_name: ''
        party:
          role_token: Buyer
      then:
        timeout: 1679669569000
        timeout_continuation: close
        when:
        - case:
            choose_between:
            - from: 0
              to: 0
            for_choice:
              choice_name: Everything is alright
              choice_owner:
                role_token: Buyer
          then: close
        - case:
            choose_between:
            - from: 1
              to: 1
            for_choice:
              choice_name: Report problem
              choice_owner:
                role_token: Buyer
          then:
            from_account:
              role_token: Seller
            pay: 75000000
            then:
              timeout: 1679673169000
              timeout_continuation: close
              when:
              - case:
                  choose_between:
                  - from: 1
                    to: 1
                  for_choice:
                    choice_name: Confirm problem
                    choice_owner:
                      role_token: Seller
                then: close
              - case:
                  choose_between:
                  - from: 0
                    to: 0
                  for_choice:
                    choice_name: Dispute problem
                    choice_owner:
                      role_token: Seller
                then:
                  timeout: 1679676769000
                  timeout_continuation: close
                  when:
                  - case:
                      choose_between:
                      - from: 0
                        to: 0
                      for_choice:
                        choice_name: Dismiss claim
                        choice_owner:
                          role_token: Mediator
                    then:
                      from_account:
                        role_token: Buyer
                      pay: 75000000
                      then: close
                      to:
                        account:
                          role_token: Seller
                      token:
                        currency_symbol: ''
                        token_name: ''
                  - case:
                      choose_between:
                      - from: 1
                        to: 1
                      for_choice:
                        choice_name: Confirm claim
                        choice_owner:
                          role_token: Mediator
                    then: close
            to:
              account:
                role_token: Buyer
            token:
              currency_symbol: ''
              token_name: ''


### \[Optional, but recommended\] Check the safety of the contract

If we were running the contract on the Cardano `mainnet`, then we\'d want to check its safety before creating it, so that there is no chance that we might lose funds.

Here are the steps for checking the safety of a contract:

1. Understand the [Marlowe Language](https://marlowe-finance.io/).
2. Understand Cardano\'s [Extended UTxO Model](https://docs.cardano.org/learn/eutxo-explainer).
3. Read and understand the [Marlowe Best Practices Guide](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/best-practices.md).
4. Read and understand the [Marlowe Security Guide](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/security.md).
5. Use [Marlowe Playground](https://play.marlowe-finance.io/) to flag warnings, perform static analysis, and simulate the contract.
6. Use [Marlowe CLI\'s](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe-cli/ReadMe.md) `marlowe-cli run analyze` tool to study whether the contract can run on a Cardano network.
7. Run *all execution paths* of the contract on a [Cardano testnet](https://docs.cardano.org/cardano-testnet/overview).

See [Lesson 1](01-runtime-cli.ipynb) for an example of performing step 6.

## Transaction 1: Mediator Creates Escrow Contract with Initial ADA

A `HTTP` `POST` request to Marlowe Runtime\'s `/contracts` endpoint will build the creation transaction for a Marlowe contract. We provide it the JSON file containing the contract and tell it the `MIN_LOVELACE` value that we previously chose. Anyone could create the contract, but in this example the lender will be doing so, so we provide their address to fund the transaction and to receive the change from it.

First we create the JSON body of the request to build the creation transaction.


```bash
yaml2json << EOI > request-1.json
version: v1
contract: `cat escrow-contract.json`
roles:
  Seller: "$SELLER_ADDR"
  Buyer: "$BUYER_ADDR"
  Mediator: "$MEDIATOR_ADDR"
minUTxODeposit: $MIN_LOVELACE
metadata: {}
tags: {}
EOI
cat request-1.json
```

    {"contract":{"timeout":1679665969000,"timeout_continuation":"close","when":[{"case":{"deposits":75000000,"into_account":{"role_token":"Seller"},"of_token":{"currency_symbol":"","token_name":""},"party":{"role_token":"Buyer"}},"then":{"timeout":1679669569000,"timeout_continuation":"close","when":[{"case":{"choose_between":[{"from":0,"to":0}],"for_choice":{"choice_name":"Everything is alright","choice_owner":{"role_token":"Buyer"}}},"then":"close"},{"case":{"choose_between":[{"from":1,"to":1}],"for_choice":{"choice_name":"Report problem","choice_owner":{"role_token":"Buyer"}}},"then":{"from_account":{"role_token":"Seller"},"pay":75000000,"then":{"timeout":1679673169000,"timeout_continuation":"close","when":[{"case":{"choose_between":[{"from":1,"to":1}],"for_choice":{"choice_name":"Confirm problem","choice_owner":{"role_token":"Seller"}}},"then":"close"},{"case":{"choose_between":[{"from":0,"to":0}],"for_choice":{"choice_name":"Dispute problem","choice_owner":{"role_token":"Seller"}}},"then":{"timeout":1679676769000,"timeout_continuation":"close","when":[{"case":{"choose_between":[{"from":0,"to":0}],"for_choice":{"choice_name":"Dismiss claim","choice_owner":{"role_token":"Mediator"}}},"then":{"from_account":{"role_token":"Buyer"},"pay":75000000,"then":"close","to":{"account":{"role_token":"Seller"}},"token":{"currency_symbol":"","token_name":""}}},{"case":{"choose_between":[{"from":1,"to":1}],"for_choice":{"choice_name":"Confirm claim","choice_owner":{"role_token":"Mediator"}}},"then":"close"}]}}]},"to":{"account":{"role_token":"Buyer"}},"token":{"currency_symbol":"","token_name":""}}}]}}]},"metadata":{},"minUTxODeposit":2000000,"roles":{"Buyer":"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d","Mediator":"addr_test1vr6tytqs3x8qgewhw89m3xrz58t3tqu2hfsecw0u06lf3hg052wsv","Seller":"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck"},"tags":{},"version":"v1"}


Next we post the request and view the response.


```bash
curl "$MARLOWE_RT_WEBSERVER_URL/contracts" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $MEDIATOR_ADDR" \
  -d @request-1.json \
  -o response-1.json \
  -sS
json2yaml response-1.json
```

    links:
      contract: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231
    resource:
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      txBody:
        cborHex: 86a800818258208461a35e612b38d4cb592e4ba1b7f13c2ff2825942d66e7200acc575cd4c8f1c030d818258208461a35e612b38d4cb592e4ba1b7f13c2ff2825942d66e7200acc575cd4c8f1c030185a200581d60f4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98dd011a3b45a132a300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a001e848002820058207a78ba1d13c0847bcef31e793ee62395809b133e77744c4c03bb1905a0ede9bba200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a000fb7caa1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a145427579657201a200581d60f4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98dd01821a000fea4ca1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a1484d65646961746f7201a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a000fc8a0a1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a14653656c6c65720110a200581d60f4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98dd011a3b8ff39c111a000ad664021a0007399809a1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a345427579657201484d65646961746f72014653656c6c6572010b5820d405fdfb92cbbb9130761c722892b19b278b85000cb1e4ec2269ace25c4f1f2a9f8202590ddd590dda01000033323233223232323232332232323232323232323322323232323232323233322232323232323232322223223232325335001102813263202d33573892010350543500028323232533500313300b49010b4275726e206661696c656400323235004223335530101200132335012223335003220020020013500122001123300101b02e2350012222533530080032103210323500222222222222200a3200135503322533500115021221350022253353301700200713502600113006003300f0021335502c300b49010b4d696e74206661696c656400330163232323500322222222222233355301b120013233501d2233350032200200200135001220011233001225335002103b100103825335333573466e3c03cd400488d4008880080e40e04ccd5cd19b8700e35001223500222001039038103800c3500b220013500a22002500133010335502c33555017237246ecccdd2a400066ae80dd398170009bb102f3355501725335333355300d1200133500e22230033002001200122533500121350032235003223500222350295335333573466e3c0080180cc0c84cd540eccd540ec008cdc0000802801899aa81d80499a81c80200189a81119aa81a001281999919191919191919118011803800990009aa81d11299a800898011801a81d110a99a800880111098031803802990009aa81c91299a8008a81c910a99a800880191099a81e198038020011803000990009aa81c111299a8010800910a99a8018802110a999a99806002001099a81e00219803801802899a81e00119803803000899a81e002198038018029a8019110009a8011110011a80091100199918008009119091a990919980091a801911180180211a801911180100211a8019111800802091a98018021a8020008009801001091111998021299a80089a80a89119801281c800910a99a80089a80b89119801002800910a999a998050020010999803001119a81d80280080089998038011a80c891198010030008008999803001119a81d802800800911299a800899a81c19a81c0018011803281c910a999a99805002801099a81d19a81d0028021804001899980380119a81d002802000899a81d19a81d002802180400191119299a80109800a4c442a666a6601600c004266600e0044600c66a07800e002002260069309998038011180319a81e003800800919a81c98019a80c0911980100300098038011919111a801111a80191912999a999a80d8048028018999a80d8040020008a8010a8010999a80c80380180099999999a80a11199ab9a3370e00400205a05844a66a666ae68cdc3801000816816080c8a99a999ab9a3371200400205a058202e203044666ae68cdc400100081681611199ab9a3371200400205a05844666ae68cdc480100081601691199ab9a3371000400205805a44a66a666ae68cdc48010008168160800880111299a999ab9a3371200400205a0582004200266666666a02602244a66a666ae68cdc7801000816015880c0a99a999ab9a33722004002058056202c202e44666ae68cdc800100081601591199ab9a3372200400205805644666ae68cdc880100081581611199ab9a3372000400205605844a66a666ae68cdc88010008160158800880111299a999ab9a3372200400205805620042002002a03e426a0024466a0660040022a062400266aa05866aaa02e644a66a002420022004a06066aaa02e646446004002640026aa06644a66a0022a0424426a00444a66a6602e00400e26a04c0022600c006601e00466aaa02e400246a002444444444444010a00201426a002440046666ae68cdc39aab9d5003480008cc8848cc00400c008c8c8c8c8c8c8c8c8c8c8c8c8c8cccd5cd19b8735573aa018900011999999999999111111111110919999999999980080680600580500480400380300280200180119a8128131aba1500c33502502635742a01666a04a04e6ae854028ccd540a5d728141aba150093335502975ca0506ae854020cd40940c0d5d0a803999aa814818bad35742a00c6464646666ae68cdc39aab9d5002480008cc8848cc00400c008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a81dbad35742a00460786ae84d5d1280111931902219ab9c04003f042135573ca00226ea8004d5d0a8011919191999ab9a3370e6aae754009200023322123300100300233503b75a6ae854008c0f0d5d09aba2500223263204433573808007e08426aae7940044dd50009aba135744a004464c6408066ae700f00ec0f84d55cf280089baa00135742a00a66a04aeb8d5d0a802199aa81481690009aba150033335502975c40026ae854008c0bcd5d09aba2500223263203c33573807006e07426ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae85400cc07cd5d09aba2500323263202e3357380540520586666ae68cdc3a80224004424400446666ae68cdc3a802a40004244002464c6405c66ae700a80a40b00ac4d55cf280089baa001135573a6ea8004894cd400440804cd5ce00100f990009aa8131108911299a80089a80191000910999a802910011802001199aa98038900080280200089109198008018010919a800a811281191a800911999a80091931901219ab9c4901024c680001f20012326320243357389201024c680001f2326320243357389201024c680001f22333573466e3c00800406c06848d40048888888801c48888888848cccccccc00402402001c01801401000c008488800c48880084888004894cd400840044050444888c00cc00800448c88c008dd6000990009aa80d911999aab9f0012501c233501b30043574200460066ae880080548c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8068cd5ce00b00a80c09aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500d014357426ae8940088c98c807ccd5ce00d80d00e89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6404266ae7007407007c0780744d55cea80089baa00135742a00466a012eb8d5d09aba2500223263201b33573802e02c03226ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355018223233335573e0044a034466a03266aa036600c6aae754008c014d55cf280118021aba200301313574200224464646666ae68cdc3a800a400046a00e600a6ae84d55cf280191999ab9a3370ea00490011280391931900c19ab9c014013016015135573aa00226ea800448488c00800c44880048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900b19ab9c012011014013012011135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900919ab9c00e00d010135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8040cd5ce00600580709baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c8064cd5ce00a80a00b80b00a80a00980900889aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6402466ae7003803404003c4d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200f33573801601401a01826aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6402066ae7003002c0380340304d55cea80089baa0012323333573466e1d40052002200523333573466e1d40092000200523263200c33573801000e01401226aae74dd500089100109100089000a481035054310011223002001320013550052253350011376200644266ae80d400888cdd2a400066ae80dd480119aba037500026ec401cc010005261122002122122330010040031122123300100300211232300100122330033002002001489207381bb21e6e7729681dfb5620376b3b4be92c5b83fce8ccb647dc75b624a17e50033512233002489208461a35e612b38d4cb592e4ba1b7f13c2ff2825942d66e7200acc575cd4c8f1c00480188848cc00400c0088005ff81d8799fd8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072ffd8799fa1d8799fd8799fd87980d8799fd8799f581cf4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98ddffd87a80ffffd8799f4040ffff1a001e8480a0a000ffd87c9f9fd8799fd8799fd87a9f4653656c6c6572ffd87a9f454275796572ffd8799f4040ffd87a9f1a047868c0ffffd87c9f9fd8799fd87a9fd8799f5545766572797468696e6720697320616c7269676874d87a9f454275796572ffff9fd8799f0000ffffffd87980ffd8799fd87a9fd8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff9fd8799f0101ffffffd87a9fd87a9f4653656c6c6572ffd8799fd87a9f454275796572ffffd8799f4040ffd87a9f1a047868c0ffd87c9f9fd8799fd87a9fd8799f4f436f6e6669726d2070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0101ffffffd87980ffd8799fd87a9fd8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0000ffffffd87c9f9fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff9fd8799f0000ffffffd87a9fd87a9f454275796572ffd8799fd87a9f4653656c6c6572ffffd8799f4040ffd87a9f1a047868c0ffd87980ffffd8799fd87a9fd8799f4d436f6e6669726d20636c61696dd87a9f484d65646961746f72ffff9fd8799f0101ffffffd87980ffff1b00000187148982e8d87980ffffff1b0000018714529468d87980ffffffff1b00000187141ba5e8d87980ffffff1b0000018713e4b768d87980ffff81840100d87980821a001275ca1a16b619d7f5f6
        description: ''
        type: TxBodyBabbage


The identifier for the contract is embedded in the response.


```bash
CONTRACT_ID="$(jq -r '.resource.contractId' response-1.json)"
echo "CONTRACT_ID = $CONTRACT_ID"
```

    CONTRACT_ID = b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1


The CBOR serialization (in text-envelope format) is also embedded in the response.


```bash
jq '.resource.txBody' response-1.json > tx-1.unsigned
```

There are many ways to sign and submit Cardano transactions:
- `cardano-cli` at the command line
- `cardano-wallet` at the command line or as a REST service
- `cardano-hw-cli` for a hardware wallet at the command line
- a Babbage-compatible CIP-30 wallet in a web browser
- `marlowe-cli` at the command line

For convenience, here we use `marlowe-cli transaction submit`. One may have to wait a minute or so for the transactions to be confirmed on the blockchain.


```bash
TX_1=$(
marlowe-cli transaction submit \
  --tx-body-file tx-1.unsigned \
  --required-signer "$MEDIATOR_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_1 = $TX_1"
```

    TX_1 = b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c


One can view the transaction on a Cardano explorer and see that the contract has been created and the parties have received their role tokens. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_1?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c?tab=utxo


In particular, we see that the Marlowe contract holds the 2 ada that was set as `MINIMUM_LOVELACE`.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$CONTRACT_ID"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c     1        2000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "7a78ba1d13c0847bcef31e793ee62395809b133e77744c4c03bb1905a0ede9bb"


One can see that the seller, buyer, and mediator have received their role tokens. Note that `4c656e646572 = Seller`, `4275796572 = Buyer`, and `4d65646961746f72 = Mediator` in hexadecimal notation.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$SELLER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c     4        1034400 lovelace + 1 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072.53656c6c6572 + TxOutDatumNone
    f2d8203e5e72830c22f7cc6ea9faeeda1ccc07bb6be203ec36dc6d99723bcfa4     1        1000000000 lovelace + TxOutDatumNone



```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BUYER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c     2        1030090 lovelace + 1 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072.4275796572 + TxOutDatumNone
    f2d8203e5e72830c22f7cc6ea9faeeda1ccc07bb6be203ec36dc6d99723bcfa4     2        1000000000 lovelace + TxOutDatumNone



```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$MEDIATOR_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c     0        994418994 lovelace + TxOutDatumNone
    b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c     3        1043020 lovelace + 1 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072.4d65646961746f72 + TxOutDatumNone


## View the details of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}` can fetch a contract from the blockchain and return information about it.


```bash
CONTRACT_URL="$MARLOWE_RT_WEBSERVER_URL/`jq -r '.links.contract' response-1.json`"
echo "CONTRACT_URL = $CONTRACT_URL"
```

    CONTRACT_URL = http://127.0.0.1:3780/contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231



```bash
curl -sS "$CONTRACT_URL" | json2yaml
```

    links:
      transactions: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231/transactions
    resource:
      block:
        blockHeaderHash: aeb066abd65b136910697be2b820ec94ee289ffe1c5c0cfe6f643d6ccb8e30f9
        blockNo: 757369
        slotNo: 23979509
      continuations: null
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      currentContract:
        timeout: 1679665969000
        timeout_continuation: close
        when:
        - case:
            deposits: 75000000
            into_account:
              role_token: Seller
            of_token:
              currency_symbol: ''
              token_name: ''
            party:
              role_token: Buyer
          then:
            timeout: 1679669569000
            timeout_continuation: close
            when:
            - case:
                choose_between:
                - from: 0
                  to: 0
                for_choice:
                  choice_name: Everything is alright
                  choice_owner:
                    role_token: Buyer
              then: close
            - case:
                choose_between:
                - from: 1
                  to: 1
                for_choice:
                  choice_name: Report problem
                  choice_owner:
                    role_token: Buyer
              then:
                from_account:
                  role_token: Seller
                pay: 75000000
                then:
                  timeout: 1679673169000
                  timeout_continuation: close
                  when:
                  - case:
                      choose_between:
                      - from: 1
                        to: 1
                      for_choice:
                        choice_name: Confirm problem
                        choice_owner:
                          role_token: Seller
                    then: close
                  - case:
                      choose_between:
                      - from: 0
                        to: 0
                      for_choice:
                        choice_name: Dispute problem
                        choice_owner:
                          role_token: Seller
                    then:
                      timeout: 1679676769000
                      timeout_continuation: close
                      when:
                      - case:
                          choose_between:
                          - from: 0
                            to: 0
                          for_choice:
                            choice_name: Dismiss claim
                            choice_owner:
                              role_token: Mediator
                        then:
                          from_account:
                            role_token: Buyer
                          pay: 75000000
                          then: close
                          to:
                            account:
                              role_token: Seller
                          token:
                            currency_symbol: ''
                            token_name: ''
                      - case:
                          choose_between:
                          - from: 1
                            to: 1
                          for_choice:
                            choice_name: Confirm claim
                            choice_owner:
                              role_token: Mediator
                        then: close
                to:
                  account:
                    role_token: Buyer
                token:
                  currency_symbol: ''
                  token_name: ''
      initialContract:
        timeout: 1679665969000
        timeout_continuation: close
        when:
        - case:
            deposits: 75000000
            into_account:
              role_token: Seller
            of_token:
              currency_symbol: ''
              token_name: ''
            party:
              role_token: Buyer
          then:
            timeout: 1679669569000
            timeout_continuation: close
            when:
            - case:
                choose_between:
                - from: 0
                  to: 0
                for_choice:
                  choice_name: Everything is alright
                  choice_owner:
                    role_token: Buyer
              then: close
            - case:
                choose_between:
                - from: 1
                  to: 1
                for_choice:
                  choice_name: Report problem
                  choice_owner:
                    role_token: Buyer
              then:
                from_account:
                  role_token: Seller
                pay: 75000000
                then:
                  timeout: 1679673169000
                  timeout_continuation: close
                  when:
                  - case:
                      choose_between:
                      - from: 1
                        to: 1
                      for_choice:
                        choice_name: Confirm problem
                        choice_owner:
                          role_token: Seller
                    then: close
                  - case:
                      choose_between:
                      - from: 0
                        to: 0
                      for_choice:
                        choice_name: Dispute problem
                        choice_owner:
                          role_token: Seller
                    then:
                      timeout: 1679676769000
                      timeout_continuation: close
                      when:
                      - case:
                          choose_between:
                          - from: 0
                            to: 0
                          for_choice:
                            choice_name: Dismiss claim
                            choice_owner:
                              role_token: Mediator
                        then:
                          from_account:
                            role_token: Buyer
                          pay: 75000000
                          then: close
                          to:
                            account:
                              role_token: Seller
                          token:
                            currency_symbol: ''
                            token_name: ''
                      - case:
                          choose_between:
                          - from: 1
                            to: 1
                          for_choice:
                            choice_name: Confirm claim
                            choice_owner:
                              role_token: Mediator
                        then: close
                to:
                  account:
                    role_token: Buyer
                token:
                  currency_symbol: ''
                  token_name: ''
      metadata: {}
      roleTokenMintingPolicyId: 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072
      state:
        accounts:
        - - - address: addr_test1vr6tytqs3x8qgewhw89m3xrz58t3tqu2hfsecw0u06lf3hg052wsv
            - currency_symbol: ''
              token_name: ''
          - 2000000
        boundValues: []
        choices: []
        minTime: 0
      status: confirmed
      tags: {}
      txBody: null
      utxo: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      version: v1


## Transaction 2: Buyer Deposits Funds into Seller’s Account

The buyer deposits their 75 ada into the contract using Marlowe Runtime\'s `HTTP` `POST` `/contract/{contractId}/transactions` endpoint. The buyer is providing the funding for and receiving the change from this transaction, so we provide their address.

The deposit is represented as JSON input to the contract. The `marlowe-cli input deposit` tool conveniently formats the correct JSON for a deposit.


```bash
marlowe-cli input deposit --help
```

    Usage: marlowe-cli input deposit --deposit-account PARTY --deposit-party PARTY 
                                     [--deposit-token TOKEN]
                                     --deposit-amount INTEGER 
                                     [--out-file OUTPUT_FILE]
    
      Create Marlowe input for a deposit.
    
    Available options:
      --deposit-account PARTY  The account for the deposit.
      --deposit-party PARTY    The party making the deposit.
      --deposit-token TOKEN    The token being deposited, if not Ada.
      --deposit-amount INTEGER The amount of token being deposited.
      --out-file OUTPUT_FILE   JSON output file for contract input.
      -h,--help                Show this help text



```bash
marlowe-cli input deposit \
  --deposit-party Buyer \
  --deposit-account Seller \
  --deposit-amount "$PRICE" \
  --out-file input-2.json
json2yaml input-2.json
```

    input_from_party:
      role_token: Buyer
    into_account:
      role_token: Seller
    of_token:
      currency_symbol: ''
      token_name: ''
    that_deposits: 75000000



```bash
yaml2json << EOI > request-2.json
version: v1
inputs: [$(cat input-2.json)]
metadata: {}
tags: {}
EOI
cat request-2.json
```

    {"inputs":[{"input_from_party":{"role_token":"Buyer"},"into_account":{"role_token":"Seller"},"of_token":{"currency_symbol":"","token_name":""},"that_deposits":75000000}],"metadata":{},"tags":{},"version":"v1"}


Next we post the request and store the response.


```bash
curl "$CONTRACT_URL/transactions" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $BUYER_ADDR" \
  -d @request-2.json \
  -o response-2.json \
  -sS
json2yaml response-2.json
```

    links:
      transaction: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231/transactions/5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526
    resource:
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      transactionId: 5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526
      txBody:
        cborHex: 86aa0083825820b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c01825820b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c02825820f2d8203e5e72830c22f7cc6ea9faeeda1ccc07bb6be203ec36dc6d99723bcfa4020d81825820f2d8203e5e72830c22f7cc6ea9faeeda1ccc07bb6be203ec36dc6d99723bcfa40212818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd010183a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a3716a88ea300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a0496ed400282005820cec4e93035eef608715e63a0bb412ef897093f3119f108139d91323481e86e0aa200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a000fb7caa1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a14542757965720110a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a3b8934f5111a0011950b021a000bb8b2031a016df2b1081a016de6ca0b5820bfa376671767c8086bc5ae613084640dfca7ef10e41fde0cf1aece951a2438e09fff82d8799fd8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072ffd8799fa1d8799fd8799fd87980d8799fd8799f581cf4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98ddffd87a80ffffd8799f4040ffff1a001e8480a0a000ffd87c9f9fd8799fd8799fd87a9f4653656c6c6572ffd87a9f454275796572ffd8799f4040ffd87a9f1a047868c0ffffd87c9f9fd8799fd87a9fd8799f5545766572797468696e6720697320616c7269676874d87a9f454275796572ffff9fd8799f0000ffffffd87980ffd8799fd87a9fd8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff9fd8799f0101ffffffd87a9fd87a9f4653656c6c6572ffd8799fd87a9f454275796572ffffd8799f4040ffd87a9f1a047868c0ffd87c9f9fd8799fd87a9fd8799f4f436f6e6669726d2070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0101ffffffd87980ffd8799fd87a9fd8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0000ffffffd87c9f9fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff9fd8799f0000ffffffd87a9fd87a9f454275796572ffd8799fd87a9f4653656c6c6572ffffd8799f4040ffd87a9f1a047868c0ffd87980ffffd8799fd87a9fd8799f4d436f6e6669726d20636c61696dd87a9f484d65646961746f72ffff9fd8799f0101ffffffd87980ffff1b00000187148982e8d87980ffffff1b0000018714529468d87980ffffffff1b00000187141ba5e8d87980ffffff1b0000018713e4b768d87980ffffd8799fd8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072ffd8799fa2d8799fd8799fd87980d8799fd8799f581cf4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98ddffd87a80ffffd8799f4040ffff1a001e8480d8799fd87a9f4653656c6c6572ffd8799f4040ffff1a047868c0a0a01b0000018713b63910ffd87c9f9fd8799fd87a9fd8799f5545766572797468696e6720697320616c7269676874d87a9f454275796572ffff9fd8799f0000ffffffd87980ffd8799fd87a9fd8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff9fd8799f0101ffffffd87a9fd87a9f4653656c6c6572ffd8799fd87a9f454275796572ffffd8799f4040ffd87a9f1a047868c0ffd87c9f9fd8799fd87a9fd8799f4f436f6e6669726d2070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0101ffffffd87980ffd8799fd87a9fd8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0000ffffffd87c9f9fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff9fd8799f0000ffffffd87a9fd87a9f454275796572ffd8799fd87a9f4653656c6c6572ffffd8799f4040ffd87a9f1a047868c0ffd87980ffffd8799fd87a9fd8799f4d436f6e6669726d20636c61696dd87a9f484d65646961746f72ffff9fd8799f0101ffffffd87980ffff1b00000187148982e8d87980ffffff1b0000018714529468d87980ffffffff1b00000187141ba5e8d87980ffff818400009fd8799fd8799fd87a9f4653656c6c6572ffd87a9f454275796572ffd8799f4040ff1a047868c0ffffff821a006736961a6bf49e10f5f6
        description: ''
        type: TxBodyBabbage


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-2.json > tx-2.unsigned
```


```bash
TX_2=$(
marlowe-cli transaction submit \
  --tx-body-file tx-2.unsigned \
  --required-signer "$BUYER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_2 = $TX_2"
```

    TX_2 = 5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_2?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526?tab=utxo


One can see that the buyer has approximately 75 ada less than originally.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BUYER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526     0        924231822 lovelace + TxOutDatumNone
    5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526     2        1030090 lovelace + 1 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072.4275796572 + TxOutDatumNone


The Marlowe contract still has the 2 ada from its creation and an additional 75 ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_2#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526     1        77000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "cec4e93035eef608715e63a0bb412ef897093f3119f108139d91323481e86e0a"


## View the further progress of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}/transactions/{transactionId}` can fetch a contract from the blockchain and return information about it.


```bash
curl -sS "$CONTRACT_URL"/transactions/"$TX_2" | json2yaml
```

    links: {}
    resource:
      block:
        blockHeaderHash: 778d1db1cc8f3d79aedc2fa1d5858be8ce05af601c11fff21a15878b615ea606
        blockNo: 757379
        slotNo: 23979753
      consumingTx: null
      continuations: null
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      inputUtxo: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      inputs:
      - input_from_party:
          role_token: Buyer
        into_account:
          role_token: Seller
        of_token:
          currency_symbol: ''
          token_name: ''
        that_deposits: 75000000
      invalidBefore: 2023-03-24T13:02:02Z
      invalidHereafter: 2023-03-24T13:52:49Z
      metadata: {}
      outputContract:
        timeout: 1679669569000
        timeout_continuation: close
        when:
        - case:
            choose_between:
            - from: 0
              to: 0
            for_choice:
              choice_name: Everything is alright
              choice_owner:
                role_token: Buyer
          then: close
        - case:
            choose_between:
            - from: 1
              to: 1
            for_choice:
              choice_name: Report problem
              choice_owner:
                role_token: Buyer
          then:
            from_account:
              role_token: Seller
            pay: 75000000
            then:
              timeout: 1679673169000
              timeout_continuation: close
              when:
              - case:
                  choose_between:
                  - from: 1
                    to: 1
                  for_choice:
                    choice_name: Confirm problem
                    choice_owner:
                      role_token: Seller
                then: close
              - case:
                  choose_between:
                  - from: 0
                    to: 0
                  for_choice:
                    choice_name: Dispute problem
                    choice_owner:
                      role_token: Seller
                then:
                  timeout: 1679676769000
                  timeout_continuation: close
                  when:
                  - case:
                      choose_between:
                      - from: 0
                        to: 0
                      for_choice:
                        choice_name: Dismiss claim
                        choice_owner:
                          role_token: Mediator
                    then:
                      from_account:
                        role_token: Buyer
                      pay: 75000000
                      then: close
                      to:
                        account:
                          role_token: Seller
                      token:
                        currency_symbol: ''
                        token_name: ''
                  - case:
                      choose_between:
                      - from: 1
                        to: 1
                      for_choice:
                        choice_name: Confirm claim
                        choice_owner:
                          role_token: Mediator
                    then: close
            to:
              account:
                role_token: Buyer
            token:
              currency_symbol: ''
              token_name: ''
      outputState:
        accounts:
        - - - address: addr_test1vr6tytqs3x8qgewhw89m3xrz58t3tqu2hfsecw0u06lf3hg052wsv
            - currency_symbol: ''
              token_name: ''
          - 2000000
        - - - role_token: Seller
            - currency_symbol: ''
              token_name: ''
          - 75000000
        boundValues: []
        choices: []
        minTime: 1679662922000
      outputUtxo: 5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526#1
      status: confirmed
      tags: {}
      transactionId: 5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526
      txBody: null


## Transaction 3: The Buyer Reports That There is a Problem

The buyer chooses to report a problem with the merchandise.

The choice is represented as JSON input to the contract. The `marlowe-cli input choose` tool conveniently formats the correct JSON for a choice.


```bash
marlowe-cli input choose --help
```

    Usage: marlowe-cli input choose --choice-name NAME --choice-party PARTY
                                    --choice-number INTEGER [--out-file OUTPUT_FILE]
    
      Create Marlowe input for a choice.
    
    Available options:
      --choice-name NAME       The name of the choice made.
      --choice-party PARTY     The party making the choice.
      --choice-number INTEGER  The number chosen.
      --out-file OUTPUT_FILE   JSON output file for contract input.
      -h,--help                Show this help text



```bash
marlowe-cli input choose \
  --choice-name "Report problem" \
  --choice-party Buyer \
  --choice-number 1 \
  --out-file input-3.json
json2yaml input-3.json
```

    for_choice_id:
      choice_name: Report problem
      choice_owner:
        role_token: Buyer
    input_that_chooses_num: 1



```bash
yaml2json << EOI > request-3.json
version: v1
inputs: [$(cat input-3.json)]
metadata: {}
tags: {}
EOI
cat request-3.json
```

    {"inputs":[{"for_choice_id":{"choice_name":"Report problem","choice_owner":{"role_token":"Buyer"}},"input_that_chooses_num":1}],"metadata":{},"tags":{},"version":"v1"}


Next we post the request and store the response.


```bash
curl "$CONTRACT_URL/transactions" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $BUYER_ADDR" \
  -d @request-3.json \
  -o response-3.json \
  -sS
json2yaml response-3.json
```

    links:
      transaction: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231/transactions/3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d
    resource:
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      transactionId: 3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d
      txBody:
        cborHex: 86aa00838258205c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526008258205c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526018258205c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526020d818258205c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d5260012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd010183a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a370a9baea300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a0496ed400282005820859a9bb208ab9beed6c6d75f9c5da732f41f52fe9748d1d79931daaa28c5e989a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a000fb7caa1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a14542757965720110a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a3704953e111a00121350021a000c0ce0031a016e00c1081a016de7810b5820b55acbee3f5bc9fbe498a9044169e4d1ee1ac2f7853fbb73d134117451990ad79fff82d8799fd8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072ffd8799fa2d8799fd8799fd87980d8799fd8799f581cf4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98ddffd87a80ffffd8799f4040ffff1a001e8480d8799fd87a9f454275796572ffd8799f4040ffff1a047868c0a1d8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff01a01b0000018713b903e8ffd87c9f9fd8799fd87a9fd8799f4f436f6e6669726d2070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0101ffffffd87980ffd8799fd87a9fd8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0000ffffffd87c9f9fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff9fd8799f0000ffffffd87a9fd87a9f454275796572ffd8799fd87a9f4653656c6c6572ffffd8799f4040ffd87a9f1a047868c0ffd87980ffffd8799fd87a9fd8799f4d436f6e6669726d20636c61696dd87a9f484d65646961746f72ffff9fd8799f0101ffffffd87980ffff1b00000187148982e8d87980ffffff1b0000018714529468d87980ffffd8799fd8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072ffd8799fa2d8799fd8799fd87980d8799fd8799f581cf4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98ddffd87a80ffffd8799f4040ffff1a001e8480d8799fd87a9f4653656c6c6572ffd8799f4040ffff1a047868c0a0a01b0000018713b63910ffd87c9f9fd8799fd87a9fd8799f5545766572797468696e6720697320616c7269676874d87a9f454275796572ffff9fd8799f0000ffffffd87980ffd8799fd87a9fd8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff9fd8799f0101ffffffd87a9fd87a9f4653656c6c6572ffd8799fd87a9f454275796572ffffd8799f4040ffd87a9f1a047868c0ffd87c9f9fd8799fd87a9fd8799f4f436f6e6669726d2070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0101ffffffd87980ffd8799fd87a9fd8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0000ffffffd87c9f9fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff9fd8799f0000ffffffd87a9fd87a9f454275796572ffd8799fd87a9f4653656c6c6572ffffd8799f4040ffd87a9f1a047868c0ffd87980ffffd8799fd87a9fd8799f4d436f6e6669726d20636c61696dd87a9f484d65646961746f72ffff9fd8799f0101ffffffd87980ffff1b00000187148982e8d87980ffffff1b0000018714529468d87980ffffffff1b00000187141ba5e8d87980ffff818400019fd8799fd87a9fd8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff01ffffff821a006d3cae1a70de7f55f5f6
        description: ''
        type: TxBodyBabbage


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-3.json > tx-3.unsigned
```


```bash
TX_3=$(
marlowe-cli transaction submit \
  --tx-body-file tx-3.unsigned \
  --required-signer "$BUYER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_3 = $TX_3"
```

    TX_3 = 3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_3?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d?tab=utxo


One can see that the buyer still has approximately 75 ada less than originally.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$BUYER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d     0        923442094 lovelace + TxOutDatumNone
    3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d     2        1030090 lovelace + 1 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072.4275796572 + TxOutDatumNone


The Marlowe contract still has the 77 ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_3#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d     1        77000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "859a9bb208ab9beed6c6d75f9c5da732f41f52fe9748d1d79931daaa28c5e989"


## View the further progress of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}/transactions/{transactionId}` can fetch a contract from the blockchain and return information about it.


```bash
curl -sS "$CONTRACT_URL"/transactions/"$TX_3" | json2yaml
```

    links:
      previous: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231/transactions/5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526
    resource:
      block:
        blockHeaderHash: 9515113e25d5a06d194f7a1946ec0a0ab31c3410e0a36cb6ffe065531598b583
        blockNo: 757387
        slotNo: 23979937
      consumingTx: null
      continuations: null
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      inputUtxo: 5c45ab6080a4b5bf47474e0e3eac6ff54a93737fa25ce9c0997b30a51fc4d526#1
      inputs:
      - for_choice_id:
          choice_name: Report problem
          choice_owner:
            role_token: Buyer
        input_that_chooses_num: 1
      invalidBefore: 2023-03-24T13:05:05Z
      invalidHereafter: 2023-03-24T14:52:49Z
      metadata: {}
      outputContract:
        timeout: 1679673169000
        timeout_continuation: close
        when:
        - case:
            choose_between:
            - from: 1
              to: 1
            for_choice:
              choice_name: Confirm problem
              choice_owner:
                role_token: Seller
          then: close
        - case:
            choose_between:
            - from: 0
              to: 0
            for_choice:
              choice_name: Dispute problem
              choice_owner:
                role_token: Seller
          then:
            timeout: 1679676769000
            timeout_continuation: close
            when:
            - case:
                choose_between:
                - from: 0
                  to: 0
                for_choice:
                  choice_name: Dismiss claim
                  choice_owner:
                    role_token: Mediator
              then:
                from_account:
                  role_token: Buyer
                pay: 75000000
                then: close
                to:
                  account:
                    role_token: Seller
                token:
                  currency_symbol: ''
                  token_name: ''
            - case:
                choose_between:
                - from: 1
                  to: 1
                for_choice:
                  choice_name: Confirm claim
                  choice_owner:
                    role_token: Mediator
              then: close
      outputState:
        accounts:
        - - - address: addr_test1vr6tytqs3x8qgewhw89m3xrz58t3tqu2hfsecw0u06lf3hg052wsv
            - currency_symbol: ''
              token_name: ''
          - 2000000
        - - - role_token: Buyer
            - currency_symbol: ''
              token_name: ''
          - 75000000
        boundValues: []
        choices:
        - - choice_name: Report problem
            choice_owner:
              role_token: Buyer
          - 1
        minTime: 1679663105000
      outputUtxo: 3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d#1
      status: confirmed
      tags: {}
      transactionId: 3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d
      txBody: null


## Transaction 4: The Seller Disputes that There is a Problem

Now the seller chooses to dispute that there is a problem with the merchandise.


```bash
marlowe-cli input choose \
  --choice-name "Dispute problem" \
  --choice-party Seller \
  --choice-number 0 \
  --out-file input-4.json
json2yaml input-4.json
```

    for_choice_id:
      choice_name: Dispute problem
      choice_owner:
        role_token: Seller
    input_that_chooses_num: 0



```bash
yaml2json << EOI > request-4.json
version: v1
inputs: [$(cat input-4.json)]
metadata: {}
tags: {}
EOI
cat request-4.json
```

    {"inputs":[{"for_choice_id":{"choice_name":"Dispute problem","choice_owner":{"role_token":"Seller"}},"input_that_chooses_num":0}],"metadata":{},"tags":{},"version":"v1"}


Next we post the request and store the response.


```bash
curl "$CONTRACT_URL/transactions" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $SELLER_ADDR" \
  -d @request-4.json \
  -o response-4.json \
  -sS
json2yaml response-4.json
```

    links:
      transaction: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231/transactions/87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894
    resource:
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      transactionId: 87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894
      txBody:
        cborHex: 86aa00838258203a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d01825820b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c04825820f2d8203e5e72830c22f7cc6ea9faeeda1ccc07bb6be203ec36dc6d99723bcfa4010d81825820f2d8203e5e72830c22f7cc6ea9faeeda1ccc07bb6be203ec36dc6d99723bcfa40112818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd010183a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b900d4aa300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a0496ed400282005820b9755884ecbd03f8a11bb6b8107dafa2c21d42eeff45d46a7989e162714ee6fda200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a000fc8a0a1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a14653656c6c65720110a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b8aaeef111a00101b11021a000abcb6031a016e0ed1081a016de81a0b5820ea3dc452aa2c594565b8cb0adbe5cf8b74beb9318c8199e2daec18073a9ac9699fff82d8799fd8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072ffd8799fa2d8799fd8799fd87980d8799fd8799f581cf4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98ddffd87a80ffffd8799f4040ffff1a001e8480d8799fd87a9f454275796572ffd8799f4040ffff1a047868c0a1d8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff01a01b0000018713b903e8ffd87c9f9fd8799fd87a9fd8799f4f436f6e6669726d2070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0101ffffffd87980ffd8799fd87a9fd8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff9fd8799f0000ffffffd87c9f9fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff9fd8799f0000ffffffd87a9fd87a9f454275796572ffd8799fd87a9f4653656c6c6572ffffd8799f4040ffd87a9f1a047868c0ffd87980ffffd8799fd87a9fd8799f4d436f6e6669726d20636c61696dd87a9f484d65646961746f72ffff9fd8799f0101ffffffd87980ffff1b00000187148982e8d87980ffffff1b0000018714529468d87980ffffd8799fd8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072ffd8799fa2d8799fd8799fd87980d8799fd8799f581cf4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98ddffd87a80ffffd8799f4040ffff1a001e8480d8799fd87a9f454275796572ffd8799f4040ffff1a047868c0a2d8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff01d8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff00a01b0000018713bb5990ffd87c9f9fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff9fd8799f0000ffffffd87a9fd87a9f454275796572ffd8799fd87a9f4653656c6c6572ffffd8799f4040ffd87a9f1a047868c0ffd87980ffffd8799fd87a9fd8799f4d436f6e6669726d20636c61696dd87a9f484d65646961746f72ffff9fd8799f0101ffffffd87980ffff1b00000187148982e8d87980ffff818400009fd8799fd87a9fd8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff00ffffff821a005e26321a60a38b52f5f6
        description: ''
        type: TxBodyBabbage


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-4.json > tx-4.unsigned
```


```bash
TX_4=$(
marlowe-cli transaction submit \
  --tx-body-file tx-4.unsigned \
  --required-signer "$SELLER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_4 = $TX_4"
```

    TX_4 = 87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_4?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894?tab=utxo


One can see that the seller still has approximately their original balance.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$SELLER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894     0        999296330 lovelace + TxOutDatumNone
    87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894     2        1034400 lovelace + 1 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072.53656c6c6572 + TxOutDatumNone


The Marlowe contract still has the 77 ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_4#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894     1        77000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "b9755884ecbd03f8a11bb6b8107dafa2c21d42eeff45d46a7989e162714ee6fd"


## View the further progress of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}/transactions/{transactionId}` can fetch a contract from the blockchain and return information about it.


```bash
curl -sS "$CONTRACT_URL"/transactions/"$TX_4" | json2yaml
```

    links:
      previous: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231/transactions/3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d
    resource:
      block:
        blockHeaderHash: 063ba9b171e7c3f716a6efb4fa3c5a4a9846d4415d4ec3c36200cdac884603cd
        blockNo: 757396
        slotNo: 23980134
      consumingTx: null
      continuations: null
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      inputUtxo: 3a7ffde61ba8e1a2281e1a165f42901b302cc3eb2ad122e7f7396f1807e85a7d#1
      inputs:
      - for_choice_id:
          choice_name: Dispute problem
          choice_owner:
            role_token: Seller
        input_that_chooses_num: 0
      invalidBefore: 2023-03-24T13:07:38Z
      invalidHereafter: 2023-03-24T15:52:49Z
      metadata: {}
      outputContract:
        timeout: 1679676769000
        timeout_continuation: close
        when:
        - case:
            choose_between:
            - from: 0
              to: 0
            for_choice:
              choice_name: Dismiss claim
              choice_owner:
                role_token: Mediator
          then:
            from_account:
              role_token: Buyer
            pay: 75000000
            then: close
            to:
              account:
                role_token: Seller
            token:
              currency_symbol: ''
              token_name: ''
        - case:
            choose_between:
            - from: 1
              to: 1
            for_choice:
              choice_name: Confirm claim
              choice_owner:
                role_token: Mediator
          then: close
      outputState:
        accounts:
        - - - address: addr_test1vr6tytqs3x8qgewhw89m3xrz58t3tqu2hfsecw0u06lf3hg052wsv
            - currency_symbol: ''
              token_name: ''
          - 2000000
        - - - role_token: Buyer
            - currency_symbol: ''
              token_name: ''
          - 75000000
        boundValues: []
        choices:
        - - choice_name: Report problem
            choice_owner:
              role_token: Buyer
          - 1
        - - choice_name: Dispute problem
            choice_owner:
              role_token: Seller
          - 0
        minTime: 1679663258000
      outputUtxo: 87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894#1
      status: confirmed
      tags: {}
      transactionId: 87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894
      txBody: null


## Transaction 5: The Mediator Dismisses the Claim

The mediator rules in favor or the seller and dismisses the buyer's claim.


```bash
marlowe-cli input choose \
  --choice-name "Dismiss claim" \
  --choice-party Mediator \
  --choice-number 0 \
  --out-file input-5.json
json2yaml input-5.json
```

    for_choice_id:
      choice_name: Dismiss claim
      choice_owner:
        role_token: Mediator
    input_that_chooses_num: 0



```bash
yaml2json << EOI > request-5.json
version: v1
inputs: [$(cat input-5.json)]
metadata: {}
tags: {}
EOI
cat request-5.json
```

    {"inputs":[{"for_choice_id":{"choice_name":"Dismiss claim","choice_owner":{"role_token":"Mediator"}},"input_that_chooses_num":0}],"metadata":{},"tags":{},"version":"v1"}


Next we post the request and store the response.


```bash
curl "$CONTRACT_URL/transactions" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $MEDIATOR_ADDR" \
  -d @request-5.json \
  -o response-5.json \
  -sS
json2yaml response-5.json
```

    links:
      transaction: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231/transactions/e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b
    resource:
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      transactionId: e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b
      txBody:
        cborHex: 86aa008382582087dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f8489401825820b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c00825820b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c030d81825820b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c0012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd010184a200581d60f4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98dd011a3b39ea31a200581d60f4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98dd01821a000fea4ca1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a1484d65646961746f7201a300581d70e165610232235bbbbeff5b998b233daae42979dec92a6722d9cda989011a047868c002820058203d3d354ce405bd517f65eb8b2905e8da5ab74845fabddd149d8fc8f173bdce3fa200581d60f4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98dd011a001e848010a200581d60f4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98dd011a3b340eb0111a00119282021a000bb701031a016e1ce1081a016de8660b5820b5af057eb94f5769f30290540e94314e2c3e566153b34eb455d465b5c691d47e9fff82d8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd80310724653656c6c6572ffd8799fd8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072ffd8799fa2d8799fd8799fd87980d8799fd8799f581cf4b22c10898e0465d771cbb89862a1d715838aba619c39fc7ebe98ddffd87a80ffffd8799f4040ffff1a001e8480d8799fd87a9f454275796572ffd8799f4040ffff1a047868c0a2d8799f4e5265706f72742070726f626c656dd87a9f454275796572ffff01d8799f4f446973707574652070726f626c656dd87a9f4653656c6c6572ffff00a01b0000018713bb5990ffd87c9f9fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff9fd8799f0000ffffffd87a9fd87a9f454275796572ffd8799fd87a9f4653656c6c6572ffffd8799f4040ffd87a9f1a047868c0ffd87980ffffd8799fd87a9fd8799f4d436f6e6669726d20636c61696dd87a9f484d65646961746f72ffff9fd8799f0101ffffffd87980ffff1b00000187148982e8d87980ffff818400009fd8799fd87a9fd8799f4d4469736d69737320636c61696dd87a9f484d65646961746f72ffff00ffffff821a006eb82c1a6f28ce7df5f6
        description: ''
        type: TxBodyBabbage


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-5.json > tx-5.unsigned
```


```bash
TX_5=$(
marlowe-cli transaction submit \
  --tx-body-file tx-5.unsigned \
  --required-signer "$MEDIATOR_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_5 = $TX_5"
```

    TX_5 = e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_5?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b?tab=utxo


One can see that the mediator still has approximately their original balance, which includes the 2 ada they just received, refunding the 2 ada they used to create the contract.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$MEDIATOR_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b     0        993651249 lovelace + TxOutDatumNone
    e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b     1        1043020 lovelace + 1 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072.4d65646961746f72 + TxOutDatumNone
    e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b     3        2000000 lovelace + TxOutDatumNone


The Marlowe contract is closed, but the role-payout address has the 75 ada for the benefit of the seller.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_5#2"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b     2        75000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "3d3d354ce405bd517f65eb8b2905e8da5ab74845fabddd149d8fc8f173bdce3f"


## View the further progress of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}/transactions/{transactionId}` can fetch a contract from the blockchain and return information about it.


```bash
curl -sS "$CONTRACT_URL"/transactions/"$TX_5" | json2yaml
```

    links:
      previous: contracts/b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c%231/transactions/87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894
    resource:
      block:
        blockHeaderHash: cdf51d3a8faf28d28deb942712e0ab6e720e29dad4d07cb6701fa5a1d03d08fa
        blockNo: 757399
        slotNo: 23980215
      consumingTx: null
      continuations: null
      contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      inputUtxo: 87dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f84894#1
      inputs:
      - for_choice_id:
          choice_name: Dismiss claim
          choice_owner:
            role_token: Mediator
        input_that_chooses_num: 0
      invalidBefore: 2023-03-24T13:08:54Z
      invalidHereafter: 2023-03-24T16:52:49Z
      metadata: {}
      outputContract: null
      outputState: null
      outputUtxo: null
      status: confirmed
      tags: {}
      transactionId: e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b
      txBody: null


## Transaction 6: The Seller Withdraws Their Funds

The price of 75 ada is held at Marlowe's role-payout address for the benefit of the seller. The seller can withdraw these funds at any time. The contract ID and role name are included in the request body for a withdrawal.


```bash
yaml2json << EOI > request-6.json
contractId: "$CONTRACT_ID"
role: Seller
EOI
cat request-6.json
```

    {"contractId":"b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1","role":"Seller"}


Next we post the request and store the response.


```bash
curl "$MARLOWE_RT_WEBSERVER_URL/withdrawals" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $SELLER_ADDR" \
  -d @request-6.json \
  -o response-6.json \
  -sS
json2yaml response-6.json
```

    links:
      withdrawal: withdrawals/eb848199e21597df56a45d744f29a4f3a41425c876380f4c58542a296e369cee
    resource:
      txBody:
        cborHex: 86a8008382582087dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f848940082582087dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f8489402825820e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b020d8182582087dba73e0145b13004602c17eb71c3a9a3a9d26760179a41df9f0c0b71f848940012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd020182a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a400366e8a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a000fc8a0a1581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072a14653656c6c65720110a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b887697111a000796b3021a00050f220b5820a5258d13cd3370afa84e2dc060cd7abc854b78da1be057ffb889445f5005e4a59fff81d8799f581c03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd80310724653656c6c6572ff81840002d87980821a001b8ea21a1df5686ff5f6
        description: ''
        type: TxBodyBabbage
      withdrawalId: eb848199e21597df56a45d744f29a4f3a41425c876380f4c58542a296e369cee


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-6.json > tx-6.unsigned
```


```bash
TX_6=$(
marlowe-cli transaction submit \
  --tx-body-file tx-6.unsigned \
  --required-signer "$SELLER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_6 = $TX_6"
```

    TX_6 = eb848199e21597df56a45d744f29a4f3a41425c876380f4c58542a296e369cee


On can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_6?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/eb848199e21597df56a45d744f29a4f3a41425c876380f4c58542a296e369cee?tab=utxo


The seller now has about an additional 75 ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$SELLER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    eb848199e21597df56a45d744f29a4f3a41425c876380f4c58542a296e369cee     0        1073964776 lovelace + TxOutDatumNone
    eb848199e21597df56a45d744f29a4f3a41425c876380f4c58542a296e369cee     1        1034400 lovelace + 1 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072.53656c6c6572 + TxOutDatumNone


## View the withdrawal

Marlowe Runtime\'s `HTTP` `GET` endpoint `/withdrawals/{transactionId}` can fetch a withdrawal from the blockchain and return information about it.


```bash
curl -sS "$MARLOWE_RT_WEBSERVER_URL"/withdrawals/"$TX_6" | json2yaml
```

    block:
      blockHeaderHash: ebe3a661cd9b4799bfcecbcf3ae35fbc4d2ee24bfc7aa67c0a5fb6b250216562
      blockNo: 757411
      slotNo: 23980393
    payouts:
    - contractId: b224b1873d986a5e34d66e6d86f47aa51aed7d3535b933e31fc9d8f98e742b7c#1
      payout: e247a0d8cc28973ca01736c56f1c51725210e3b8584687d32f6929c800a8a66b#2
      role: Seller
      roleTokenMintingPolicyId: 03e6a02b3cb1db721248de96664a7f92318b17bd5f54657bd8031072
    status: confirmed
    withdrawalId: eb848199e21597df56a45d744f29a4f3a41425c876380f4c58542a296e369cee

