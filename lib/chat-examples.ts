export type ChatExample = {
  label: string;
  query: string;
};

export const CHAT_EXAMPLES: Record<'tr' | 'en', ChatExample[]> = {
  tr: [
    { label: 'Fatiha 1:7', query: 'Fatiha 1:7' },
    { label: '1:7', query: '1:7' },
    { label: 'Bakara 255', query: 'Bakara 255' },
    { label: 'İhlas 1', query: '112:1' },
  ],
  en: [
    { label: 'Fatiha 1:7', query: 'Fatiha 1:7' },
    { label: '1:7', query: '1:7' },
    { label: 'Baqarah 255', query: 'Bakara 255' },
    { label: 'Al-Ikhlas 1', query: '112:1' },
  ],
};
