# Componente Card Personalizável

Este projeto contém um componente de **Card** personalizável construído com **TypeScript** e **React**. Ele fornece um elemento de interface flexível e reutilizável que pode ser facilmente integrado a diferentes aplicações.

## Recursos

- **Props customizáveis**: O componente Card permite personalizar título, descrição, ícones, cores e tamanhos.
- **Design responsivo**: O componente foi projetado para se adaptar a diferentes tamanhos de tela.
- **Segurança de tipos**: Utiliza TypeScript para garantir tipagem e clareza na API do componente.
- **Integração com Storybook**: Inclui histórias (stories) para demonstrar cenários e variações do componente.
- **Testes unitários**: Existem testes unitários para garantir que o componente se comporte corretamente em diferentes situações.

## Estrutura do projeto

```
custom-card-component
├── src
│   ├── components
│   │   └── Card
│   │       ├── Card.tsx
│   │       ├── Card.types.ts
│   │       ├── Card.styles.module.css
│   │       ├── Card.stories.tsx
│   │       └── Card.test.tsx
│   ├── index.ts
│   ├── utils
│   │   └── classNames.ts
│   └── styles
│       └── tokens.css
├── exemplo
│   ├── src
│   │   └── App.tsx
│   └── package.json
├── .storybook
│   ├── main.js
│   └── preview.js
├── tests
│   └── setupTests.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

## Instalação

Para instalar o projeto, clone o repositório e execute:

```bash
npm install
```

## Uso

Para usar o componente Card na sua aplicação, importe-o assim:

```tsx
import { Card } from 'custom-card-component';
```

Você pode customizar o Card passando as props apropriadas:

```tsx
<Card 
  title="Título do Card" 
  description="Esta é uma descrição." 
  icon="caminho/para/icone" 
  color="blue" 
  size="large" 
/>
```

## Executando o exemplo

Para ver o componente Card em funcionamento, acesse a pasta `exemplo` e execute:

```bash
npm start
```

Isso iniciará um servidor de desenvolvimento onde você poderá ver o Card sendo usado em uma aplicação React simples.

## Testes

Para executar os testes unitários do componente Card, use:

```bash
npm test
```

## Contribuições

Contribuições são bem-vindas! Abra uma issue ou envie um pull request para melhorias ou correções.

## Licença

Licença não especificada.