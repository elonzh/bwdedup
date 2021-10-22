export interface BitWardenExports {
  encrypted?: boolean
  folders: Folder[]
  items: Item[]
}

export interface Folder {
  id: string
  name: string
}

export interface Item {
  id: string
  organizationId: null | string
  folderId: null | string
  collectionIds: null | string[]
  type: number
  reprompt: number
  name: string
  notes: null | string
  favorite: boolean
  login?: Login
  secureNote?: SecureNote
  fields?: Field[]
  card?: Card
}

export interface Card {
  cardholderName: string
  brand: null
  number: string
  expMonth: null
  expYear: null
  code: null
}

export interface Field {
  name: string
  value: string
  type: number
}

export interface Login {
  uris: Uris[]
  username: null | string
  password: null | string
  totp: null | string
}

export interface Uris {
  match: null
  uri: string
}

export interface SecureNote {
  type: number
}
