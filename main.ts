import * as fs from 'fs'
import { isEqualWith } from 'lodash'
import * as hash from 'object-hash'

export interface BitWardenExports {
  encrypted: boolean;
  folders: Folder[];
  items: Item[];
}

export interface Folder {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  organizationId: null;
  folderId: null | string;
  type: number;
  reprompt: number;
  name: string;
  notes: null | string;
  favorite: boolean;
  login?: Login;
  collectionIds: null;
  secureNote?: SecureNote;
  fields?: Field[];
  card?: Card;
}

//
// function itemHash (item: Item): string {
//   return hash(item, { encoding: 'hex' , excludeKeys:(key: string) => boolean})
// }

export interface Card {
  cardholderName: string;
  brand: null;
  number: string;
  expMonth: null;
  expYear: null;
  code: null;
}

export interface Field {
  name: string;
  value: string;
  type: number;
}

export interface Login {
  uris: Uris[];
  username: null | string;
  password: null | string;
  totp: null | string;
}

export interface Uris {
  match: null;
  uri: string;
}

export interface SecureNote {
  type: number;
}

function dedup (input: BitWardenExports) {
  const itemMapping = new Map<string, Array<Item>>()
  for (const item of input.items) {
    const sames = itemMapping.get(item.name)
    if (sames) {
      sames.push(item)
    } else {
      itemMapping.set(item.name, [item])
    }
  }
  for (const [name, sames] of itemMapping.entries()) {
    if (sames.length > 1) {
      console.log(`${name}, ${sames.length}`)
    }
  }
}

function main () {
  const rawdata = fs.readFileSync('bitwarden_export_20211020103447.json', { encoding: 'utf-8' })
  dedup(JSON.parse(rawdata))
}

main()
