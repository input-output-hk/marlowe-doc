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
            'development/deploying-marlowe-runtime',
            'development/using-marlowe-runtime',
            'development/runtime-protocol-reference',
            'development/runtime-executables-for-backend-services',
            'development/marlowe-runtime-cli',
            'development/marlowe-web-server',
            'development/clients-of-runtime',
            'development/txpipe-and-demeter',
            'development/runtime-tutorial-actus-pam',
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
