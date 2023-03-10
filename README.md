* Home
   * Core messaging for Marlowe docs landing page
   * About Marlowe
   * Working with Marlowe

* Getting Started
   * Introducing Marlowe
   * Getting started with the Marlowe Playground
   * Writing Marlowe with Blockly
   * Using the Haskell Editor
   * Using the JavaScript Editor

* Examples
   * Example Contracts
      * Zero-coupon bond
      * Swap
      * Escrow

* Tutorials 
   * Written tutorials
   * Video tutorials

* Architecture Overview
   * TBD

* Developer Tools
   * Development and Deployment Overview
   * Domain Specific Language
   * Marlowe language guide
   * Platform
   * Marlowe Playground
   * Marlowe Runtime
   * Marlowe CLI
   * Resources

* Enterprise Integration
   * Business value
   * Integration with existing systems
   * Time to value
   * Technical feasibility
   * Scalability
   * Risk and security
   * User adoption, effort required
   * Maintenance and support
   * Compliance
   * Flexibility and adaptability to changing business needs

* Support
   * FAQ
   * Developer discussions
   * Contact us

---

# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

#### For a Nix environment

```
$ nix-shell -p yarn
$ yarn install
```

#### For a non-Nix environment

```
$ yarn install
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
