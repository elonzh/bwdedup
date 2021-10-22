import { removeDuplicateItems, hashItem, mergeSameFolders } from '../src/dedup'
import { BitWardenExports } from '../src/models'
import * as crypto from 'crypto'

test('hashItem', () => {
  expect(hashItem({
    id: 'id1',
    organizationId: 'organizationId1',
    collectionIds: ['collectionId1'],
    folderId: 'folderId1',
    name: 'name1',
    type: 0,
    reprompt: 0,
    card: undefined,
    favorite: false,
    fields: [],
    login: undefined,
    notes: '',
    secureNote: undefined
  })).toBe(hashItem({
    id: 'id2',
    organizationId: 'organizationId2',
    collectionIds: ['collectionId2'],
    folderId: 'folderId2',
    name: 'name2',
    type: 0,
    reprompt: 0,
    card: undefined,
    favorite: false,
    fields: [],
    login: undefined,
    notes: '',
    secureNote: undefined
  }))
})

describe('debup', () => {
  test('empty input', () => {
    const input = { folders: [], items: [] }
    expect(removeDuplicateItems(input)).toStrictEqual(input)
  })

  test('removeEmptyFolders', () => {
    const input = {
      folders: [
        {
          id: crypto.randomUUID(),
          name: 'name1'
        },
        {
          id: crypto.randomUUID(),
          name: 'name2'
        }
      ],
      items: []
    }
    expect(removeDuplicateItems(input)).toStrictEqual({ folders: [], items: [] })
    expect(removeDuplicateItems(input, { removeEmptyFolders: false })).toStrictEqual(input)
  })

  test('empty input', () => {
    let input: BitWardenExports = {
      folders: [
        {
          id: 'folderId1',
          name: 'folder'
        },
        {
          id: 'folderId2',
          name: 'folder'
        }
      ],
      items: [
        {
          id: 'id1',
          organizationId: null,
          collectionIds: null,
          folderId: 'folderId1',
          name: 'name1',
          type: 0,
          reprompt: 0,
          favorite: false,
          notes: 'unique notes'
        },
        {
          id: 'id2',
          organizationId: null,
          collectionIds: null,
          folderId: 'folderId1',
          name: 'name2',
          type: 0,
          reprompt: 0,
          favorite: false,
          notes: 'notes'
        },
        {
          id: 'id3',
          organizationId: null,
          collectionIds: null,
          folderId: 'folderId2',
          name: 'name3',
          type: 0,
          reprompt: 0,
          favorite: true,
          notes: 'notes'
        }
      ]
    }
    let output: BitWardenExports = {
      folders: [
        {
          id: 'folderId1',
          name: 'folder'
        },
        {
          id: 'folderId2',
          name: 'folder'
        }
      ],
      items: [input.items[0], input.items[2]]
    }
    expect(removeDuplicateItems(input)).toStrictEqual(output)

    input = output
    output = {
      folders: [
        {
          id: 'folderId1',
          name: 'folder'
        }
      ],
      items: [
        {
          id: 'id1',
          organizationId: null,
          collectionIds: null,
          folderId: 'folderId1',
          name: 'name1',
          type: 0,
          reprompt: 0,
          favorite: false,
          notes: 'unique notes'
        },
        {
          id: 'id3',
          organizationId: null,
          collectionIds: null,
          folderId: 'folderId1',
          name: 'name3',
          type: 0,
          reprompt: 0,
          favorite: true,
          notes: 'notes'
        }
      ]
    }
    expect(mergeSameFolders(input)).toStrictEqual(output)
  })
})
