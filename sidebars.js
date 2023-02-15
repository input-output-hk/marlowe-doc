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
        'getting-started-with-the-marlowe-playground',
        'marlowe-language-guide',
        'writing-marlowe-with-blockly',
        'using-the-haskell-editor',
        'architecture',
        'contributing',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      items: [
        'tutorials/escrow',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: false,
      items: [
        'examples/cli-cookbook',
        'examples/contract-examples',
        'examples/runtime-examples',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Developers',
        description: 'Learn more about Marlowe\'s ecosystem of developer tools',
      },
      items: [
        'development/dsl',
        'development/platform',
        'development/playground',
        'development/runtime',
        'development/cli',
        'development/lambda',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise',
      collapsed: false,
      items: [
        'enterprise/integration',
      ],
    },
    'faq',
  ],
};

module.exports = sidebars;
