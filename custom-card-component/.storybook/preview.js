import { addParameters } from '@storybook/react';

addParameters({
  options: {
    storySort: {
      order: ['Introduction', 'Components', 'Card'],
    },
  },
  backgrounds: [
    { name: 'light', value: '#ffffff', default: true },
    { name: 'dark', value: '#000000' },
  ],
});