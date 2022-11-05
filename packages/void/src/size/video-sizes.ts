/** A recognized video size keyword. */
export type VideoSize = keyof typeof VIDEO_SIZES

/** A dictionary of recognized video sizes. */
export const VIDEO_SIZES = {
  // 16:9 (UHD)
  // https://support.google.com/youtube/answer/6375112
  '240p': [426, 240, 'px'],
  '360p': [640, 360, 'px'],
  '480p': [854, 480, 'px'],
  '720p': [1280, 720, 'px'],
  '1080p': [1920, 1080, 'px'],
  '1440p': [2560, 1440, 'px'],
  '2160p': [3840, 2160, 'px'],
  // 16:9
  // https://www.wearethefirehouse.com/aspect-ratio-cheat-sheet
  // https://noamkroll.com/the-definitive-aspect-ratio-resolution-guide-for-video-2k-4k-6k-8k-every-other-major-format/
  // '2K': [2048, 1152, 'px'],
  // '3K': [3072, 1728, 'px'],
  // '4K': [4096, 2304, 'px'],
  // '5K': [5120, 2880, 'px'],
  // '6K': [6144, 3456, 'px'],
  // '8K': [8192, 4608, 'px'],
  // Cinema (DCI)
  // https://www.wearethefirehouse.com/aspect-ratio-cheat-sheet
  // https://noamkroll.com/the-definitive-aspect-ratio-resolution-guide-for-video-2k-4k-6k-8k-every-other-major-format/
  // 'Cinema 2K': [2048, 1080, 'px'],
  // 'Cinema 4K': [4096, 2160, 'px'],
} as const
