import './LegalPage.css'

interface LegalPageProps {
  title: string
  text: string
}

export function LegalPage({ title, text }: LegalPageProps) {
  return (
    <div className="legal-page">
      <h1>{title}</h1>
      <div className="legal-page-text">
        {text.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <a className="legal-page-back" href="/">
        Back to Cruciate
      </a>
    </div>
  )
}
