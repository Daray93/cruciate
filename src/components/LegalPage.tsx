import { IconChevronLeft } from './icons'
import './LegalPage.css'

interface LegalPageProps {
  title: string
  text: string
  /** When set, renders the header back-button as an in-app "Settings" action instead of a link to "/". */
  onBack?: () => void
}

export function LegalPage({ title, text, onBack }: LegalPageProps) {
  return (
    <main className="app-shell">
      <header className="subpage-header subpage-header-inline">
        {onBack ? (
          <button type="button" className="subpage-back" onClick={onBack}>
            <IconChevronLeft />
            Settings
          </button>
        ) : (
          <a className="subpage-back" href="/">
            <IconChevronLeft />
            Home
          </a>
        )}
        <h1>{title}</h1>
      </header>

      <div className="legal-page-text">
        {text.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </main>
  )
}
