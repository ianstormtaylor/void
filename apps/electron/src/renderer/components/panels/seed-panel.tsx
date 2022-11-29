import { NumberField } from '../fields/number-field'
import { MdEast, MdFingerprint, MdWest } from 'react-icons/md'
import { useTab } from '../../contexts/tab'
import { SidebarPanel } from '../ui/sidebar-panel'
import { IconButton } from '../ui/icon-button'
import { useSketch } from '../../contexts/sketch'
import { useCallback } from 'react'
import { unhashInt, unhashSeed } from '../../utils'

export const SeedPanel = () => {
  const [, changeTab] = useTab()
  const sketch = useSketch()
  const seed = unhashSeed(sketch.hash)
  const min = 1
  const max = 2 ** 32
  const setSeed = useCallback(
    (s: number) => {
      changeTab((t) => {
        t.seed = Math.min(Math.max(s, min), max)
      })
    },
    [changeTab, min, max]
  )

  return (
    <SidebarPanel
      title="Seed"
      summary={`#${seed}`}
      buttons={
        <>
          <IconButton disabled={seed === min} onClick={() => setSeed(seed - 1)}>
            <MdWest />
          </IconButton>
          <IconButton disabled={seed === max} onClick={() => setSeed(seed + 1)}>
            <MdEast />
          </IconButton>
        </>
      }
    >
      <NumberField
        icon={<MdFingerprint />}
        label="Seed"
        value={seed}
        step={1}
        min={min}
        max={max}
        onChange={(seed) => setSeed(seed)}
      />
    </SidebarPanel>
  )
}
