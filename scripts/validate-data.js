#!/usr/bin/env node
/**
 * Validate content data
 *
 * Checks YAML files for required fields, duplicate IDs/slugs,
 * image references, and internal link integrity.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'content', 'data')
const MARKDOWN_DIR = path.join(ROOT, 'content', 'markdown')
const PUBLIC_DIR = path.join(ROOT, 'public')

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
]

const VALID_EQUIPMENT_SLOTS = ['手部', '头部', '躯干', '腿部', '奇珍']
const VALID_RARITIES = ['绿', '蓝', '紫', '金']

const errors = []
const warnings = []

function error(msg) {
  errors.push(msg)
  console.error(`❌ ${msg}`)
}

function warn(msg) {
  warnings.push(msg)
  console.warn(`⚠️  ${msg}`)
}

async function readYamlFiles(dir) {
  const files = await fs.readdir(dir).catch(() => [])
  const result = []
  for (const file of files) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue
    const filePath = path.join(dir, file)
    const stat = await fs.stat(filePath)
    if (stat.isDirectory()) continue
    const content = await fs.readFile(filePath, 'utf-8')
    try {
      result.push({ file, data: YAML.parse(content) })
    } catch (e) {
      error(`Failed to parse ${filePath}: ${e.message}`)
    }
  }
  return result
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch {
    return false
  }
}

async function validateCollection(collection, items, allIds, allSlugs) {
  const ids = new Set()
  const slugs = new Set()

  for (const { file, data } of items) {
    if (!data || typeof data !== 'object') {
      error(`[${collection}/${file}] Invalid YAML structure`)
      continue
    }

    // Required fields
    if (!data.id) error(`[${collection}/${file}] Missing required field: id`)
    if (!data.slug) error(`[${collection}/${file}] Missing required field: slug`)

    const nameField = data.name || data.title || data.term
    if (!nameField) {
      error(`[${collection}/${file}] Missing required field: name/title/term`)
    }

    // Duplicate checks
    if (data.id) {
      if (ids.has(data.id)) error(`[${collection}] Duplicate id: ${data.id}`)
      if (allIds.has(data.id)) error(`Duplicate id across collections: ${data.id}`)
      ids.add(data.id)
      allIds.add(data.id)
    }
    if (data.slug) {
      if (slugs.has(data.slug)) error(`[${collection}] Duplicate slug: ${data.slug}`)
      if (allSlugs.has(data.slug)) error(`Duplicate slug across collections: ${data.slug}`)
      slugs.add(data.slug)
      allSlugs.add(data.slug)
    }

    // Image references
    if (data.image) {
      const imagePath = path.join(PUBLIC_DIR, data.image)
      if (!(await fileExists(imagePath))) {
        warn(`[${collection}/${file}] Image not found: ${data.image}`)
      }
    }

    // Collection-specific validation
    if (collection === 'equipment') {
      if (!VALID_EQUIPMENT_SLOTS.includes(data.slot)) {
        error(`[${collection}/${file}] Invalid equipment slot: ${data.slot}`)
      }
      if (data.rarity && !VALID_RARITIES.includes(data.rarity)) {
        error(`[${collection}/${file}] Invalid rarity: ${data.rarity}`)
      }
    }
  }
}

async function validateReferences(collections) {
  const ids = new Set()
  for (const collection of Object.values(collections)) {
    for (const { data } of collection) {
      if (data?.id) ids.add(data.id)
    }
  }

  // Validate skill references in crews
  for (const { file, data } of collections.crews || []) {
    for (const skillId of data.skills || []) {
      if (!ids.has(skillId)) {
        error(`[crews/${file}] Referenced skill not found: ${skillId}`)
      }
    }
    for (const songId of data.songs || []) {
      if (!ids.has(songId)) {
        error(`[crews/${file}] Referenced song not found: ${songId}`)
      }
    }
    for (const equipId of data.recommendedEquipment || []) {
      if (!ids.has(equipId)) {
        error(`[crews/${file}] Referenced equipment not found: ${equipId}`)
      }
    }
  }

  // Validate class skill references
  for (const { file, data } of collections.classes || []) {
    for (const skillId of data.skills || []) {
      if (!ids.has(skillId)) {
        error(`[classes/${file}] Referenced skill not found: ${skillId}`)
      }
    }
  }

  // Validate glossary references
  const glossaryTerms = new Set(
    (collections.glossary || []).map(({ data }) => data.term),
  )
  for (const { file, data } of collections.glossary || []) {
    for (const related of data.related || []) {
      if (!glossaryTerms.has(related)) {
        error(`[glossary/${file}] Related term not found: ${related}`)
      }
    }
  }

  // Validate index.yaml markdown references
  const indexPath = path.join(DATA_DIR, 'index.yaml')
  let indexData = { pages: [] }
  try {
    const indexContent = await fs.readFile(indexPath, 'utf-8')
    indexData = YAML.parse(indexContent)
  } catch {
    error('Missing or invalid content/data/index.yaml')
  }

  for (const page of indexData.pages || []) {
    if (page.markdown) {
      const mdPath = path.join(ROOT, 'content', page.markdown)
      if (!(await fileExists(mdPath))) {
        error(`Page references missing markdown: ${page.markdown}`)
      }
    }
  }
}

async function main() {
  console.log('Validating content...')

  const collections = {}
  const allIds = new Set()
  const allSlugs = new Set()

  for (const collection of COLLECTIONS) {
    const dir = path.join(DATA_DIR, collection)
    collections[collection] = await readYamlFiles(dir)
  }

  for (const collection of COLLECTIONS) {
    await validateCollection(
      collection,
      collections[collection],
      allIds,
      allSlugs,
    )
  }

  await validateReferences(collections)

  if (errors.length === 0) {
    console.log('✅ Validation passed')
    if (warnings.length > 0) {
      console.log(`${warnings.length} warning(s)`)
    }
  } else {
    console.error(`\n❌ ${errors.length} error(s) found`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
