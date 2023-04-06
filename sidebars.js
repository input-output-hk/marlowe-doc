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
        'examples/examples_v1',
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
        'tutorials/tutorials-overview',
        'tutorials/written-tutorials-index',
        'tutorials/video-tutorials-index',
        'tutorials/escrow-ex',
        'tutorials/marlowe-model',
        'tutorials/marlowe-step-by-step',
        'tutorials/playground-blockly',
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
      label: 'Architecture Overview',
      collapsed: true,
      items: [
        'architecture',
      ],
    },


    {
      type: 'category',
      label: 'Developer Tools',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Developers',
        description: 'Learn more about Marlowe\'s ecosystem of developer tools',
      },
      items: [
        'development/dev-tools-overview',
        {
          type: 'category',
          label: 'Deployment Overview',
          collapsed: true,
          items: [
            'development/deployment-overview',
            'development/deployment-overview-low-code-audience',
            'development/deployment-overview-developer-audience',
          ],
        },
        'development/dsl',
        'development/marlowe-language-guide',
        'development/platform',
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

            'development/rest-api',

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


            'development/marlowe-web-server',
            'development/clients-of-runtime',
            'development/txpipe-and-demeter',
            'development/runtime-tutorial-actus-pam',
            'development/deploying-marlowe-runtime',
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
        'support/faq',
        'support/dev-discussions',
        'support/contact',
      ],
    },
  ],
};

module.exports = sidebars;
