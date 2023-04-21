// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: true,
      items: [
        'introduction',
        'getting-started/getting-started-with-the-marlowe-playground',
        'getting-started/writing-marlowe-with-blockly',
        'getting-started/using-the-javascript-editor',
        'getting-started/using-the-haskell-editor',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Examples',
        description: 'Fork and clone the Marlowe starter kit repo, browse the contract gallery',
      },
      items: [
        'examples/examples-starter-kit',
        'examples/examples-contract-gallery',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Tutorials',
        description: 'Learn from Marlowe\'s library of written and video tutorials',
      },
      items: [
        'tutorials/written-tutorials-index',
        'tutorials/video-tutorials-index',
        'tutorials/marlowe-model',
        'tutorials/marlowe-step-by-step',
        'tutorials/escrow-ex',
        'tutorials/marlowe-data',
        'tutorials/embedded-marlowe',
        'tutorials/javascript-embedding',
        'tutorials/playground-overview',
        'tutorials/potential-problems-with-contracts',
        'tutorials/static-analysis',
        'tutorials/actus-marlowe',
        'tutorials/using-marlowe',
        'tutorials/migrating',
      ],
    },
    {
      type: 'category',
      label: 'Platform and Architecture',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Platform and Architecture',
        description: 'Learn about Marlowe\'s platform and architecture',
      },
      items: [
        'architecture',
        'development/platform',
        'development/dsl',
        'development/marlowe-language-guide',
      ],
    },
    {
      type: 'category',
      label: 'Developer Tools',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Developer Tools',
        description: 'Learn more about Marlowe\'s ecosystem of developer tools',
      },
      items: [
        'development/dev-tools-overview',
        'development/deployment-overview-developer-audience',
        'development/playground',
        {
          type: 'category',
          label: 'Runtime',
          link: {
            type: 'generated-index',
            title: 'Runtime',
            description: 'Learn more about Marlowe Runtime',
          },
          items: [
            'development/runtime',
            {
              type: 'category',
              label: 'Runtime protocol reference',
              link: {
                type: 'generated-index',
                title: 'Runtime protocol reference',
                description: 'Learn more about Marlowe Runtime protocol',
              },
                  items: [
                   'development/runtime-protocol-reference',
                   'development/marlowesync-subprotocol',
                   'development/marloweheadersync-subprotocol',
                   'development/marlowequery-subprotocol',
                   'development/txjob-subprotocol',
                  ],
            },
            {
              type: 'category',
              label: 'Runtime internals',
              link: {
                type: 'generated-index',
                title: 'Runtime internals',
                description: 'Learn more about Marlowe Runtime internals',
              },
                  items: [
                    `development/runtime-internals`,
                    `development/marlowe-chain-indexer`,
                    `development/marlowe-chain-sync`,
                    `development/marlowe-indexer`,
                    `development/marlowe-sync`,
                    `development/marlowe-tx`,
                    `development/marlowe-proxy`,
                  ],
            },
            'development/runtime-rest-api',
            {
              type: 'category',
              label: 'Marlowe Runtime CLI',
              link: {
                type: 'generated-index',
                title: 'Marlowe Runtime CLI',
                description: 'Learn more about Marlowe Runtime CLI',
              },
                  items: [
                   `development/marlowe-runtime-cli`,
                   'development/create',
                   'development/advance',
                   'development/choose',
                   'development/deposit',
                   'development/notify',
                   `development/apply`,
                   `development/withdraw`,
                   `development/submit`,
                   `development/log`,
                  ],
            },
            {
              type: 'category',
              label: 'Clients of Runtime',
              link: {
                type: 'generated-index',
                title: 'Clients of Runtime',
                description: 'Learn more about examples of using the Runtime services',
              },
                  items: [
                   'development/clients-of-runtime',
                   'development/finder',
                   'development/scaling',
                   'development/oracle',
                   'development/pipe',
                  ],
            },
            'development/cloud-hosted-runtime-extension',
            'development/runtime-tutorial-actus-pam',
            'development/deploying-runtime-with-docker',
          ]
        },
        'development/cli',
        'development/dev-resources',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Support',
        description: 'Check out our FAQ, developer discussions, and do not hesitate to contact us',
      },
      items: [
        'support/dev-discussions',
        'support/contact',
      ],
    },
  ],
};

module.exports = sidebars;
