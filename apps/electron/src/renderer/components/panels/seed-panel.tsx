import { NumberField } from '../fields/number-field'
import { MdEast, MdFingerprint, MdWest } from 'react-icons/md'
import { useTab } from '../../contexts/tab'
import { SidebarPanel } from '../ui/sidebar-panel'
import { IconButton } from '../ui/icon-button'
import { useSketch } from '../../contexts/sketch'
import { useCallback } from 'react'
import { unhashInt } from '../../utils'

export let SeedPanel = () => {
  let [, changeTab] = useTab()
  let sketch = useSketch()
  let seed = unhashInt(Number(sketch.hash))
  let min = 1
  let max = 2 ** 32

  let setSeed = useCallback(
    (s: number) => {
      changeTab((t) => {
        t.seed = Math.min(Math.max(s, 1), 2 ** 32)
      })
    },
    [changeTab]
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
