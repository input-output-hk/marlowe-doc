Documentation site map

* Getting Started
   * Introducing Marlowe
   * Getting started with the Marlowe Playground
   * Writing Marlowe with Blockly
   * Using the JavaScript Editor
   * Using the Haskell Editor

* Examples
   * Example contracts
      * Marlowe starter kit repo
         * Zero-coupon bond
         * Escrow
         * Swap
   * Contract gallery

* Tutorials 
   * Tutorials overview
   * Written tutorials index
      * 13 written tutorials
   * Video tutorials index
      * 80 videos in nine sections

* Architecture Overview
   * TBD

* Developer Tools
   * Development and deployment overview
      * Low-code audience
      * Developer audience
   * Domain Specific Language
   * Marlowe language guide
   * Platform
   * Marlowe Playground
   * Marlowe Runtime
      * Runtime overview
      * Deploying Runtime
      * Using Runtime
      * Runtime executables for Backend Services
      * Runtime CLI
      * Marlowe web server
      * Clients of Runtime
      * Runtime examples
      * TxPipe and Demeter [placeholder]
      * Runtime tutorial
   * Marlowe CLI
   * Resources

* Support
   * FAQ
   * Developer discussions
   * Contact us

---

# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

#### Updating Yarn to the latest version

Currently the latest major version is Yarn v3. Run the following command to update your environment to this version: 

```
$ yarn set version stable
```

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
