import { NavigationTab } from './chatTypes';

export const CURRENT_USER = {
  id: 'chef_joao',
  name: 'Chef João',
  role: 'Chef Executivo',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5exVJnqTzfwdIj9Y_Zio-1mNcuWHy0rqggzxpJjewgexJujKpffBZh7kYFSUq_k0b9f4htgEIg24N3-H8nmbKW7HwAZnNMEIytyHpa4-8LmPHRsWMUpbxUWJUKtnX8mDi2siC-AsxO0r6J4X97XBF4RLz6s123YT-A60-eYE2jAT1DhpNNcG7CqUNJdpIFPpt735ZUGvHQMbP5Mpgy-XKzxR5SU9hjIKetvJjCS-0gjh5A5sMpe1Y7wVADOnitjkaufq2RWa7F512'
};

export const INITIAL_CHATS = [
  {
    id: '1',
    user: {
      id: 'patio',
      name: 'Restaurante O Pátio',
      role: 'Restaurante',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjB_4abCuDKiaGhtLrpNO8Z1pnSKVK3lVAWqhGQzasA1Rys4rbNMOm-tvDndkuHJK32hhj70FEM4emwhPRpKLcWCR84cIAg0JtCJdZWp2RITxvb3x_gPDGGGrsv07TeuxT7suahUajGTr3RRCCN3EH8pbH4ds1_sGUFwJ3MhlXul9KktI9Pcv28Uz4rc_uMCRootxaElzmsWidpt3xy79o7FY4cTgAuPLkKXaPuPIIX-PaJs4__LBliKDRvmn68ChMCSA-hXL20Yey',
      isOnline: true
    },
    lastMessage: 'Olá, ainda tens aquele fornecedor?',
    lastTimestamp: '10:30',
    messages: [
      { id: 'm1', senderId: 'patio', text: 'Bom dia, Chef João! Tudo bem? Estamos a precisar de renovar o stock de peixe para o fim de semana.', timestamp: '10:15' },
      { id: 'm2', senderId: 'chef_joao', text: 'Bom dia! Claro. O que precisam exatamente?', timestamp: '10:22', status: 'read' },
      { id: 'm3', senderId: 'patio', text: 'Principalmente robalo e dourada. Cerca de 10kg de cada seria perfeito.', timestamp: '10:30' },
      { id: 'm4', senderId: 'patio', text: 'Ah, e olá, ainda tens aquele contacto do fornecedor de peixe do norte? O Sr. Costa?', timestamp: '10:31' }
    ]
  },
  {
    id: '2',
    user: {
      id: 'grupo',
      name: 'Grupo de Cozinheiros',
      role: 'Comunidade',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjEqjo8pdK8-6YajiBROUAyiYli045zvVqSOQi4csDYv_UCyIrSzZipL7eCBXf83ktt8hbUUgSudSbOXjJcvbPuqGirawiBG-1fo-fCLPVHZDSZ4O3YauHSA-ZGuV46vq8VHb-OuzLkcPLGwZjGHSPISVx9P46vj85bNLIO-TZAKDH6e1TOaEBx6f6svH6ZAF-tQ8SWKuWjJYvgkkQbLux00wJqbdsUr53T7bNj-IrmKZiwNlv4Le8IICaJh7JUznons2zUCruyfB1'
    },
    lastMessage: 'Alguém sabe onde comprar açafrão?',
    lastTimestamp: '09:15',
    unreadCount: 3,
    messages: []
  },
  {
    id: '3',
    user: {
      id: 'marta',
      name: 'Marta Silva',
      role: 'Cozinheira',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbnnjlX0UccAdC0L_RnF_QybKVdT1vzLu2ycxm7MAn_R9K6lOW_7eM_YApV2DW7GwmGUCTbmJssfEP_-vKDlIvwCcSDhqjHKqqNs-kCNDimYzg0SI7qxpnoiT6nnYLZ207DkjyIkeohEABdoMkTToBjiQiebAvQ5d09NTudd-EO4Rvv2UNy9CqIgyJen7JYb10FpAO3YdVVsKbtn_KyOLJYJwIVubfa8AtoSRBQ8FhKymchWzKv9zhJR_XS-dJdisSvJLUz2vLKJt1'
    },
    lastMessage: 'A escala para a próxima semana já saiu.',
    lastTimestamp: 'Ontem',
    messages: []
  }
];

export const NAV_ITEMS = [
  { id: NavigationTab.Home, label: 'Home', icon: 'home' },
  { id: NavigationTab.Community, label: 'Comunidade', icon: 'group' },
  { id: NavigationTab.Messages, label: 'Mensagens', icon: 'chat_bubble' },
  { id: NavigationTab.Jobs, label: 'Empregos', icon: 'work' }
];
