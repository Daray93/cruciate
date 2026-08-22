import type { RomEntry } from '../types'
import { KneeAngleVisual } from './KneeAngleVisual'
import './RomTracker.css'

// Realistic clinical ranges — extension is degrees short of fully straight
// (0° = ideal), flexion is degrees of bend achieved (higher = better).
const EXTENSION_MIN = 0
const EXTENSION_MAX = 30
const FLEXION_MIN = 0
const FLEXION_MAX = 150

interface RomTrackerProps {
  reading: RomEntry
  onChange: (patch: Partial<RomEntry>) => void
}

export function RomTracker({ reading, onChange }: RomTrackerProps) {
  const extensionValue = reading.extension === '' ? null : Number(reading.extension)
  const flexionValue = reading.flexion === '' ? null : Number(reading.flexion)

  return (
    <section className="rom-tracker">
      <h2>Range of motion</h2>

      <div className="rom-slider-block">
        <div className="rom-slider-header">
          <label htmlFor="rom-extension">Extension</label>
          <span className="rom-slider-value">
            {extensionValue === null ? 'Not logged yet' : `${extensionValue}° from straight`}
          </span>
        </div>
        <div className="rom-slider-row">
          <KneeAngleVisual angle={extensionValue ?? 0} maxAngle={EXTENSION_MAX} />
          <div className="rom-slider-control">
            <input
              id="rom-extension"
              type="range"
              min={EXTENSION_MIN}
              max={EXTENSION_MAX}
              step={1}
              value={extensionValue ?? 0}
              onChange={(e) => onChange({ extension: e.target.value })}
              className="rom-slider"
            />
            <div className="rom-slider-scale">
              <span>0° · fully straight</span>
              <span>{EXTENSION_MAX}°+ · can't straighten</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rom-slider-block">
        <div className="rom-slider-header">
          <label htmlFor="rom-flexion">Flexion</label>
          <span className="rom-slider-value">{flexionValue === null ? 'Not logged yet' : `${flexionValue}° bend`}</span>
        </div>
        <div className="rom-slider-row">
          <KneeAngleVisual angle={flexionValue ?? 0} maxAngle={FLEXION_MAX} />
          <div className="rom-slider-control">
            <input
              id="rom-flexion"
              type="range"
              min={FLEXION_MIN}
              max={FLEXION_MAX}
              step={5}
              value={flexionValue ?? 0}
              onChange={(e) => onChange({ flexion: e.target.value })}
              className="rom-slider"
            />
            <div className="rom-slider-scale">
              <span>0° · straight leg</span>
              <span>{FLEXION_MAX}°+ · full bend</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
