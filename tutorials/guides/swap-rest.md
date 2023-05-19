---
title: "Token Swap Using Marlowe Runtime's REST API"
sidebar_position: 6
---

***Before running this notebook, you might want to use Jupyter's "clear output" function to erase the results of the previous execution of this notebook. That will make more apparent what has been executed in the current session.***

The token-swap contract example is a simple Marlowe contract that lets parties trade ada for a token.

[A video works through this Jupyter notebook.](https://youtu.be/sSrVCRNoytU)

You can ask questions about Marlowe in [the #ask-marlowe channel on the IOG Discord](https://discord.com/channels/826816523368005654/936295815926927390) or post problems with this lesson to [the issues list for the Marlowe Starter Kit github repository](https://github.com/input-output-hk/marlowe-starter-kit/issues).

In this demonstration we use Marlowe Runtime\'s REST API, served via `marlowe-web-server`, to run this contract on Cardano\'s `preprod` public testnet. Marlowe contracts may use either addresses or role tokens for authorization: here we use role tokens and we have Marlowe Runtime mint them.

In [Marlowe Playground](https://play.marlowe-finance.io/), the contract looks like this in Blockly format.

![Marlowe contract for swapping tokens](/img/swap-playground.png)

In Marlowe format it appears as
```
When
    [Case
        (Deposit
            (Role "Ada provider")
            (Role "Ada provider")
            (Token "" "")
            (MulValue
                (Constant 1000000)
                (ConstantParam "Amount of Ada")
            )
        )
        (When
            [Case
                (Deposit
                    (Role "Dollar provider")
                    (Role "Dollar provider")
                    (Token "9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe" "Djed_testMicroUSD")
                    (ConstantParam "Amount of dollars")
                )
                (Pay
                    (Role "Ada provider")
                    (Party (Role "Dollar provider"))
                    (Token "" "")
                    (MulValue
                        (Constant 1000000)
                        (ConstantParam "Amount of Ada")
                    )
                    (Pay
                        (Role "Dollar provider")
                        (Party (Role "Ada provider"))
                        (Token "9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe" "Djed_testMicroUSD")
                        (ConstantParam "Amount of dollars")
                        Close 
                    )
                )]
            (TimeParam "Timeout for dollar deposit")
            Close 
        )]
    (TimeParam "Timeout for Ada deposit")
    Close
```

## Preliminaries

See [Preliminaries](preliminaries.md) for information on setting up one's environment for using this tutorial.

The lesson assumes that the following environment variables have been set.
- `CARDANO_NODE_SOCKET_PATH`: location of Cardano node's socket.
- `CARDANO_TESTNET_MAGIC`: testnet magic number.
- `MARLOWE_RT_WEBSERVER_HOST`: IP address of the Marlowe Runtime web server.
- `MARLOWE_RT_WEBSERVER_PORT`: Port number for the Marlowe Runtime web server.

It also assumes that the parties have addresses, signing keys, and funds.
- Ada Provider
    - [keys/lender.address](keys/lender.address): Cardano address for the ada provider
    - [keys/lender.skey](keys/lender.skey): location of signing key file for the ada provider
- Dollar Provider
    - [keys/borrower.address](keys/borrower.address): Cardano address for the dollar provider
    - [keys/borrower.skey](keys/borrower.skey): location of signing key file for the dollar provider

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

### Ada Provider address and funds

Check that an address and key has been created for the ada provider. If not, see "Creating Addresses and Signing Keys" in [Preliminaries](preliminaries.md).


```bash
ADA_PROVIDER_SKEY=keys/lender.skey
ADA_PROVIDER_ADDR=$(cat keys/lender.address)
echo "ADA_PROVIDER_ADDR = $ADA_PROVIDER_ADDR"
```

    ADA_PROVIDER_ADDR = addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck


Check that the ada provider has at least three hundred ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$ADA_PROVIDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    81fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb51     1        1000000000 lovelace + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$ADA_PROVIDER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck


### Dollar Provider address and funds

Check that an address and key has been created for the dollar provider. If not, see "Creating Addresses and Signing Keys" in [Preliminaries](preliminaries.md).


```bash
USD_PROVIDER_SKEY=keys/borrower.skey
USD_PROVIDER_ADDR=$(cat keys/borrower.address)
echo "USD_PROVIDER_ADDR = $USD_PROVIDER_ADDR"
```

    USD_PROVIDER_ADDR = addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d


Check that the dollar provider has at least one hundred USD tokens.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$USD_PROVIDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    81fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb51     2        1000000000 lovelace + TxOutDatumNone
    81fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb51     3        2000000 lovelace + 100000000 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe.446a65645f746573744d6963726f555344 + TxOutDatumNone


One can view the address on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/address/"$USD_PROVIDER_ADDR"
```

    https://preprod.cardanoscan.io/address/addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d


## Design the contract

The swap contract can be downloaded from the [Marlowe Playground](https://play.marlowe-finance.io/) as a JSON file, or it can be generated using [Marlowe CLI](https://github.com/input-output-hk/marlowe-cardano/tree/main/marlowe-cli#readme) using the `marlowe-cli template` command.

Set the ada amount to 294 and the dollar amount to 100.000000.


```bash
ADA=1000000  # 1 ada = 1,000,000 lovelace
LOVELACE_AMOUNT=$((294 * ADA))
MICROUSD_AMOUNT=$((100 * 1000000))
echo "LOVELACE_AMOUNT = $LOVELACE_AMOUNT lovelace"
echo "MICROUSD_AMOUNT = $MICROUSD_AMOUNT µUSD"
```

    LOVELACE_AMOUNT = 294000000 lovelace
    MICROUSD_AMOUNT = 100000000 µUSD


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

Now design the contract.

1. Visit https://play.marlowe-finance.io/ in a web browser.
2. Select "Open an Example".
3. Select "Marlowe" or "Blockly" under "Swap".
4. Edit the contract so that the dollar token has the policy ID and name for the dollar token. In this example we use test djed, which has policy ID `9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe` and token name `Djed_testMicroUSD`.
5. Select "Send to Simulator".
6. Set the "Timeout for ada deposit" to one hour into the future.
7. Set the "Timeout for dollar deposit" to two hours into the future
8. Set "Amount of Ada" to 294.
9. Set "Amount of dollars" to 100,000,000, since the units of measure are millionths.
10. Select "Download as JSON", set the file name to "swap-contract.json", and store the file in this folder, namely [marlowe-starter-kit/](.).

![Setting parameters for the swap contract in Marlowe Playground](/img/swap-simulation.png)

## Examine the contract

View the contract file as YAML.


```bash
json2yaml swap-contract.json
```

    timeout: 1679669100000
    timeout_continuation: close
    when:
    - case:
        deposits:
          multiply: 1000000
          times: 294
        into_account:
          role_token: Ada provider
        of_token:
          currency_symbol: ''
          token_name: ''
        party:
          role_token: Ada provider
      then:
        timeout: 1679673000000
        timeout_continuation: close
        when:
        - case:
            deposits: 100000000
            into_account:
              role_token: Dollar provider
            of_token:
              currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
              token_name: Djed_testMicroUSD
            party:
              role_token: Dollar provider
          then:
            from_account:
              role_token: Ada provider
            pay:
              multiply: 1000000
              times: 294
            then:
              from_account:
                role_token: Dollar provider
              pay: 100000000
              then: close
              to:
                party:
                  role_token: Ada provider
              token:
                currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
                token_name: Djed_testMicroUSD
            to:
              party:
                role_token: Dollar provider
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

## Transaction 1: Ada provider Creates Swap Contract with Initial ADA

A `HTTP` `POST` request to Marlowe Runtime\'s `/contracts` endpoint will build the creation transaction for a Marlowe contract. We provide it the JSON file containing the contract and tell it the `MIN_LOVELACE` value that we previously chose. Anyone could create the contract, but in this example the lender will be doing so, so we provide their address to fund the transaction and to receive the change from it.

First we create the JSON body of the request to build the creation transaction.


```bash
yaml2json << EOI > request-1.json
version: v1
contract: `cat swap-contract.json`
roles:
  Ada provider: "$ADA_PROVIDER_ADDR"
  Dollar provider: "$USD_PROVIDER_ADDR"
minUTxODeposit: $MIN_LOVELACE
metadata: {}
tags: {}
EOI
cat request-1.json
```

    {"contract":{"timeout":1679669100000,"timeout_continuation":"close","when":[{"case":{"deposits":{"multiply":1000000,"times":294},"into_account":{"role_token":"Ada provider"},"of_token":{"currency_symbol":"","token_name":""},"party":{"role_token":"Ada provider"}},"then":{"timeout":1679673000000,"timeout_continuation":"close","when":[{"case":{"deposits":100000000,"into_account":{"role_token":"Dollar provider"},"of_token":{"currency_symbol":"9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe","token_name":"Djed_testMicroUSD"},"party":{"role_token":"Dollar provider"}},"then":{"from_account":{"role_token":"Ada provider"},"pay":{"multiply":1000000,"times":294},"then":{"from_account":{"role_token":"Dollar provider"},"pay":100000000,"then":"close","to":{"party":{"role_token":"Ada provider"}},"token":{"currency_symbol":"9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe","token_name":"Djed_testMicroUSD"}},"to":{"party":{"role_token":"Dollar provider"}},"token":{"currency_symbol":"","token_name":""}}}]}}]},"metadata":{},"minUTxODeposit":2000000,"roles":{"Ada provider":"addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck","Dollar provider":"addr_test1vpy4n4peh4suv0y55yptur0066j5kds8r4ncnuzm0vpzfgg0dhz6d"},"tags":{},"version":"v1"}


Next we post the request and view the response.


```bash
curl "$MARLOWE_RT_WEBSERVER_URL/contracts" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $ADA_PROVIDER_ADDR" \
  -d @request-1.json \
  -o response-1.json \
  -sS
json2yaml response-1.json
```

    links:
      contract: contracts/c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef%231
    resource:
      contractId: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      txBody:
        cborHex: 86a8008182582081fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb51010d8182582081fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb51010184a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b54cd37a300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a001e84800282005820bf610358ef3035e032f179bffee0de88c48478d4aef7b7b2bcb0d3a7351092bda200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a00102da4a1581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4a14c4164612070726f766964657201a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a00106026a1581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4a14f446f6c6c61722070726f76696465720110a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b906a41111a000a5fbf021a0006ea7f09a1581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4a24c4164612070726f7669646572014f446f6c6c61722070726f7669646572010b582001db059dcfa06dca530a855f5d2faeaa2e64c6ce372e5acf4308a774a07ba64f9f8202590ddd590dda01000033323233223232323232332232323232323232323322323232323232323233322232323232323232322223223232325335001102813263202d33573892010350543500028323232533500313300b49010b4275726e206661696c656400323235004223335530101200132335012223335003220020020013500122001123300101b02e2350012222533530080032103210323500222222222222200a3200135503322533500115021221350022253353301700200713502600113006003300f0021335502c300b49010b4d696e74206661696c656400330163232323500322222222222233355301b120013233501d2233350032200200200135001220011233001225335002103b100103825335333573466e3c03cd400488d4008880080e40e04ccd5cd19b8700e35001223500222001039038103800c3500b220013500a22002500133010335502c33555017237246ecccdd2a400066ae80dd398170009bb102f3355501725335333355300d1200133500e22230033002001200122533500121350032235003223500222350295335333573466e3c0080180cc0c84cd540eccd540ec008cdc0000802801899aa81d80499a81c80200189a81119aa81a001281999919191919191919118011803800990009aa81d11299a800898011801a81d110a99a800880111098031803802990009aa81c91299a8008a81c910a99a800880191099a81e198038020011803000990009aa81c111299a8010800910a99a8018802110a999a99806002001099a81e00219803801802899a81e00119803803000899a81e002198038018029a8019110009a8011110011a80091100199918008009119091a990919980091a801911180180211a801911180100211a8019111800802091a98018021a8020008009801001091111998021299a80089a80a89119801281c800910a99a80089a80b89119801002800910a999a998050020010999803001119a81d80280080089998038011a80c891198010030008008999803001119a81d802800800911299a800899a81c19a81c0018011803281c910a999a99805002801099a81d19a81d0028021804001899980380119a81d002802000899a81d19a81d002802180400191119299a80109800a4c442a666a6601600c004266600e0044600c66a07800e002002260069309998038011180319a81e003800800919a81c98019a80c0911980100300098038011919111a801111a80191912999a999a80d8048028018999a80d8040020008a8010a8010999a80c80380180099999999a80a11199ab9a3370e00400205a05844a66a666ae68cdc3801000816816080c8a99a999ab9a3371200400205a058202e203044666ae68cdc400100081681611199ab9a3371200400205a05844666ae68cdc480100081601691199ab9a3371000400205805a44a66a666ae68cdc48010008168160800880111299a999ab9a3371200400205a0582004200266666666a02602244a66a666ae68cdc7801000816015880c0a99a999ab9a33722004002058056202c202e44666ae68cdc800100081601591199ab9a3372200400205805644666ae68cdc880100081581611199ab9a3372000400205605844a66a666ae68cdc88010008160158800880111299a999ab9a3372200400205805620042002002a03e426a0024466a0660040022a062400266aa05866aaa02e644a66a002420022004a06066aaa02e646446004002640026aa06644a66a0022a0424426a00444a66a6602e00400e26a04c0022600c006601e00466aaa02e400246a002444444444444010a00201426a002440046666ae68cdc39aab9d5003480008cc8848cc00400c008c8c8c8c8c8c8c8c8c8c8c8c8c8cccd5cd19b8735573aa018900011999999999999111111111110919999999999980080680600580500480400380300280200180119a8128131aba1500c33502502635742a01666a04a04e6ae854028ccd540a5d728141aba150093335502975ca0506ae854020cd40940c0d5d0a803999aa814818bad35742a00c6464646666ae68cdc39aab9d5002480008cc8848cc00400c008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a81dbad35742a00460786ae84d5d1280111931902219ab9c04003f042135573ca00226ea8004d5d0a8011919191999ab9a3370e6aae754009200023322123300100300233503b75a6ae854008c0f0d5d09aba2500223263204433573808007e08426aae7940044dd50009aba135744a004464c6408066ae700f00ec0f84d55cf280089baa00135742a00a66a04aeb8d5d0a802199aa81481690009aba150033335502975c40026ae854008c0bcd5d09aba2500223263203c33573807006e07426ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aab9e5001137540026ae85400cc07cd5d09aba2500323263202e3357380540520586666ae68cdc3a80224004424400446666ae68cdc3a802a40004244002464c6405c66ae700a80a40b00ac4d55cf280089baa001135573a6ea8004894cd400440804cd5ce00100f990009aa8131108911299a80089a80191000910999a802910011802001199aa98038900080280200089109198008018010919a800a811281191a800911999a80091931901219ab9c4901024c680001f20012326320243357389201024c680001f2326320243357389201024c680001f22333573466e3c00800406c06848d40048888888801c48888888848cccccccc00402402001c01801401000c008488800c48880084888004894cd400840044050444888c00cc00800448c88c008dd6000990009aa80d911999aab9f0012501c233501b30043574200460066ae880080548c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8068cd5ce00b00a80c09aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500d014357426ae8940088c98c807ccd5ce00d80d00e89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6404266ae7007407007c0780744d55cea80089baa00135742a00466a012eb8d5d09aba2500223263201b33573802e02c03226ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355018223233335573e0044a034466a03266aa036600c6aae754008c014d55cf280118021aba200301313574200224464646666ae68cdc3a800a400046a00e600a6ae84d55cf280191999ab9a3370ea00490011280391931900c19ab9c014013016015135573aa00226ea800448488c00800c44880048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900b19ab9c012011014013012011135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900919ab9c00e00d010135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8040cd5ce00600580709baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c8064cd5ce00a80a00b80b00a80a00980900889aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6402466ae7003803404003c4d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200f33573801601401a01826aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6402066ae7003002c0380340304d55cea80089baa0012323333573466e1d40052002200523333573466e1d40092000200523263200c33573801000e01401226aae74dd500089100109100089000a481035054310011223002001320013550052253350011376200644266ae80d400888cdd2a400066ae80dd480119aba037500026ec401cc01000526112200212212233001004003112212330010030021123230010012233003300200200148920accff338b53d84833cc95e53a921005858d0a499020a4d72058ccaaaccc67e9200335122330024892081fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb5100480088848cc00400c0088005ff81d8799fd8799f581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4ffd8799fa1d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480a0a000ffd87c9f9fd8799fd8799fd87a9f4c4164612070726f7669646572ffd87a9f4c4164612070726f7669646572ffd8799f4040ffd87e9fd87a9f1a000f4240ffd87a9f190126ffffffd87c9f9fd8799fd8799fd87a9f4f446f6c6c61722070726f7669646572ffd87a9f4f446f6c6c61722070726f7669646572ffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ffd87a9f1a05f5e100ffffd87a9fd87a9f4c4164612070726f7669646572ffd87a9fd87a9f4f446f6c6c61722070726f7669646572ffffd8799f4040ffd87e9fd87a9f1a000f4240ffd87a9f190126ffffd87a9fd87a9f4f446f6c6c61722070726f7669646572ffd87a9fd87a9f4c4164612070726f7669646572ffffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ffd87a9f1a05f5e100ffd87980ffffffff1b0000018714500040d87980ffffff1b0000018714147de0d87980ffff81840100d87980821a00100afa1a13a3bd22f5f6
        description: ''
        type: TxBodyBabbage


The identifier for the contract is embedded in the response.


```bash
CONTRACT_ID="$(jq -r '.resource.contractId' response-1.json)"
echo "CONTRACT_ID = $CONTRACT_ID"
```

    CONTRACT_ID = c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1


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
  --required-signer "$ADA_PROVIDER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_1 = $TX_1"
```

    TX_1 = c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef


One can view the transaction on a Cardano explorer and see that the contract has been created and the parties have received their role tokens. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_1?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef?tab=utxo


In particular, we see that the Marlowe contract holds the 2 ada that was set as `MINIMUM_LOVELACE`.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$CONTRACT_ID"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef     1        2000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "bf610358ef3035e032f179bffee0de88c48478d4aef7b7b2bcb0d3a7351092bd"


One can see that the ada and dollar providers have received their role tokens. Note that `4164612070726f7669646572 = "Ada provider`, `4275796572 = Buyer`, and `446f6c6c61722070726f7669646572 = "Dollar provider"` in hexadecimal notation. Also note that `446a65645f746573744d696372 = Djed_testMicroUSD`.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$ADA_PROVIDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef     0        995413303 lovelace + TxOutDatumNone
    c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef     2        1060260 lovelace + 1 bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4.4164612070726f7669646572 + TxOutDatumNone



```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$USD_PROVIDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    81fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb51     2        1000000000 lovelace + TxOutDatumNone
    81fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb51     3        2000000 lovelace + 100000000 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe.446a65645f746573744d6963726f555344 + TxOutDatumNone
    c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef     3        1073190 lovelace + 1 bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4.446f6c6c61722070726f7669646572 + TxOutDatumNone


## View the details of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}` can fetch a contract from the blockchain and return information about it.


```bash
CONTRACT_URL="$MARLOWE_RT_WEBSERVER_URL/`jq -r '.links.contract' response-1.json`"
echo "CONTRACT_URL = $CONTRACT_URL"
```

    CONTRACT_URL = http://127.0.0.1:3780/contracts/c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef%231



```bash
curl -sS "$CONTRACT_URL" | json2yaml
```

    links:
      transactions: contracts/c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef%231/transactions
    resource:
      block:
        blockHeaderHash: 65a52894d0f20909681734f5b5f461e0e24fdc79c9115b8f2b127856ed754378
        blockNo: 757491
        slotNo: 23982361
      continuations: null
      contractId: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      currentContract:
        timeout: 1679669100000
        timeout_continuation: close
        when:
        - case:
            deposits:
              multiply: 1000000
              times: 294
            into_account:
              role_token: Ada provider
            of_token:
              currency_symbol: ''
              token_name: ''
            party:
              role_token: Ada provider
          then:
            timeout: 1679673000000
            timeout_continuation: close
            when:
            - case:
                deposits: 100000000
                into_account:
                  role_token: Dollar provider
                of_token:
                  currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
                  token_name: Djed_testMicroUSD
                party:
                  role_token: Dollar provider
              then:
                from_account:
                  role_token: Ada provider
                pay:
                  multiply: 1000000
                  times: 294
                then:
                  from_account:
                    role_token: Dollar provider
                  pay: 100000000
                  then: close
                  to:
                    party:
                      role_token: Ada provider
                  token:
                    currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
                    token_name: Djed_testMicroUSD
                to:
                  party:
                    role_token: Dollar provider
                token:
                  currency_symbol: ''
                  token_name: ''
      initialContract:
        timeout: 1679669100000
        timeout_continuation: close
        when:
        - case:
            deposits:
              multiply: 1000000
              times: 294
            into_account:
              role_token: Ada provider
            of_token:
              currency_symbol: ''
              token_name: ''
            party:
              role_token: Ada provider
          then:
            timeout: 1679673000000
            timeout_continuation: close
            when:
            - case:
                deposits: 100000000
                into_account:
                  role_token: Dollar provider
                of_token:
                  currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
                  token_name: Djed_testMicroUSD
                party:
                  role_token: Dollar provider
              then:
                from_account:
                  role_token: Ada provider
                pay:
                  multiply: 1000000
                  times: 294
                then:
                  from_account:
                    role_token: Dollar provider
                  pay: 100000000
                  then: close
                  to:
                    party:
                      role_token: Ada provider
                  token:
                    currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
                    token_name: Djed_testMicroUSD
                to:
                  party:
                    role_token: Dollar provider
                token:
                  currency_symbol: ''
                  token_name: ''
      metadata: {}
      roleTokenMintingPolicyId: bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4
      state:
        accounts:
        - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
            - currency_symbol: ''
              token_name: ''
          - 2000000
        boundValues: []
        choices: []
        minTime: 0
      status: confirmed
      tags: {}
      txBody: null
      utxo: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      version: v1


## Transaction 2: The Ada Provider Deposits 294 Ada into the Contract

The ada provider deposits their 294 ada into the contract using Marlowe Runtime\'s `HTTP` `POST` `/contract/{contractId}/transactions` endpoint. The buyer is providing the funding for and receiving the change from this transaction, so we provide their address.

The deposit is represented as JSON input to the contract. The `marlowe-cli input deposit` tool conveniently formats the correct JSON for a deposit.


```bash
marlowe-cli input deposit \
  --deposit-party 'Ada provider' \
  --deposit-account 'Ada provider' \
  --deposit-amount "$LOVELACE_AMOUNT" \
  --out-file input-2.json
json2yaml input-2.json
```

    input_from_party:
      role_token: Ada provider
    into_account:
      role_token: Ada provider
    of_token:
      currency_symbol: ''
      token_name: ''
    that_deposits: 294000000



```bash
yaml2json << EOI > request-2.json
version: v1
inputs: [$(cat input-2.json)]
metadata: {}
tags: {}
EOI
cat request-2.json
```

    {"inputs":[{"input_from_party":{"role_token":"Ada provider"},"into_account":{"role_token":"Ada provider"},"of_token":{"currency_symbol":"","token_name":""},"that_deposits":294000000}],"metadata":{},"tags":{},"version":"v1"}


Next we post the request and store the response.


```bash
curl "$CONTRACT_URL/transactions" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $ADA_PROVIDER_ADDR" \
  -d @request-2.json \
  -o response-2.json \
  -sS
json2yaml response-2.json
```

    links:
      transaction: contracts/c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef%231/transactions/84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58
    resource:
      contractId: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      transactionId: 84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58
      txBody:
        cborHex: 86aa0083825820c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef00825820c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef01825820c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef020d81825820c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef0012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd010183a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a29c39bd0a300581d702ed2631dbb277c84334453c5c437b86325d371f0835a28b910a91a6e011a11a49a000282005820c945bedf448b262fe3e5c36cf3033a4a4914456277f0de38432c4f28bd352ed3a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a00102da4a1581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4a14c4164612070726f76696465720110a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a3b44235c111a0010a9db021a000b1be7031a016dfeec081a016df1970b58209803c3faf27a839c0566e11805efe6850536974ecab7bd13a4bd6fefb5d3f5579fff82d8799fd8799f581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4ffd8799fa1d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480a0a000ffd87c9f9fd8799fd8799fd87a9f4c4164612070726f7669646572ffd87a9f4c4164612070726f7669646572ffd8799f4040ffd87e9fd87a9f1a000f4240ffd87a9f190126ffffffd87c9f9fd8799fd8799fd87a9f4f446f6c6c61722070726f7669646572ffd87a9f4f446f6c6c61722070726f7669646572ffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ffd87a9f1a05f5e100ffffd87a9fd87a9f4c4164612070726f7669646572ffd87a9fd87a9f4f446f6c6c61722070726f7669646572ffffd8799f4040ffd87e9fd87a9f1a000f4240ffd87a9f190126ffffd87a9fd87a9f4f446f6c6c61722070726f7669646572ffd87a9fd87a9f4c4164612070726f7669646572ffffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ffd87a9f1a05f5e100ffd87980ffffffff1b0000018714500040d87980ffffff1b0000018714147de0d87980ffffd8799fd8799f581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4ffd8799fa2d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480d8799fd87a9f4c4164612070726f7669646572ffd8799f4040ffff1a11861580a0a01b0000018713e069d8ffd87c9f9fd8799fd8799fd87a9f4f446f6c6c61722070726f7669646572ffd87a9f4f446f6c6c61722070726f7669646572ffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ffd87a9f1a05f5e100ffffd87a9fd87a9f4c4164612070726f7669646572ffd87a9fd87a9f4f446f6c6c61722070726f7669646572ffffd8799f4040ffd87e9fd87a9f1a000f4240ffd87a9f190126ffffd87a9fd87a9f4f446f6c6c61722070726f7669646572ffd87a9fd87a9f4c4164612070726f7669646572ffffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ffd87a9f1a05f5e100ffd87980ffffffff1b0000018714500040d87980ffff818400019fd8799fd8799fd87a9f4c4164612070726f7669646572ffd87a9f4c4164612070726f7669646572ffd8799f4040ff1a11861580ffffff821a00615dae1a64d611d2f5f6
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
  --required-signer "$ADA_PROVIDER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_2 = $TX_2"
```

    TX_2 = 84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_2?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58?tab=utxo


One can see that the ada provider has approximately 294 ada less than originally.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$ADA_PROVIDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58     0        700685264 lovelace + TxOutDatumNone
    84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58     2        1060260 lovelace + 1 bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4.4164612070726f7669646572 + TxOutDatumNone


The Marlowe contract still has the 2 ada from its creation and an additional 294 ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_2#1"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58     1        296000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "c945bedf448b262fe3e5c36cf3033a4a4914456277f0de38432c4f28bd352ed3"


## View the further progress of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}/transactions/{transactionId}` can fetch a contract from the blockchain and return information about it.


```bash
curl -sS "$CONTRACT_URL"/transactions/"$TX_2" | json2yaml
```

    links: {}
    resource:
      block:
        blockHeaderHash: a8e43ba8381f9c177cb788476bb3143ae122b9251e04d5f6fa74260a9b36e122
        blockNo: 757501
        slotNo: 23982522
      consumingTx: null
      continuations: null
      contractId: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      inputUtxo: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      inputs:
      - input_from_party:
          role_token: Ada provider
        into_account:
          role_token: Ada provider
        of_token:
          currency_symbol: ''
          token_name: ''
        that_deposits: 294000000
      invalidBefore: 2023-03-24T13:48:07Z
      invalidHereafter: 2023-03-24T14:45:00Z
      metadata: {}
      outputContract:
        timeout: 1679673000000
        timeout_continuation: close
        when:
        - case:
            deposits: 100000000
            into_account:
              role_token: Dollar provider
            of_token:
              currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
              token_name: Djed_testMicroUSD
            party:
              role_token: Dollar provider
          then:
            from_account:
              role_token: Ada provider
            pay:
              multiply: 1000000
              times: 294
            then:
              from_account:
                role_token: Dollar provider
              pay: 100000000
              then: close
              to:
                party:
                  role_token: Ada provider
              token:
                currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
                token_name: Djed_testMicroUSD
            to:
              party:
                role_token: Dollar provider
            token:
              currency_symbol: ''
              token_name: ''
      outputState:
        accounts:
        - - - address: addr_test1vqd3yrtjyx49uld43lvwqaf7z4k03su8gf2x4yr7syzvckgfzm4ck
            - currency_symbol: ''
              token_name: ''
          - 2000000
        - - - role_token: Ada provider
            - currency_symbol: ''
              token_name: ''
          - 294000000
        boundValues: []
        choices: []
        minTime: 1679665687000
      outputUtxo: 84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58#1
      status: confirmed
      tags: {}
      transactionId: 84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58
      txBody: null


## Transaction 3: The Dollar Provider deposits 100 Djed into the Contract

The dollar provider deposits their 100 djed into the contract using Marlowe Runtime\'s `HTTP` `POST` `/contract/{contractId}/transactions` endpoint. The buyer is providing the funding for and receiving the change from this transaction, so we provide their address.

The deposit is represented as JSON input to the contract. The `marlowe-cli input deposit` tool conveniently formats the correct JSON for a deposit.


```bash
marlowe-cli input deposit \
  --deposit-party 'Dollar provider' \
  --deposit-account 'Dollar provider' \
  --deposit-token 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe.Djed_testMicroUSD \
  --deposit-amount "$MICROUSD_AMOUNT" \
  --out-file input-3.json
json2yaml input-3.json
```

    input_from_party:
      role_token: Dollar provider
    into_account:
      role_token: Dollar provider
    of_token:
      currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
      token_name: Djed_testMicroUSD
    that_deposits: 100000000



```bash
yaml2json << EOI > request-3.json
version: v1
inputs: [$(cat input-3.json)]
metadata: {}
tags: {}
EOI
cat request-3.json
```

    {"inputs":[{"input_from_party":{"role_token":"Dollar provider"},"into_account":{"role_token":"Dollar provider"},"of_token":{"currency_symbol":"9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe","token_name":"Djed_testMicroUSD"},"that_deposits":100000000}],"metadata":{},"tags":{},"version":"v1"}


Next we post the request and store the response.


```bash
curl "$CONTRACT_URL/transactions" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $USD_PROVIDER_ADDR" \
  -d @request-3.json \
  -o response-3.json \
  -sS
json2yaml response-3.json
```

    links:
      transaction: contracts/c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef%231/transactions/05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e
    resource:
      contractId: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      transactionId: 05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e
      txBody:
        cborHex: 86aa008482582081fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb510282582081fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb510382582084e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e5801825820c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef030d8182582081fdeb10a575ba9998c1229b1b2b6a4006acf4a641a66e13bd787b769cd8fb510212818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd010185a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a3b98370aa200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a00106026a1581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4a14f446f6c6c61722070726f766964657201a300581d70e165610232235bbbbeff5b998b233daae42979dec92a6722d9cda98901821a00133418a1581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fea151446a65645f746573744d6963726f5553441a05f5e1000282005820758d98b7ec8818a2cd32baa416d6a337bcb837a2393815744e3f4935bebedd3ea300581d70e165610232235bbbbeff5b998b233daae42979dec92a6722d9cda989011a118615800282005820366c6e0ba1da1c0fe3488c49fba1f8dcdd6f4dcc723bbd08bc62caf12633facca200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a001e848010a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a3b85f4f3111a0014d50d021a000de35e031a016e0e28081a016df20c0b5820112cfb168c087f362bfc35614652fed9b5834cd42c01cc8edae2438fe68fff1f9fff83d8799f581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a44f446f6c6c61722070726f7669646572ffd8799f581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a44c4164612070726f7669646572ffd8799fd8799f581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4ffd8799fa2d8799fd8799fd87980d8799fd8799f581c1b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59ffd87a80ffffd8799f4040ffff1a001e8480d8799fd87a9f4c4164612070726f7669646572ffd8799f4040ffff1a11861580a0a01b0000018713e069d8ffd87c9f9fd8799fd8799fd87a9f4f446f6c6c61722070726f7669646572ffd87a9f4f446f6c6c61722070726f7669646572ffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ffd87a9f1a05f5e100ffffd87a9fd87a9f4c4164612070726f7669646572ffd87a9fd87a9f4f446f6c6c61722070726f7669646572ffffd8799f4040ffd87e9fd87a9f1a000f4240ffd87a9f190126ffffd87a9fd87a9f4f446f6c6c61722070726f7669646572ffd87a9fd87a9f4c4164612070726f7669646572ffffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ffd87a9f1a05f5e100ffd87980ffffffff1b0000018714500040d87980ffff818400029fd8799fd8799fd87a9f4f446f6c6c61722070726f7669646572ffd87a9f4f446f6c6c61722070726f7669646572ffd8799f581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe51446a65645f746573744d6963726f555344ff1a05f5e100ffffff821a0086c6801a87fd1e38f5f6
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
  --required-signer "$USD_PROVIDER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_3 = $TX_3"
```

    TX_3 = 05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e


One can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_3?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e?tab=utxo


One can see that the dollar provider has exactly 100 djed less than originally.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$USD_PROVIDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e     0        999831306 lovelace + TxOutDatumNone
    05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e     1        1073190 lovelace + 1 bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4.446f6c6c61722070726f7669646572 + TxOutDatumNone


The Marlowe contract has closed, but the roll-payout address holds 100 djed for the benefit of the ada provider.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_3#2"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e     2        1258520 lovelace + 100000000 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe.446a65645f746573744d6963726f555344 + TxOutDatumHash ScriptDataInBabbageEra "758d98b7ec8818a2cd32baa416d6a337bcb837a2393815744e3f4935bebedd3e"


The roll-payout address also holds 294 ada for the benefit of the dollar provider.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --tx-in "$TX_3#3"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e     3        294000000 lovelace + TxOutDatumHash ScriptDataInBabbageEra "366c6e0ba1da1c0fe3488c49fba1f8dcdd6f4dcc723bbd08bc62caf12633facc"


## View the further progress of the contract on the blockchain

Marlowe Runtime\'s `HTTP` `GET` endpoint `/contracts/{contractId}/transactions/{transactionId}` can fetch a contract from the blockchain and return information about it.


```bash
curl -sS "$CONTRACT_URL"/transactions/"$TX_3" | json2yaml
```

    links:
      previous: contracts/c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef%231/transactions/84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58
    resource:
      block:
        blockHeaderHash: c331402d98a3e77d8d78123a915118e39e4acef61613e57cae46cc047d796fb7
        blockNo: 757509
        slotNo: 23982639
      consumingTx: null
      continuations: null
      contractId: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      inputUtxo: 84e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58#1
      inputs:
      - input_from_party:
          role_token: Dollar provider
        into_account:
          role_token: Dollar provider
        of_token:
          currency_symbol: 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe
          token_name: Djed_testMicroUSD
        that_deposits: 100000000
      invalidBefore: 2023-03-24T13:50:04Z
      invalidHereafter: 2023-03-24T15:50:00Z
      metadata: {}
      outputContract: null
      outputState: null
      outputUtxo: null
      status: confirmed
      tags: {}
      transactionId: 05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e
      txBody: null


## Transaction 4: The Ada Provider Withdraws the Dollars

The 100 djed is held at Marlowe's role-payout address for the benefit of the ada provider. The ada provider can withdraw these funds at any time. The contract ID and role name are included in the request body for a withdrawal.


```bash
yaml2json << EOI > request-4.json
contractId: "$CONTRACT_ID"
role: "Ada provider"
EOI
cat request-4.json
```

    {"contractId":"c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1","role":"Ada provider"}


Next we post the request and store the response.


```bash
curl "$MARLOWE_RT_WEBSERVER_URL/withdrawals" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $ADA_PROVIDER_ADDR" \
  -d @request-4.json \
  -o response-4.json \
  -sS
json2yaml response-4.json
```

    links:
      withdrawal: withdrawals/cdd5691e3085d6dd50ac45911b2a6bbd372a232a05a68851263279a568973a37
    resource:
      txBody:
        cborHex: 86a8008382582005b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e0282582084e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e580082582084e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e58020d8182582084e284b1ad405c2b32e4eb4d93c31ec15b10470737716f3461ed0623e8572e580012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd020183a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a29c08003a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a00102da4a1581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4a14c4164612070726f766964657201a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc5901821a0010c52aa1581c9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fea151446a65645f746573744d6963726f5553441a05f5e10010a200581d601b120d7221aa5e7db58fd8e0753e156cf8c38742546a907e8104cc59011a29bb4bb7111a00085019021a00058abb0b58203ac49c838441bdb02d7c570282e1ee5e39d6cc4185accc03aeb9e5601bcdd0129fff81d8799f581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a44c4164612070726f7669646572ff81840000d87980821a0020eb241a2376bbf5f5f6
        description: ''
        type: TxBodyBabbage
      withdrawalId: cdd5691e3085d6dd50ac45911b2a6bbd372a232a05a68851263279a568973a37


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-4.json > tx-4.unsigned
```


```bash
TX_4=$(
marlowe-cli transaction submit \
  --tx-body-file tx-4.unsigned \
  --required-signer "$ADA_PROVIDER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_4 = $TX_4"
```

    TX_4 = cdd5691e3085d6dd50ac45911b2a6bbd372a232a05a68851263279a568973a37


On can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_4?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/cdd5691e3085d6dd50ac45911b2a6bbd372a232a05a68851263279a568973a37?tab=utxo


The ada provider now has the 100 djed.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$ADA_PROVIDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e     4        2000000 lovelace + TxOutDatumNone
    cdd5691e3085d6dd50ac45911b2a6bbd372a232a05a68851263279a568973a37     0        700481539 lovelace + TxOutDatumNone
    cdd5691e3085d6dd50ac45911b2a6bbd372a232a05a68851263279a568973a37     1        1060260 lovelace + 1 bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4.4164612070726f7669646572 + TxOutDatumNone
    cdd5691e3085d6dd50ac45911b2a6bbd372a232a05a68851263279a568973a37     2        1099050 lovelace + 100000000 9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe.446a65645f746573744d6963726f555344 + TxOutDatumNone


## View the withdrawal

Marlowe Runtime\'s `HTTP` `GET` endpoint `/withdrawals/{transactionId}` can fetch a withdrawal from the blockchain and return information about it.


```bash
curl -sS "$MARLOWE_RT_WEBSERVER_URL"/withdrawals/"$TX_4" | json2yaml
```

    block:
      blockHeaderHash: b41c4d2ed3de99126ddfbd379c6e6f4387cbf5bbc8af744a04b66754280bd3ed
      blockNo: 757514
      slotNo: 23982857
    payouts:
    - contractId: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      payout: 05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e#2
      role: Ada provider
      roleTokenMintingPolicyId: bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4
    status: confirmed
    withdrawalId: cdd5691e3085d6dd50ac45911b2a6bbd372a232a05a68851263279a568973a37


## Transaction 5: The Dollar Provider Withdraws the Ada

The 294 ada is held at Marlowe's role-payout address for the benefit of the dollar provider. The dollar provider can withdraw these funds at any time. The contract ID and role name are included in the request body for a withdrawal.


```bash
yaml2json << EOI > request-5.json
contractId: "$CONTRACT_ID"
role: "Dollar provider"
EOI
cat request-5.json
```

    {"contractId":"c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1","role":"Dollar provider"}


Next we post the request and store the response.


```bash
curl "$MARLOWE_RT_WEBSERVER_URL/withdrawals" \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Change-Address: $USD_PROVIDER_ADDR" \
  -d @request-5.json \
  -o response-5.json \
  -sS
json2yaml response-5.json
```

    links:
      withdrawal: withdrawals/315f54a7c39c96f1bcc521954edc5e33b378d3aebfc71f2a1168d358adef5867
    resource:
      txBody:
        cborHex: 86a8008382582005b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e0082582005b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e0182582005b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e030d8182582005b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e0012818258209a8a6f387a3330b4141e1cb019380b9ac5c72151c0abc52aa4266245d3c555cd020182a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a4d193a50a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a101821a00106026a1581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4a14f446f6c6c61722070726f76696465720110a200581d604959d439bd61c63c94a102be0defd6a54b36071d6789f05b7b0224a1011a3b909bb3111a00079b57021a0005123a0b5820424a94276d7c3699508f073d8809325917434fbf05bd0b48f82aba66a55997c49fff81d8799f581cbb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a44f446f6c6c61722070726f7669646572ff81840002d87980821a001b8ea21a1df568ebf5f6
        description: ''
        type: TxBodyBabbage
      withdrawalId: 315f54a7c39c96f1bcc521954edc5e33b378d3aebfc71f2a1168d358adef5867


Once again, use `marlowe-cli` to submit the transaction and then wait for confirmation.


```bash
jq '.resource.txBody' response-5.json > tx-5.unsigned
```


```bash
TX_5=$(
marlowe-cli transaction submit \
  --tx-body-file tx-5.unsigned \
  --required-signer "$USD_PROVIDER_SKEY" \
  --timeout 600 \
| sed -e 's/^TxId "\(.*\)"$/\1/' \
)
echo "TX_5 = $TX_5"
```

    TX_5 = 315f54a7c39c96f1bcc521954edc5e33b378d3aebfc71f2a1168d358adef5867


On can view the transaction on a Cardano explorer. It sometimes takes thirty seconds or so for the transaction to be visible in an explorer.


```bash
echo "$EXPLORER_URL"/transaction/"$TX_5?tab=utxo"
```

    https://preprod.cardanoscan.io/transaction/315f54a7c39c96f1bcc521954edc5e33b378d3aebfc71f2a1168d358adef5867?tab=utxo


The dollar provider now has about an additional 294 ada.


```bash
cardano-cli query utxo --testnet-magic "$CARDANO_TESTNET_MAGIC" --address "$USD_PROVIDER_ADDR"
```

                               TxHash                                 TxIx        Amount
    --------------------------------------------------------------------------------------
    315f54a7c39c96f1bcc521954edc5e33b378d3aebfc71f2a1168d358adef5867     0        1293498960 lovelace + TxOutDatumNone
    315f54a7c39c96f1bcc521954edc5e33b378d3aebfc71f2a1168d358adef5867     1        1073190 lovelace + 1 bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4.446f6c6c61722070726f7669646572 + TxOutDatumNone


## View the withdrawal

Marlowe Runtime\'s `HTTP` `GET` endpoint `/withdrawals/{transactionId}` can fetch a withdrawal from the blockchain and return information about it.


```bash
curl -sS "$MARLOWE_RT_WEBSERVER_URL"/withdrawals/"$TX_5" | json2yaml
```

    block:
      blockHeaderHash: f4a1cfc8471034fcc5f58008909c429e8f9d0bdd8efdb93ab29d2e62b7a0bfa0
      blockNo: 757519
      slotNo: 23982974
    payouts:
    - contractId: c73c08a937cc0244abc28224ee0bd8fddef4c3315a74a9207776dfed87ff11ef#1
      payout: 05b05966afb5d346d3f2a03470df632b5b697265f637d2adb5fcb463bd127f5e#3
      role: Dollar provider
      roleTokenMintingPolicyId: bb7053ce07dda2292f779c92ae789b4c4a99376f5f6d92b5c4a9f6a4
    status: confirmed
    withdrawalId: 315f54a7c39c96f1bcc521954edc5e33b378d3aebfc71f2a1168d358adef5867

