import './LegalPage.css'

interface LegalPageProps {
  title: string
  text: string
  /** When set, renders as an in-app "Back" button instead of a link to "/". */
  onBack?: () => void
}

export function LegalPage({ title, text, onBack }: LegalPageProps) {
  return (
    <div className="legal-page">
      <h1>{title}</h1>
      <div className="legal-page-text">
        {text.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {onBack ? (
        <button type="button" className="legal-page-back legal-page-back-button" onClick={onBack}>
          Back to Settings
        </button>
      ) : (
        <a className="legal-page-back" href="/">
          Back to Cruciate
        </a>
      )}
    </div>
  )
}
