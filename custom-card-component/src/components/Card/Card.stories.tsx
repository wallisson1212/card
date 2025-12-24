import React from 'react';
import Card from './Card';
import { CardProps, CardVariant } from './Card.types';
const storyAction = (name: string) => () => console.log(name);

export default {
  title: 'Components/Card',
  component: Card,
} as const;

export const Default = {
  render: (args: CardProps) => <Card {...args} />,
  args: {
    title: 'Default Card',
    description: 'This is a default card description.',
    icon: null,
    color: 'light',
    size: 'medium',
    onClick: storyAction('clicked'),
  },
};

export const Bordered = {
  render: (args: CardProps) => <Card {...args} />,
  args: {
    title: 'Bordered Card',
    description: 'This card has a border.',
    icon: null,
    color: 'light',
    size: 'medium',
    bordered: true,
    onClick: storyAction('clicked'),
  },
};

export const Filled = {
  render: (args: CardProps) => <Card {...args} />,
  args: {
    title: 'Filled Card',
    description: 'This card is filled with color.',
    icon: null,
    color: 'primary',
    size: 'medium',
    filled: true,
    onClick: storyAction('clicked'),
  },
};

export const WithIcon = {
  render: (args: CardProps) => <Card {...args} />,
  args: {
    title: 'Card with Icon',
    description: 'This card includes an icon.',
    leftIcon: <span>🌟</span>,
    color: 'light',
    size: 'md',
    onClick: storyAction('clicked'),
  },
};

export const WithActions = {
  render: (args: CardProps) => <Card {...args} />,
  args: {
    title: 'Card com Ações',
    description: 'Clique em baixar para salvar o card.',
    leftIcon: <span>🌟</span>,
    size: 'md',
    showActions: true,
    onEdit: storyAction('edit'),
    downloadFileName: 'meu-card.html',
  },
};

export const Gallery = () => {
  const sizes = ['xsm','sm','md','lg','xl','xxl'] as const;
  const variants = ['bordered','borderless','filled','transparent','outlined'] as const;
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
      {sizes.map((s) => (
        <div key={s}>
          <h4>{s}</h4>
          <Card title={`Size ${s}`} description="Example" size={s} leftIcon={<span>🌟</span>} />
        </div>
      ))}
      {variants.map((v) => (
        <div key={v}>
          <h4>{v}</h4>
          <Card title={`${v}`} description="Variant" variant={v as CardVariant} leftIcon={<span>🌟</span>} />
        </div>
      ))}
    </div>
  );
};