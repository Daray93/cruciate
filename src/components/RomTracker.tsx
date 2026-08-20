import type { RomEntry } from '../types'
import { FloatingInput } from './FloatingInput'
import './RomTracker.css'

interface RomTrackerProps {
  reading: RomEntry
  onChange: (patch: Partial<RomEntry>) => void
}

export function RomTracker({ reading, onChange }: RomTrackerProps) {
  return (
    <section className="rom-tracker">
      <h2>Range of motion</h2>
      <div className="rom-fields">
        <FloatingInput
          label="Extension (°)"
          type="number"
          inputMode="decimal"
          value={reading.extension}
          onChange={(e) => onChange({ extension: e.target.value })}
        />
        <FloatingInput
          label="Flexion (°)"
          type="number"
          inputMode="decimal"
          value={reading.flexion}
          onChange={(e) => onChange({ flexion: e.target.value })}
        />
      </div>
    </section>
  )
}
