export interface Author {
  id: number;
  name: string;
  language: string;
  description: string;
  url?: string | null;
}

export interface Footnote {
  id: number;
  text: string;
  number: number;
}

export interface Translation {
  id: number;
  text: string;
  footnotes?: Footnote[] | null;
  author?: Author;
}

export interface SurahSummary {
  id: number;
  name: string;
  name_en: string;
}

export interface SurahAudio {
  mp3: string;
  duration: number;
  mp3_en?: string;
  duration_en?: number;
}

export interface VerseData {
  id: number;
  // Not sent by /surah/:id/verse/:n — the surah number is in `surah.id`
  surah_id?: number;
  verse_number: number;
  verse: string;
  verse_simplified?: string;
  verse_without_vowel?: string;
  transcription?: string;
  transcription_en?: string;
  page?: number;
  juz_number?: number;
  translation: Translation;
  author?: Author;
  surah?: SurahSummary;
}

export interface VerseResponse {
  data: VerseData;
}

export interface RootInfo {
  id: number;
  latin: string;
  arabic?: string;
  mean?: string;
  mean_en?: string;
}

export interface WordData {
  id: number;
  arabic: string;
  transcription?: string;
  turkish?: string;
  root?: RootInfo | null;
}

export interface WordsResponse {
  data: WordData[];
}

export interface RootResponse {
  data: {
    id: number;
    latin: string;
    arabic?: string;
    mean?: string;
    mean_en?: string;
    diffs?: string;
  };
}

export interface ConcordancePart {
  id: number;
  surah_id: number;
  verse_number: number;
  transcription?: string;
  arabic?: string;
  root?: RootInfo;
  surah?: SurahSummary;
}

export interface PaginationLinks {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface ConcordanceResponse {
  data: ConcordancePart[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
}

export interface SurahData {
  id: number;
  name: string;
  name_en: string;
  name_original?: string;
  verse_count: number;
  page_number?: number;
  audio?: SurahAudio | null;
}

export interface SurahResponse {
  data: SurahData[];
}

export interface SurahWithVersesResponse {
  data: {
    surah: SurahData;
    verses: VerseData[];
  };
}

export interface SearchResult {
  surah_id: number;
  verse_number: number;
  text: string;
  surah?: SurahSummary;
}

export interface SearchResponse {
  data: SearchResult[];
}

export interface ConnectionData {
  surah_id: number;
  verse_number: number;
  root_latin: string;
  verse?: VerseData;
  relationship_type?: string;
}

export interface ProseSection {
  arabic?: string;
  translation?: string;
  explanation: string;
}

export interface ProseData {
  anchor: ProseSection;
  connections: Array<ProseSection & {
    surah_id: number;
    verse_number: number;
    root_latin?: string;
  }>;
  synthesis: string;
}

export interface AgentResponse {
  anchor: VerseData;
  roots: WordData[];
  connections: ConnectionData[];
  prose: ProseData;
  language: 'tr' | 'en';
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
