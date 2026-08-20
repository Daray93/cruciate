import type { RomEntry } from '../types'
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
        <label>
          <span>Extension (°)</span>
          <input
            type="number"
            inputMode="decimal"
            value={reading.extension}
            onChange={(e) => onChange({ extension: e.target.value })}
          />
        </label>
        <label>
          <span>Flexion (°)</span>
          <input
            type="number"
            inputMode="decimal"
            value={reading.flexion}
            onChange={(e) => onChange({ flexion: e.target.value })}
          />
        </label>
      </div>
    </section>
  )
}
