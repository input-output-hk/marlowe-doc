## Marlowe Documentation

This repository is aimed to create a user view for some of the existing documentation across multiple repositories:
 - [https://github.com/input-output-hk/marlowe-cardano](https://github.com/input-output-hk/marlowe-cardano)
 - [https://github.com/input-output-hk/real-world-marlowe](https://github.com/input-output-hk/real-world-marlowe)
 - [https://github.com/input-output-hk/marlowe-starter-kit](https://github.com/input-output-hk/marlowe-starter-kit)
 - [https://github.com/input-output-hk/MIPs](https://github.com/input-output-hk/MIPs)


### Configuration

Configurations for the site can be found in `docusaurus.config.js`. It contains a declarative map of assets, plugins, and tuning for our use cases.

Each document contains front matter that can be used to adjust the page layout or sidebar hierarchy.

| Name | Value |
| --- | --- |
| title | string |
| sidebar_position | int |
| hide_table_of_contents | boolean |

New sub-sections should contain a `_categoy_.json` file. If the section contains a markdown file with the same name as the directory, it will route to that path otherwise all other files represent subpaths.

#### Search

Search is done client-sided through a [plugin](https://github.com/easyops-cn/docusaurus-search-local). It is only available after bundling so serving with hot reload via `yarn start` will not have search enabled.

#### Styling

The theme is built on top of Infima which allows overriding of global variables. Although the such variables are not explicitly documented and can be breaking, they can be found in this [Github issue](https://github.com/facebook/docusaurus/issues/3955).


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

### Docker

Use Docker build and serve the documentation to avoid needing local installations of yarn and node.

```
$docker build -t docs .
$ docker run -it -p 8080:8080 docs
```

### Linting

Docusaurus supports broken link checking out of the box although external links will still require additional tooling to verify.

[Vale](https://vale.sh) is used for spell check in addition to linting. This can be used through the `Vale VSCode` extension or from the command line via `vale ./docs`
