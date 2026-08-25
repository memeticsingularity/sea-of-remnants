/**
 * 类型化内容端点，对应后端 /sor/api/*
 */
import { request } from './client'
import type {
  SearchIndexEntry,
  Crew,
  GameClass,
  RecruitmentPool,
  Shadow,
  Page,
  GlossaryEntry,
} from '@/types'

export interface HomeStats {
  crews: number
  ships: number
  classes: number
  skills: number
  dice: number
  songs: number
  equipment: number
  randomAffixes: number
  items: number
  quests: number
  locations: number
  glossary: number
  symptoms: number
  shadows: number
  recruitmentPools: number
  guardians: number
  shipTags: number
  pages: number
  searchIndex: number
  [key: string]: number
}

export interface SkillOwnerRef {
  id: string
  slug: string
  name: string
  type?: string
  role?: string
  image?: string
  faction?: string
}

export interface SkillOwners {
  crews: SkillOwnerRef[]
  classes: SkillOwnerRef[]
}

export function fetchCollection<T>(key: string): Promise<T[]> {
  return request<T[]>(`/${key}`)
}

export function fetchEntity<T>(key: string, slug: string): Promise<T> {
  return request<T>(`/${key}/${slug}`)
}

export function fetchStats(): Promise<HomeStats> {
  return request<HomeStats>('/stats')
}

export function fetchSearch(): Promise<SearchIndexEntry[]> {
  return request<SearchIndexEntry[]>('/search')
}

export function fetchCrewSummaries(): Promise<Pick<Crew, 'id' | 'slug' | 'name' | 'image' | 'element' | 'rarity' | 'primaryStat'>[]> {
  return request<Pick<Crew, 'id' | 'slug' | 'name' | 'image' | 'element' | 'rarity' | 'primaryStat'>[]>('/crews/summary')
}

export function fetchSkillOwners(slug: string): Promise<SkillOwners> {
  return request<SkillOwners>(`/skills/${slug}/owners`)
}

// 常用集合的类型化便利函数
export const fetchCrews = () => fetchCollection<Crew>('crews')
export const fetchClasses = () => fetchCollection<GameClass>('classes')
export const fetchRecruitmentPools = () => fetchCollection<RecruitmentPool>('recruitmentPools')
export const fetchShadows = () => fetchCollection<Shadow>('shadows')
export const fetchPages = () => fetchCollection<Page>('pages')
export const fetchGlossary = () => fetchCollection<GlossaryEntry>('glossary')
