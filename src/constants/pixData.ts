export const PIX_PAYMENT_DATA = {
  title: 'Pagamento via Pix',
  receiverName: 'Maicon Cezar Barroso',
  receiverBank: 'PagSeguro S.A.',
  pixKey: '11660691761',
  pixKeyType: 'CPF',
  copyButtonLabel: 'COPIAR CHAVE PIX',
  copySuccessMessage: 'Chave Pix copiada com sucesso!',
  assistantMessage:
    'Olá! Para fazer o pagamento via Pix, é só apertar o botão Copiar chave Pix e realizar o pagamento pelo aplicativo do seu banco.',
  assistantAvatarUrl: '/src/assets/images/virtual_assistant_avatar_1795186624290.jpg',
  footerText: 'Pagamento seguro e prático. Obrigado pela preferência!',
} as const;

export interface BankAppOption {
  id: string;
  name: string;
  scheme: string;
  accentHex: string;
  shortLabel: string;
}

export const BANK_APPS: BankAppOption[] = [
  {
    id: 'pagbank',
    name: 'PagBank',
    scheme: 'pagbank://',
    accentHex: '#00A88F',
    shortLabel: 'PB',
  },
  {
    id: 'nubank',
    name: 'Nubank',
    scheme: 'nubank://',
    accentHex: '#820AD1',
    shortLabel: 'Nu',
  },
  {
    id: 'itau',
    name: 'Itaú',
    scheme: 'itau://',
    accentHex: '#EC7000',
    shortLabel: 'It',
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    scheme: 'bradesco://',
    accentHex: '#CC092F',
    shortLabel: 'Br',
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    scheme: 'bb://',
    accentHex: '#0038A8',
    shortLabel: 'BB',
  },
  {
    id: 'caixa',
    name: 'Caixa',
    scheme: 'caixa://',
    accentHex: '#005CA9',
    shortLabel: 'Cx',
  },
  {
    id: 'santander',
    name: 'Santander',
    scheme: 'santander://',
    accentHex: '#EC0000',
    shortLabel: 'Sa',
  },
  {
    id: 'inter',
    name: 'Inter',
    scheme: 'bancointer://',
    accentHex: '#FF7A00',
    shortLabel: 'In',
  },
  {
    id: 'picpay',
    name: 'PicPay',
    scheme: 'picpay://',
    accentHex: '#11C76F',
    shortLabel: 'PP',
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    scheme: 'mercadopago://',
    accentHex: '#009EE3',
    shortLabel: 'MP',
  },
];

export const PAYMENT_STEPS = [
  {
    step: '01',
    text: 'Clique em COPIAR CHAVE PIX.',
  },
  {
    step: '02',
    text: 'Abra o aplicativo do seu banco.',
  },
  {
    step: '03',
    text: 'Cole a chave Pix e confirme o pagamento.',
  },
] as const;
