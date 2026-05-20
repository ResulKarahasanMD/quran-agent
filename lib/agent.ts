import { LRUCache } from 'lru-cache';
import {
  DEFAULT_EN_AUTHOR,
  DEFAULT_TR_AUTHOR,
  fetchRootConcordance,
  fetchVerse,
  fetchWords,
} from './acikkuran';
import type {
  AgentResponse,
  ConcordancePart,
  ConnectionData,
  ProseData,
  VerseData,
  WordData,
} from '@/types/acikkuran';

const concordanceCache = new LRUCache<string, ConcordancePart[]>({
  max: 100,
  ttl: 5 * 60 * 1000,
});

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count += 1;
  return true;
}

const SURAH_ALIASES: Record<string, number> = {
  fatiha: 1,
  fatihah: 1,
  bakara: 2,
  baqara: 2,
  baqarah: 2,
  aliimran: 3,
  'ali-imran': 3,
  nisa: 4,
  maide: 5,
  enam: 6,
  araf: 7,
  enfal: 8,
  tevbe: 9,
  yunus: 10,
  hud: 11,
  yusuf: 12,
  rad: 13,
  ibrahim: 14,
  hicr: 15,
  nahl: 16,
  isra: 17,
  kehf: 18,
  meryem: 19,
  taha: 20,
  enbiya: 21,
  hac: 22,
  muminun: 23,
  nur: 24,
  furkan: 25,
  suara: 26,
  neml: 27,
  kasas: 28,
  ankebut: 29,
  rum: 30,
  lokman: 31,
  secde: 32,
  ahzab: 33,
  sebe: 34,
  fatir: 35,
  yasin: 36,
  saffat: 37,
  sad: 38,
  zumer: 39,
  mumin: 40,
  fussilet: 41,
  sura: 42,
  zuhruf: 43,
  duhan: 44,
  casiye: 45,
  ahkaf: 46,
  muhammed: 47,
  fetih: 48,
  hucurat: 49,
  kaf: 50,
  zariyat: 51,
  tur: 52,
  necm: 53,
  kamer: 54,
  rahman: 55,
  vakia: 56,
  hadid: 57,
  mucadele: 58,
  hasr: 59,
  mumtehine: 60,
  saff: 61,
  cuma: 62,
  munafikun: 63,
  tegabun: 64,
  talak: 65,
  tahrim: 66,
  mulk: 67,
  kalem: 68,
  hakka: 69,
  mearic: 70,
  nuh: 71,
  cin: 72,
  muzzemmil: 73,
  muddessir: 74,
  kiyame: 75,
  insan: 76,
  murselat: 77,
  nebe: 78,
  naziat: 79,
  abese: 80,
  tekvir: 81,
  infitar: 82,
  mutaffifin: 83,
  insikak: 84,
  buruc: 85,
  tarik: 86,
  ala: 87,
  gasiye: 88,
  fecr: 89,
  beled: 90,
  sems: 91,
  leyl: 92,
  duha: 93,
  insirah: 94,
  tin: 95,
  alak: 96,
  kadir: 97,
  beyyine: 98,
  zilzal: 99,
  adiyat: 100,
  karia: 101,
  tekasur: 102,
  asr: 103,
  humeze: 104,
  fil: 105,
  kureys: 106,
  maun: 107,
  kevser: 108,
  kafirun: 109,
  nasr: 110,
  tebbet: 111,
  ihlas: 112,
  felak: 113,
  nas: 114,
};

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9:\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseVerseReference(question: string): { surah: number; verse: number } | null {
  const normalized = normalizeText(question);

  const colonMatch = normalized.match(/\b(\d{1,3})\s*:\s*(\d{1,3})\b/);
  if (colonMatch) {
    return {
      surah: Number.parseInt(colonMatch[1], 10),
      verse: Number.parseInt(colonMatch[2], 10),
    };
  }

  const slashMatch = normalized.match(/\b(\d{1,3})\s*\/\s*(\d{1,3})\b/);
  if (slashMatch) {
    return {
      surah: Number.parseInt(slashMatch[1], 10),
      verse: Number.parseInt(slashMatch[2], 10),
    };
  }

  if (
    normalized.includes('ayetel kursi') ||
    normalized.includes('ayete l kursi') ||
    normalized.includes('ayatul kursi') ||
    normalized.includes('kursi')
  ) {
    return { surah: 2, verse: 255 };
  }

  for (const [name, surah] of Object.entries(SURAH_ALIASES)) {
    const match = normalized.match(new RegExp(`\\b${name}\\b\\s+(\\d{1,3})\\b`));
    if (match) {
      return {
        surah,
        verse: Number.parseInt(match[1], 10),
      };
    }
  }

  return null;
}

function selectKeyRoots(words: WordData[]): string[] {
  const seen = new Set<string>();
  const roots: string[] = [];

  for (const word of words) {
    const latin = word.root?.latin;

    if (!latin || seen.has(latin)) {
      continue;
    }

    seen.add(latin);
    roots.push(latin);

    if (roots.length >= 3) {
      break;
    }
  }

  return roots;
}

function selectTopConnections(
  parts: ConcordancePart[],
  anchorSurah: number,
  anchorVerse: number
): ConcordancePart[] {
  const seen = new Set<string>();
  const selected: ConcordancePart[] = [];

  for (const part of parts) {
    const loosePart = part as ConcordancePart & {
      verse?: {
        surah_id?: number;
        verse_number?: number;
      };
    };

    const surahId = loosePart.surah_id ?? loosePart.verse?.surah_id;
    const verseNumber = loosePart.verse_number ?? loosePart.verse?.verse_number;

    if (!surahId || !verseNumber) {
      continue;
    }

    if (surahId === anchorSurah && verseNumber === anchorVerse) {
      continue;
    }

    const key = `${surahId}:${verseNumber}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    selected.push(part);

    if (selected.length >= 5) {
      break;
    }
  }

  return selected;
}

function generateProse(
  anchor: VerseData,
  connections: ConnectionData[],
  language: 'tr' | 'en'
): ProseData {
  const isEnglish = language === 'en';
  const anchorSurahId = anchor.surah_id ?? anchor.surah?.id;
  const anchorReference = `${anchorSurahId}:${anchor.verse_number}`;

  const anchorExplanation = isEnglish
    ? `This verse (${anchorReference}) is read here through Quranic cross-connections rather than external commentary. Its Arabic text, “${anchor.verse}”, is paired with verses that share key root vocabulary so the Quran's own usage can clarify the theme.`
    : `Bu ayet (${anchorReference}) burada haricî yorum yerine Kur'an içi bağlantılarla okunur. “${anchor.verse}” Arapça metni, Kur'an'ın kendi kullanımının temayı açıklayabilmesi için önemli kök kelimeleri paylaşan ayetlerle eşleştirilir.`;

  const connectionItems = connections.map((connection, index) => ({
    surah_id: connection.surah_id,
    verse_number: connection.verse_number,
    root_latin: connection.root_latin,
    arabic: connection.verse?.verse,
    translation: connection.verse?.translation.text,
    explanation: isEnglish
      ? `Verse ${connection.surah_id}:${connection.verse_number} shares the root “${connection.root_latin}” with the anchor verse, offering ${index === 0 ? 'primary' : 'additional'} Quranic context for the same vocabulary.`
      : `${connection.surah_id}:${connection.verse_number} ayeti, çapa ayetle “${connection.root_latin}” kökünü paylaşır ve aynı kelime dağarcığı için ${index === 0 ? 'birincil' : 'ek'} Kur'anî bağlam sunar.`,
  }));

  const synthesis = isEnglish
    ? `Taken together, the anchor verse (${anchorReference}) and these ${connections.length} connected verses form a compact internal reading: repeated roots guide the comparison, while each fetched verse keeps the explanation grounded in verified Quran text.`
    : `Birlikte ele alındığında çapa ayet (${anchorReference}) ve bu ${connections.length} bağlantılı ayet kısa bir Kur'an içi okuma oluşturur: tekrar eden kökler karşılaştırmaya yön verir; getirilen her ayet ise açıklamayı doğrulanmış Kur'an metnine bağlı tutar.`;

  return {
    anchor: {
      arabic: anchor.verse,
      translation: anchor.translation.text,
      explanation: anchorExplanation,
    },
    connections: connectionItems,
    synthesis,
  };
}

async function resolveAnchor(question: string): Promise<{ surah: number; verse: number }> {
  const reference = parseVerseReference(question);

  if (reference) {
    return reference;
  }

  throw {
    message:
      'MeiliSearch kapalı olduğu için serbest metin araması yapılamıyor. Lütfen “2:255”, “Bakara 255” veya “Fatiha 1” gibi ayet referansı yazın.',
    status: 400,
  };
}

export async function runAgent(
  question: string,
  language: 'tr' | 'en'
): Promise<AgentResponse> {
  const authorId = language === 'en' ? DEFAULT_EN_AUTHOR : DEFAULT_TR_AUTHOR;
  const anchorReference = await resolveAnchor(question);

  const anchorResponse = await fetchVerse(
    anchorReference.surah,
    anchorReference.verse,
    authorId
  );
  const anchor = anchorResponse.data;

  const wordsResponse = await fetchWords(anchorReference.surah, anchorReference.verse);
  const roots = wordsResponse.data;

  const keyRoots = selectKeyRoots(roots);
  const connectionParts: ConcordancePart[] = [];

  for (const rootLatin of keyRoots) {
    const cacheKey = `${rootLatin}-${authorId}-1`;
    let parts = concordanceCache.get(cacheKey);

    if (!parts) {
      const concordance = await fetchRootConcordance(rootLatin, authorId, 1);
      parts = concordance.data;
      concordanceCache.set(cacheKey, parts);
    }

    connectionParts.push(...parts);
  }

  const topParts = selectTopConnections(
    connectionParts,
    anchorReference.surah,
    anchorReference.verse
  );

  const connections = await Promise.all(
    topParts.map(async (part): Promise<ConnectionData | null> => {
      const loosePart = part as ConcordancePart & {
        verse?: {
          surah_id?: number;
          verse_number?: number;
        };
      };
      const rootLatin = loosePart.root?.latin ?? '';
      const surahId = loosePart.surah_id ?? loosePart.verse?.surah_id;
      const verseNumber = loosePart.verse_number ?? loosePart.verse?.verse_number;

      if (!surahId || !verseNumber) {
        return null;
      }

      try {
        const verseResponse = await fetchVerse(surahId, verseNumber, authorId);

        return {
          surah_id: surahId,
          verse_number: verseNumber,
          root_latin: rootLatin,
          verse: verseResponse.data,
          relationship_type: 'concordance',
        };
      } catch {
        return {
          surah_id: surahId,
          verse_number: verseNumber,
          root_latin: rootLatin,
          relationship_type: 'concordance',
        };
      }
    })
  );

  const validConnections = connections.filter(
    (connection): connection is ConnectionData => connection !== null
  );

  const prose = generateProse(anchor, validConnections, language);

  return {
    anchor,
    roots,
    connections: validConnections,
    prose,
    language,
  };
}
