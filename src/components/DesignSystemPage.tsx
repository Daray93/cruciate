import { useState } from 'react'
import { Alert } from './Alert'
import { FloatingInput } from './FloatingInput'
import { IconCheck, IconMoon, IconSun } from './icons'
import { IllustrationFigureBase, IllustrationMiniSquat, IllustrationQuadSet } from './illustrations'
import './DesignSystemPage.css'

const COLOR_TOKENS = [
  { name: '--bg', label: 'Background' },
  { name: '--surface', label: 'Surface' },
  { name: '--surface-raised', label: 'Surface raised' },
  { name: '--border', label: 'Border' },
  { name: '--ink', label: 'Ink' },
  { name: '--ink-muted', label: 'Ink muted' },
] as const

const SEMANTIC_TOKENS = [
  { name: '--teal', soft: '--teal-soft', label: 'Teal (primary)' },
  { name: '--amber', soft: '--amber-soft', label: 'Amber (caution)' },
  { name: '--green', soft: '--green-soft', label: 'Green (positive)' },
  { name: '--red', soft: '--red-soft', label: 'Red (danger)' },
] as const

const SPACE_TOKENS = [
  '--space-1',
  '--space-2',
  '--space-3',
  '--space-4',
  '--space-5',
  '--space-6',
  '--space-7',
  '--space-8',
] as const

const RADIUS_TOKENS = ['--radius-sm', '--radius-md', '--radius-lg'] as const

export function DesignSystemPage() {
  const [demoValue, setDemoValue] = useState('')
  const [checked, setChecked] = useState(false)

  return (
    <main className="design-system-page">
      <header>
        <h1>Cruciate design system</h1>
        <p>Reference view of the tokens and components in play. Not part of the shipped app.</p>
      </header>

      <section>
        <h2>Color: base</h2>
        <div className="swatch-grid">
          {COLOR_TOKENS.map((token) => (
            <div className="swatch" key={token.name}>
              <div className="swatch-color" style={{ background: `var(${token.name})` }} />
              <div className="swatch-label">{token.label}</div>
              <code>{token.name}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Color: semantic</h2>
        <div className="swatch-grid">
          {SEMANTIC_TOKENS.map((token) => (
            <div className="swatch" key={token.name}>
              <div className="swatch-color" style={{ background: `var(${token.name})` }} />
              <div className="swatch-color soft" style={{ background: `var(${token.soft})` }} />
              <div className="swatch-label">{token.label}</div>
              <code>{token.name}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Typography</h2>
        <div className="type-sample">
          <h1>Heading (Brawler 700)</h1>
          <h2>Subheading (Brawler 700)</h2>
          <p className="body-sample">
            Body copy runs in Inter. This is the default weight used for UI chrome, form labels, and
            everything that isn't a heading or long-form reading text.
          </p>
          <p className="muted-sample">Muted text, var(--ink-muted), used for secondary and supporting copy.</p>
        </div>
      </section>

      <section>
        <h2>Spacing scale</h2>
        <div className="scale-list">
          {SPACE_TOKENS.map((token) => (
            <div className="scale-row" key={token}>
              <code>{token}</code>
              <div className="scale-bar" style={{ width: `var(${token})` }} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Radius scale</h2>
        <div className="radius-row">
          {RADIUS_TOKENS.map((token) => (
            <div className="radius-sample" key={token} style={{ borderRadius: `var(${token})` }}>
              <code>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Buttons</h2>
        <div className="component-row">
          <button type="button" className="ds-button-primary">
            Primary
          </button>
          <button type="button" className="ds-button-secondary">
            Secondary
          </button>
          <button type="button" className="ds-button-tab active">
            Tab · active
          </button>
          <button type="button" className="ds-button-tab">
            Tab
          </button>
        </div>
      </section>

      <section>
        <h2>Floating input</h2>
        <div className="component-row">
          <FloatingInput label="Empty" value={demoValue} onChange={(e) => setDemoValue(e.target.value)} />
          <FloatingInput label="Filled" value="120" readOnly />
        </div>
      </section>

      <section>
        <h2>Checkbox</h2>
        <label className="ds-checkbox">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          Checkbox label
        </label>
      </section>

      <section>
        <h2>Icons</h2>
        <div className="component-row icon-row">
          <IconSun className="ds-icon" />
          <IconMoon className="ds-icon" />
          <IconCheck className="ds-icon" />
        </div>
      </section>

      <section>
        <h2>Badges &amp; banners</h2>
        <div className="component-row">
          <span className="ds-badge amber">Locked · needs load clearance</span>
          <span className="ds-badge red">Flagged</span>
        </div>
        <div className="ds-banner">
          <p className="ds-banner-title">Contact your care team before continuing</p>
          <p>The red-flag alert banner: the one place saturated color is meant to dominate.</p>
        </div>
      </section>

      <section>
        <h2>Alerts</h2>
        <div className="component-row alert-row">
          <Alert variant="error">Something went wrong. Try again.</Alert>
          <Alert variant="info">Check your email to confirm your account.</Alert>
        </div>
      </section>

      <section>
        <h2>Exercise illustrations</h2>
        <p className="illustration-note">
          Single-weight line rig, monochrome by default, teal motion arrows only where direction
          isn't obvious from a static pose. See src/components/illustrations.tsx for the joint
          coordinates.
        </p>
        <div className="illustration-row">
          <div className="illustration-tile">
            <IllustrationFigureBase className="illustration-figure" />
            <span>Base rig</span>
          </div>
          <div className="illustration-tile">
            <IllustrationQuadSet className="illustration-figure" />
            <span>Quad sets</span>
          </div>
          <div className="illustration-tile">
            <IllustrationMiniSquat className="illustration-figure" />
            <span>Mini squats</span>
          </div>
        </div>
      </section>
    </main>
  )
}
