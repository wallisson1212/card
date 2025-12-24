module.exports = {
  stories: ['../src/components/Card/Card.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: '@storybook/react',
  typescript: {
    check: false,
  },
};