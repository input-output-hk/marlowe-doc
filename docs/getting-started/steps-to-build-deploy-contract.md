---
title: Steps to build and deploy a smart contract
sidebar_position: 8
---

This is an explanation of the process of building a smart contract in Marlowe from start to deployment on the preview or pre-production network of the Cardano blockchain. 

## Building a smart contract

Creating a smart contract involves the following stages: 
* Conceptualization
* Design
* Development
* Simulation and testing

### Conceptualization

Take the time to think through what exactly you want your smart contract to accomplish. Carefully consider what the key advantages would be of conducting your transaction with a smart contract on the blockchain. Here are some essential questions to ask yourself as you conceptualize your contract: 
* What is the central purpose of your smart contract? For example, it could be to facilitate a transaction or to enforce an agreement. 
* Who are your participants? 
* What roles and responsibilities will each of them they have? 
* What conditions need to be met along the way in order for the contract to proceed through each stage? 
* Think about the logic that the contract will need to take into account in the scenario where one or more participants do not fulfill their obligations. How will you protect your interests? 
* What conditions need to be part of the contract so that each participant is assured that the terms are fair and reasonable? 
* Will you need to take into account any external data or events? If so, how will you handle those factors? 

### Design

After completing the conceptualization stage, you can start designing your smart contract. 

- **Structure**: Layout the structure of your contract. Think about the sequence of actions that will be involved. How will funds need to be handled at each stage? 
- **Roles**: Define each participant’s role, such as buyer, seller, and intermediary. What actions will each role need to take for each stage of the contract? 
- **Conditions**: Define any conditions that will need to be met before the next stage of the contract can be executed. Take into account issues such as dates, events, and choices. Could certain conditions arise that would require the contract to be canceled? Consider what outcomes the contract participants would require to avoid any undesired outcomes. 
- **Inputs and outputs**: What inputs and outputs will your contract require? Inputs could be choices, deposits of funds, or data from an oracle. Outputs could be transactions that result in funds being sent to specified participant addresses. 
- **Authorizations**: What sort of authorizations would be required for each contract participant? For example, a public key authorization or a role token authorization. 
- **User experience**: What sort of user experience do you want your contract participants to have? Consider whether or not you want to bring a layer of web development into your contract. For example, you could take advantage of functionalities offered by the Marlowe TypeScript SDK to integrate smart contract capabilities into web pages. 

### Development

As you prepare to start creating the code for your smart contract, take into account what skills you have or the skills of your team members if it is a collaborative effort. 

The Marlowe platform provides the [**Playground**](https://play.marlowe.iohk.io/) where you can use the visual approach with Blockly to drag and drop contract components. Building your contract with Blockly frees you from writing any code. Or you could write code in the Playground using JavaScript, Haskell or the Marlowe DSL. 

Please see these resources for more detailed information about working with the Playground: 

* [**Developer tools > Marlowe Playground**](https://docs.marlowe.iohk.io/docs/developer-tools/playground)
* [**Tutorials > Overview of the Marlowe Playground**](https://docs.marlowe.iohk.io/tutorials/concepts/playground-overview)

### Simulation and testing

Devote time and effort towards testing your contract in the Playground. Simulation and testing are a critical part of your smart contract development. Simulating your contract allows you to test various possible pathways and scenarios to make sure that your contract behaves as expected. 

The simulation will help to reveal any errors in your contract such as failing to make a payment. You can also verify that a refund occurs if certain conditions are met. If you do not include a timeout, simulating the contract will help to reveal this. For example, if a participant fails to make a deposit, the contract should include a timeout. 

#### To simulate your contract

1. With your contract open in the Playground, select ‘Send to Simulator’ in the upper right area. A panel opens where you can specify deadline parameters and ada amounts. 
2. Step through the contract’s execution and test various choices, examining different potential pathways. This will give you insight into how your contract will behave under different conditions. 

## Deploying a smart contract

Use Marlowe Runner to deploy your smart contract to the blockchain. Marlowe Runner streamlines and simiplifies the process of deploying smart contracts on Cardano. It eliminates the need for low-level tools and deploying your own backend Runtime instance. 

#### To deploy your contract

1. With your contract open in the Playground, select ‘Send to Simulator,’ then ‘Export to Marlowe Runner.’ A window displays prompting you to select either the pre-production or preview network for deployment. After you make your selection, Playground generates and exports the JSON file directly to Marlowe Runner. Runner automatically displays in a browser window and prompts you to choose a wallet. 
2. Make your wallet selection. Make sure that your wallet is connected to the same network that you selected for your contract deployment. Runner displays the source code for your contract. 
3. In the ‘Add tags’ field, enter a name for your contract. 
4. Click ‘Submit contract.’ Depending on the details of your contract, you may be prompted to specify addresses for borrower and lender, or you may be prompted to confirm the transaction with your wallet. 
5. Follow the prompts. The Runner displays a list view that shows the current status of your contract. The status shown under the Actions column will update as your contract progresses. 
6. When ‘Advance’ displays under the Action column for your contract, select ‘Advance’ to proceed. The Source graph page displays. The source graph will show the possible execution paths of your contract. 
7. Below the source graph, the next available action will be reflected, such as a deposit, for example. Runner is designed to prompt you through the execution of your contract. 
8. Continue to follow the prompts, using your wallet password to authorize transactions for your role. 

From the Runner page that lists pending transactions, when the 'Action' column indicates a status of ‘Complete,’ select the Contract Id link to view your transaction in the source graph page. It will show the execution path of your contract. 

Confirm transactions by checking your wallet’s transaction history. 

For further details, please see the [**Runner**](https://docs.marlowe.iohk.io/docs/getting-started/runner) documentation page. 

