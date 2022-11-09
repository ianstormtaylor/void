import { useEffect, useState } from 'react'
import { parse } from 'stacktrace-parser'
import { SourceMapConsumer, RawSourceMap } from 'source-map'
import { useEntrypoint } from '../contexts/entrypoint'

export let EditorConsole = (props: { error: Error }) => {
  let { error } = props
  let [frames, setFrames] = useState<Frame[]>([])

  useEffect(() => {
    parseFrames(error)
      .then((frames) => setFrames(frames))
      .catch((e) => console.error(e))
  }, [error])

  return (
    <div className="mx-4">
      <div className="bg-gray-900 p-5 pt-4 max-h-80 overflow-auto rounded-t-lg">
        <p className="mb-3 text-base font-mono">
          <span className="text-red-500">{error.name}: </span>
          <span className="text-gray-200">{error.message}</span>
        </p>
        <div className="space-y-3">
          {frames.map((frame) => (
            <EditorErrorFrame
              key={`${frame.file}:${frame.line}:${frame.column}`}
              frame={frame}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

let EditorErrorFrame = (props: { frame: Frame }) => {
  let entrypoint = useEntrypoint()
  let { frame } = props
  let { original } = frame
  let isSketch = frame.file === entrypoint.url
  let [expanded, setExpanded] = useState(true)
  let pad = Math.max(...original.context.map((c) => c.line.toString().length))
  let [first] = original.context
  let last = original.context.at(-1)
  console.log(frame)
  return (
    <div>
      <h6 className="mt-0 text-xs text-gray-300 font-mono">
        {isSketch && original.method == null
          ? null
          : original.method ?? frame.method ?? '<unknown>'}
      </h6>
      <div className="text-[10px] mb-2 text-gray-400 font-mono">
        {original.file}:{original.line}:{original.column}
      </div>
      {expanded ? (
        <pre className="text-xs bg-gray-800 py-1">
          <code>
            {original.context.map((c) => {
              return (
                <EditorErrorLine
                  key={c.line}
                  row={c}
                  line={original.line}
                  column={original.column}
                  pad={pad}
                />
              )
            })}
          </code>
        </pre>
      ) : null}
    </div>
  )
}

let EditorErrorLine = (props: {
  row: Row
  line: number
  column: number
  pad: number
}) => {
  let { row, line, column, pad } = props
  let highlight = row.line === line
  return (
    <div>
      <span
        className={`
          inline-block px-1.5 py-px 
          ${highlight ? 'text-red-400/80' : 'text-gray-600'}
        `}
      >
        {row.line.toString().padStart(pad)}
      </span>
      <span
        className={`
        inline-block pl-1.5 pr-px py-px 
        ${highlight ? 'text-red-400/80' : 'text-gray-500'}
      `}
      >
        {highlight ? row.text.slice(0, column) : row.text}
      </span>
      {highlight ? (
        <span className="inline-block pr-px py-px text-red-400 bg-red-500/20">
          {row.text.slice(column)}
        </span>
      ) : null}
    </div>
  )
}

type Frame = {
  file: string
  line: number
  column: number
  method: string | null
  text: string
  context: Row[]
  original: Omit<Frame, 'original'>
}

type Row = {
  line: number
  text: string
}

async function parseFrames(error: Error): Promise<Frame[]> {
  let frames = parse(error.stack!)
  let files = new Set<string>()
  let cache: Record<string, { text: string; sourcemap: SourceMapConsumer }> = {}

  for (let frame of frames) {
    let { file, methodName } = frame

    if (file != null) {
      // Convert local files to the proper URL scheme.
      if (
        file.startsWith('/') || // Posix
        /^[a-z]:\\/i.test(file) || // Win32
        file.startsWith('\\\\') // Win32 UNC
      ) {
        file = frame.file = `file://${file}`
      }

      files.add(file)
    }
  }

  await Promise.all(
    Array.from(files).map(async (file) => {
      const text = await fetch(file).then((r) => r.text())
      const sourcemap = await getSourceMap(file, text)
      cache[file] = { text, sourcemap }
    })
  )

  let results: Frame[] = []

  for (let frame of frames) {
    let { file, lineNumber: line, column, methodName: method } = frame
    if (file == null || line == null || column == null) {
      throw new Error('unknown frame!')
    }

    // Skip frames above the `Sketch.exec` call in Void's library.
    if (method === 'exec' && new URL(file).pathname.endsWith('void.mjs')) {
      break
    }

    let { text, sourcemap } = cache[file]
    let original = sourcemap.originalPositionFor({ line, column })
    let originalText = sourcemap.sourceContentFor(original.source)
    results.push({
      file,
      line,
      column,
      method: method === '<unknown>' ? null : method,
      text,
      context: getLinesAround(text, line, 3),
      original: {
        file: original.source,
        line: original.line,
        column: original.column,
        method: original.name ?? null,
        text: originalText,
        context: getLinesAround(originalText, original.line, 3),
      },
    })
  }

  return results
}

/** Get `n` lines around `line` in `text`. */
function getLinesAround(text: string, line: number, n: number): Row[] {
  let lines = text.split('\n')
  let context: { line: number; text: string }[] = []
  let start = Math.max(0, line - 1 - n)
  let end = Math.min(lines.length - 1, line - 1 + n)
  for (let i = start; i <= end; ++i) {
    context.push({ line: i + 1, text: lines[i] })
  }
  return context
}

/** Get a `SourceMapConsumer` from a `file` with `text` content. */
async function getSourceMap(
  file: string,
  text: string
): Promise<SourceMapConsumer> {
  let url = getSourceMapUrl(text)
  if (!url) {
    throw new Error(`Cannot find a source map directive for ${file}.`)
  }

  let raw: RawSourceMap
  if (url.indexOf('data:') === 0) {
    let base64 = /^data:application\/json;([\w=:"-]+;)*base64,/
    let match2 = url.match(base64)
    if (!match2) {
      throw new Error(
        'Sorry, non-base64 inline source-map encoding is not supported.'
      )
    }
    url = url.substring(match2[0].length)
    url = window.atob(url)
    raw = JSON.parse(url)
  } else {
    let index = file.lastIndexOf('/')
    url = file.substring(0, index + 1) + url
    raw = await fetch(url).then((res) => res.json())
  }

  return new SourceMapConsumer(raw)
}

/** Get the source map URL from a `file` with `text` content. */
function getSourceMapUrl(text: string): string | null {
  const regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm
  let match = null
  for (;;) {
    let next = regex.exec(text)
    if (next == null) break
    match = next
  }

  return match != null && match[1] != null ? match[1].toString() : null
}
