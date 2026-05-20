import type {
  VerseResponse,
  WordsResponse,
  RootResponse,
  ConcordanceResponse,
  SurahResponse,
  SurahWithVersesResponse,
  SearchResponse,
  ApiError,
} from '@/types/acikkuran';

const BASE_URL = process.env.ACIKKURAN_URL ?? 'http://localhost:3112';
const DEFAULT_TR_AUTHOR = 105; // Erhan Aktaş — Kerim Kur'an
const DEFAULT_EN_AUTHOR = 103; // Edip-Layth

function log(msg: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[acikkuran] ${msg}`);
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  log(`GET ${url}`);

  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    const error: ApiError = {
      message: `API error: ${res.statusText}`,
      status: res.status,
    };
    throw error;
  }

  return res.json() as Promise<T>;
}

export async function fetchVerse(
  surah: number,
  verse: number,
  authorId: number = DEFAULT_TR_AUTHOR
): Promise<VerseResponse> {
  return apiFetch<VerseResponse>(
    `/surah/${surah}/verse/${verse}?author=${authorId}`
  );
}

export async function fetchWords(
  surah: number,
  verse: number
): Promise<WordsResponse> {
  return apiFetch<WordsResponse>(`/surah/${surah}/verse/${verse}/words`);
}

export async function fetchRootConcordance(
  rootLatin: string,
  authorId: number = DEFAULT_TR_AUTHOR,
  page: number = 1
): Promise<ConcordanceResponse> {
  return apiFetch<ConcordanceResponse>(
    `/root/latin/${encodeURIComponent(rootLatin)}/verseparts?author=${authorId}&page=${page}`
  );
}

export async function fetchRootDetail(rootLatin: string): Promise<RootResponse> {
  return apiFetch<RootResponse>(`/root/latin/${encodeURIComponent(rootLatin)}`);
}

export async function fetchSurahs(): Promise<SurahResponse> {
  return apiFetch<SurahResponse>('/surahs');
}

export async function fetchSurah(
  surahId: number,
  authorId: number = DEFAULT_TR_AUTHOR
): Promise<SurahWithVersesResponse> {
  return apiFetch<SurahWithVersesResponse>(`/surah/${surahId}?author=${authorId}`);
}

export async function searchVerses(query: string): Promise<SearchResponse> {
  return apiFetch<SearchResponse>(`/search?q=${encodeURIComponent(query)}`);
}

export { DEFAULT_TR_AUTHOR, DEFAULT_EN_AUTHOR };
