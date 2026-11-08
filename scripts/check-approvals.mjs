// Publication gate. Each artist keeps src/artists/<slug>/approvals.json.
// With VITE_REQUIRE_APPROVALS=true (production), the build fails while anything
// is unapproved. `npm run check:approvals` just prints the report.
import { readFileSync } from 'node:fs'
import path from 'node:path'

const slug = process.env.VITE_ARTIST_SLUG || 'tracy-smith'
const file = path.resolve(import.meta.dirname, '..', 'src', 'artists', slug, 'approvals.json')
const approvals = JSON.parse(readFileSync(file, 'utf8'))
const pending = Object.entries(approvals.items).filter(([, item]) => !item.approved)
const report = process.argv.includes('--report')

if (pending.length === 0) {
  console.log(`[approvals] ${slug}: everything approved.`)
} else {
  console.log(`[approvals] ${slug}: ${pending.length} item(s) awaiting approval:`)
  for (const [key, item] of pending) console.log(`  - ${key}: ${item.what}`)
  if (!report && process.env.VITE_REQUIRE_APPROVALS === 'true') {
    console.error('[approvals] VITE_REQUIRE_APPROVALS=true: refusing to build unapproved content.')
    process.exit(1)
  }
}
