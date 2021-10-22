import * as fs from 'fs'
import { mergeSameFolders, removeDuplicateItems } from './dedup'

function main () {
  const path = 'bitwarden_export_20211022141606.json'
  const rawdata = fs.readFileSync(path, { encoding: 'utf-8' })
  const input = JSON.parse(rawdata)
  const output = mergeSameFolders(removeDuplicateItems(input))
  fs.writeFileSync('deduped_' + path, JSON.stringify(output))
}

main()
