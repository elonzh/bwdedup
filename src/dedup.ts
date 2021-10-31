import hash from 'object-hash'
import { BitWardenExports, Folder, Item } from './models'
import _ from 'lodash'

export function hashItem (item: Item): string {
  const excludeKeys = new Set<string>(['id', 'organizationId', 'folderId', 'collectionIds', 'name', 'favorite'])
  return hash(item, { encoding: 'hex', excludeKeys: (key: string) => excludeKeys.has(key) })
}

export function mergeSameFolders (input: BitWardenExports): BitWardenExports {
  const nameToId = new Map<string, string>()
  const idToId = new Map<string, string>()
  const folders: Folder[] = []
  for (const folder of input.folders) {
    let targetId: string
    if (nameToId.has(folder.name)) {
      targetId = nameToId.get(folder.name) as string
    } else {
      targetId = folder.id
      nameToId.set(folder.name, folder.id)
      folders.push(folder)
    }
    idToId.set(folder.id, targetId)
  }
  input.folders = folders
  for (const item of input.items) {
    if (item.folderId) {
      item.folderId = idToId.get(item.folderId) as string
    }
  }
  return input
}

export function removeDuplicateItems (input: BitWardenExports, removeEmptyFolders: boolean): BitWardenExports {
  const itemMapping = new Map<string, Item[]>()
  for (const item of input.items) {
    const key = hashItem(item)
    const sames = itemMapping.get(key)
    if (sames != null) {
      sames.push(item)
    } else {
      itemMapping.set(key, [item])
    }
  }
  const keepFolderIds = new Set<string>()
  const items: Item[] = []
  for (let [key, sames] of itemMapping.entries()) {
    sames = _.orderBy(sames, ['favorite'], 'desc')
    const keepItem = sames[0]
    if (keepItem.folderId) {
      keepFolderIds.add(keepItem.folderId)
    }
    items.push(keepItem)
  }
  input.items = items
  if (removeEmptyFolders) {
    input.folders = input.folders.filter((value) => keepFolderIds.has(value.id))
  }
  return input
}

export interface DedupOptions {
  removeEmptyFolders?: boolean
  mergeSameFolders?: boolean
}

export const DefaultDedupOptions: DedupOptions = {
  removeEmptyFolders: true,
  mergeSameFolders: true
}

export function dedup (input: BitWardenExports, options?: DedupOptions): BitWardenExports {
  options = _.defaults(options, DefaultDedupOptions)
  let output = removeDuplicateItems(input, options.removeEmptyFolders as boolean)
  if (options.mergeSameFolders) {
    output = mergeSameFolders(output)
  }
  return output
}
