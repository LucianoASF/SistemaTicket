export const currentUser = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@empresa.com',
  role: 'admin',
};

export const users = [
  currentUser,
  {
    id: 'user-2',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    role: 'support',
  },
  {
    id: 'user-3',
    name: 'Pedro Costa',
    email: 'pedro@empresa.com',
    role: 'user',
  },
  {
    id: 'user-4',
    name: 'Ana Oliveira',
    email: 'ana@empresa.com',
    role: 'support',
  },
];

export const projects = [
  {
    id: 'proj-1',
    name: 'Website Principal',
    description: 'Sistema principal da empresa',
    ticketCount: 12,
  },
  {
    id: 'proj-2',
    name: 'App Mobile',
    description: 'Aplicativo móvel iOS e Android',
    ticketCount: 8,
  },
  {
    id: 'proj-3',
    name: 'API Backend',
    description: 'Serviços de API REST',
    ticketCount: 5,
  },
];

export const tickets = [
  {
    id: 'TKT-001',
    title: 'Erro ao fazer login no sistema',
    description:
      'Usuários estão reportando erro 500 ao tentar fazer login. O problema ocorre de forma intermitente, principalmente durante horários de pico. Já verificamos os logs do servidor e parece estar relacionado com timeout de conexão com o banco de dados.',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    author: users[2],
    assignee: users[1],
    comments: [
      {
        id: 'cmt-1',
        ticketId: 'TKT-001',
        author: users[1],
        content:
          'Estou investigando o problema. Parece ser um problema de pool de conexões.',
        createdAt: '2024-01-15T11:00:00Z',
      },
      {
        id: 'cmt-2',
        ticketId: 'TKT-001',
        author: users[0],
        content:
          'Prioridade máxima para este ticket. Está afetando muitos usuários.',
        createdAt: '2024-01-15T11:30:00Z',
      },
    ],
    activities: [
      {
        id: 'act-1',
        ticketId: 'TKT-001',
        action: 'Ticket criado',
        author: users[2],
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: 'act-2',
        ticketId: 'TKT-001',
        action: 'Atribuído para',
        author: users[0],
        details: 'Maria Santos',
        createdAt: '2024-01-15T10:35:00Z',
      },
      {
        id: 'act-3',
        ticketId: 'TKT-001',
        action: 'Prioridade alterada para',
        author: users[0],
        details: 'Alta',
        createdAt: '2024-01-15T11:00:00Z',
      },
    ],
  },
  {
    id: 'TKT-002',
    title: 'Adicionar filtro de data no relatório',
    description:
      'Precisamos adicionar um filtro de intervalo de datas no relatório de vendas para facilitar a análise dos dados.',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
    author: users[0],
    assignee: users[3],
    comments: [
      {
        id: 'cmt-3',
        ticketId: 'TKT-002',
        author: users[3],
        content: 'Já iniciei o desenvolvimento. Previsão de entrega: amanhã.',
        createdAt: '2024-01-15T10:00:00Z',
      },
    ],
    activities: [
      {
        id: 'act-4',
        ticketId: 'TKT-002',
        action: 'Ticket criado',
        author: users[0],
        createdAt: '2024-01-14T09:00:00Z',
      },
      {
        id: 'act-5',
        ticketId: 'TKT-002',
        action: 'Status alterado para',
        author: users[3],
        details: 'Em Progresso',
        createdAt: '2024-01-15T09:00:00Z',
      },
    ],
  },
  {
    id: 'TKT-003',
    title: 'Atualizar documentação da API',
    description:
      'A documentação da API está desatualizada. Precisamos adicionar os novos endpoints e atualizar os exemplos de uso.',
    status: 'open',
    priority: 'low',
    createdAt: '2024-01-13T14:00:00Z',
    updatedAt: '2024-01-13T14:00:00Z',
    author: users[1],
    comments: [],
    activities: [
      {
        id: 'act-6',
        ticketId: 'TKT-003',
        action: 'Ticket criado',
        author: users[1],
        createdAt: '2024-01-13T14:00:00Z',
      },
    ],
  },
  {
    id: 'TKT-004',
    title: 'Otimizar performance da página inicial',
    description:
      'A página inicial está demorando mais de 5 segundos para carregar. Precisamos otimizar as imagens e reduzir o número de requisições.',
    status: 'closed',
    priority: 'high',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T17:00:00Z',
    author: users[2],
    assignee: users[1],
    comments: [
      {
        id: 'cmt-4',
        ticketId: 'TKT-004',
        author: users[1],
        content:
          'Implementei lazy loading nas imagens e minifiquei os assets. Tempo de carregamento reduzido para 1.5s.',
        createdAt: '2024-01-12T16:00:00Z',
      },
    ],
    activities: [
      {
        id: 'act-7',
        ticketId: 'TKT-004',
        action: 'Ticket criado',
        author: users[2],
        createdAt: '2024-01-10T08:00:00Z',
      },
      {
        id: 'act-8',
        ticketId: 'TKT-004',
        action: 'Status alterado para',
        author: users[1],
        details: 'Fechado',
        createdAt: '2024-01-12T17:00:00Z',
      },
    ],
  },
  {
    id: 'TKT-005',
    title: 'Bug no carrinho de compras',
    description:
      'Ao adicionar mais de 10 itens no carrinho, o total não é calculado corretamente.',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    author: users[3],
    assignee: users[1],
    comments: [],
    activities: [
      {
        id: 'act-9',
        ticketId: 'TKT-005',
        action: 'Ticket criado',
        author: users[3],
        createdAt: '2024-01-15T08:00:00Z',
      },
    ],
  },
  {
    id: 'TKT-006',
    title: 'Implementar modo escuro',
    description: 'Adicionar suporte para modo escuro em toda a aplicação.',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z',
    author: users[0],
    comments: [],
    activities: [
      {
        id: 'act-10',
        ticketId: 'TKT-006',
        action: 'Ticket criado',
        author: users[0],
        createdAt: '2024-01-12T11:00:00Z',
      },
    ],
  },
  {
    id: 'TKT-007',
    title: 'Corrigir layout responsivo no mobile',
    description:
      'O menu lateral não está funcionando corretamente em dispositivos móveis.',
    status: 'closed',
    priority: 'medium',
    createdAt: '2024-01-08T15:00:00Z',
    updatedAt: '2024-01-09T10:00:00Z',
    author: users[2],
    assignee: users[3],
    comments: [],
    activities: [
      {
        id: 'act-11',
        ticketId: 'TKT-007',
        action: 'Ticket criado',
        author: users[2],
        createdAt: '2024-01-08T15:00:00Z',
      },
      {
        id: 'act-12',
        ticketId: 'TKT-007',
        action: 'Status alterado para',
        author: users[3],
        details: 'Fechado',
        createdAt: '2024-01-09T10:00:00Z',
      },
    ],
  },
  {
    id: 'TKT-008',
    title: 'Adicionar exportação para Excel',
    description:
      'Usuários precisam exportar relatórios em formato Excel além do PDF existente.',
    status: 'open',
    priority: 'low',
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
    author: users[1],
    comments: [],
    activities: [
      {
        id: 'act-13',
        ticketId: 'TKT-008',
        action: 'Ticket criado',
        author: users[1],
        createdAt: '2024-01-14T16:00:00Z',
      },
    ],
  },
];
