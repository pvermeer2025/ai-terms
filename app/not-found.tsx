import Link from "next/link";

export default function NotFound() {
  return (
    <div className="at-container">
      <p className="at-kicker">AI Glossary</p>
      <h1 className="at-title">Pagina niet gevonden</h1>
      <p className="at-intro">Dit begrip of dit adres staat niet in de lijst.</p>
      <Link className="at-btn" href="/begrippen">
        Naar begrippen
      </Link>
    </div>
  );
}
