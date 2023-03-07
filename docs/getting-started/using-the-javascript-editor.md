---
title: Using the Javascript Editor
sidebar_position: 1
---

## About the Marlowe library, JavaScript, and TypeScript

Even though we use the term "JavaScript," the Marlowe *Script framework* is written in TypeScript. Although JavaScript is a subset of TypeScript, a programmer who knows no TypeScript cannot really read the Marlowe "JavaScript" code. 

## For experienced JavaScript developers

You can use the embedded JavaScript editor to write Marlowe code.

To use the editor follow these steps:

1. Open the [Marlowe Playground](https://play.marlowe-finance.io/#/).

2. Click the **Start in Javascript** icon.

      You will see a window like this:
      
![Java Script](../../static/img/javascript.jpg)

3. You can import values and functions from the provided library written in TypeScript. They can be used to generate Marlowe smart contracts from TypeScript or JavaScript.  

4. Describe a contract in the editor, alternatively, you can upload an example written in JavaScript. The last expression in the file needs to be of type `Contract`: below we define the top-level constant `contract` to be of that type.

![JS](../../static/img/detail-js-contract.png)

5. Click **Compile** to convert this contract from Javascript into Marlowe. 

6. Then click **Send to Simulator** in the top right-hand corner. 

    You can also find more details about simulation in the [Marlowe embedded in JavaScript tutorial](tutorials/javascript-embedding.md). 
    