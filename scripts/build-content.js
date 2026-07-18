#!/usr/bin/env node
/**
 * Build content pipeline
 *
 * Walks content/data/ and content/markdown/, merges YAML + Markdown,
 * and emits src/data/generated.json for the frontend to consume.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const DATA_DIR = path.join(CONTENT_DIR, 'data')
const MARKDOWN_DIR = path.join(CONTENT_DIR, 'markdown')
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'generated.json')

const COLLECTIONS = [
  'crews',
  'ships',
  'classes',
  'skills',
  'dice',
  'songs',
  'equipment',
  'items',
  'quests',
  'locations',
  'glossary',
  'symptoms',
  'shadows',
  'recruitment-pools',
]

async function readYamlFiles(dir) {
  const files = await fs.readdir(dir).catch(() => [])
  const result = []
  for (const file of files) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue
    const filePath = path.join(dir, file)
    const stat = await fs.stat(filePath)
    if (stat.isDirectory()) continue
    const content = await fs.readFile(filePath, 'utf-8')
    result.push(YAML.parse(content))
  }
  return result
}

async function readMarkdownFile(filePath) {
  const fullPath = path.join(CONTENT_DIR, filePath)
  try {
    return await fs.readFile(fullPath, 'utf-8')
  } catch {
    console.warn(`Markdown file not found: ${fullPath}`)
    return ''
  }
}

async function readMarkdownFiles(dir, baseRoute = '') {
  const entries = []
  const files = await fs.readdir(dir, { recursive: true }).catch(() => [])
  for (const file of files) {
    if (typeof file !== 'string') continue
    if (!file.endsWith('.md')) continue
    const relativePath = file.replace(/\\/g, '/')
    const fullPath = path.join(dir, relativePath)
    const stat = await fs.stat(fullPath)
    if (stat.isDirectory()) continue
    const content = await fs.readFile(fullPath, 'utf-8')
    const slug = relativePath.replace(/\.md$/, '').replace(/\//g, '-')
    entries.push({
      path: relativePath,
      slug,
      content,
    })
  }
  return entries
}

function buildSearchIndex(data) {
  const index = []

  const add = (item, type, route, extraTags = [], extraKeywords = []) => {
    index.push({
      id: item.id,
      title: item.name || item.title || item.term,
      type,
      route,
      tags: [...(item.tags || []), ...extraTags],
      keywords: [...extraKeywords],
    })
  }

  data.crews.forEach((c) => add(c, '船员', `/crews/${c.slug}`, [], [c.role, c.element]))
  data.ships.forEach((s) => add(s, '船只', `/ships/${s.slug}`))
  data.classes.forEach((c) => add(c, '职业', `/classes/${c.slug}`))
  data.skills.forEach((s) =>
    add(s, '技能', `/skills/${s.slug}`, s.tags, [s.class, s.type]),
  )
  data.dice.forEach((d) => add(d, '骰子', `/dice/${d.slug}`, [d.type]))
  data.songs.forEach((s) => add(s, '船歌', `/songs/${s.slug}`))
  data.equipment.forEach((e) =>
    add(e, '行装', `/equipment/${e.slug}`, [e.slot, e.rarity]),
  )
  data.items.forEach((i) => add(i, '物品', `/items/${i.slug}`, [i.type, i.rarity]))
  data.quests.forEach((q) => add(q, '任务', `/quests/${q.slug}`, [q.category]))
  data.locations.forEach((l) => add(l, '地点', `/locations/${l.slug}`, [l.type]))
  data.glossary.forEach((g) =>
    index.push({
      id: g.id,
      title: g.term,
      type: '术语',
      route: `/glossary#${g.id}`,
      tags: g.related || [],
      keywords: [],
    }),
  )
  data.symptoms.forEach((s) =>
    add(s, '症状', `/symptoms/${s.slug}`, [s.severity, s.alignment]),
  )
  data.shadows.forEach((s) =>
    add(s, '往日之影', `/shadows/${s.slug}`, [s.rarity]),
  )
  data.recruitmentPools.forEach((p) =>
    index.push({
      id: p.id,
      title: p.name,
      type: '招募池',
      route: `/recruitment?pool=${p.slug}`,
      tags: [p.type, p.currency],
      keywords: [],
    }),
  )
  data.pages.forEach((p) =>
    index.push({
      id: p.id,
      title: p.title,
      type: '指南',
      route: p.route,
      tags: [],
      keywords: [],
    }),
  )

  return index
}

async function main() {
  console.log('Building content...')

  const data = {
    meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
    },
  }

  // Load index.yaml for page routing
  const indexYamlPath = path.join(DATA_DIR, 'index.yaml')
  let indexData = { pages: [] }
  try {
    const indexContent = await fs.readFile(indexYamlPath, 'utf-8')
    indexData = YAML.parse(indexContent)
  } catch {
    console.warn('No content/data/index.yaml found')
  }

  // Load collection YAML files
  for (const collection of COLLECTIONS) {
    const dir = path.join(DATA_DIR, collection)
    const key = collection.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    data[key] = await readYamlFiles(dir)
  }

  // Load Markdown pages referenced by index.yaml
  data.pages = []
  for (const page of indexData.pages || []) {
    data.pages.push({
      ...page,
      content: await readMarkdownFile(page.markdown),
    })
  }

  // Build search index
  data.searchIndex = buildSearchIndex(data)

  // Write output
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8')

  console.log(`Generated ${OUTPUT_PATH}`)
  console.log(
    `Summary: ${COLLECTIONS.map((c) => {
      const key = c.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      return `${c}=${data[key].length}`
    }).join(', ')}, pages=${data.pages.length}, searchIndex=${data.searchIndex.length}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
