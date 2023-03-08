// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'introduction',
        'getting-started/getting-started-with-the-marlowe-playground',
        'getting-started/writing-marlowe-with-blockly',
        'getting-started/using-the-haskell-editor',
        'getting-started/using-the-javascript-editor',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: false,
      items: [
        'examples/examples_v1',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      items: [
        'tutorials/tutorials-overview',
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
        'tutorials/video-tutorials',
      ],
    },
    {
      type: 'category',
      label: 'Architecture Overview',
      collapsed: false,
      items: [
        'architecture',
      ],
    },
    {
      type: 'category',
      label: 'Developer Tools',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Developers',
        description: 'Learn more about Marlowe\'s ecosystem of developer tools',
      },
      items: [
        'development/deployment-overview',
        'development/dsl',
        'development/marlowe-language-guide',
        'development/platform',
        'development/playground',
        'development/runtime',
        'development/cli',
        'development/dev-resources',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise Integration',
      collapsed: false,
      items: [
        'enterprise/integration',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      collapsed: false,
      items: [
        'support/faq',
        'support/dev-discussions',
        'support/contact',
      ],
    },
  ],
};

module.exports = sidebars;
