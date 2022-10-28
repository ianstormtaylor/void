export type Output = {
  type: FileType
  quality: number
}

export const FILE_TYPES = ['png', 'jpg', 'webp', 'svg', 'pdf'] as const

export type FileType = typeof FILE_TYPES[number]

export const MIME_TYPES: Record<FileType, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
}

export type Exporter = (type: 'png' | 'svg') => string
