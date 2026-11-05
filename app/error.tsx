"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="at-container">
      <p className="at-kicker">AI Glossary</p>
      <h1 className="at-title">Er ging iets mis</h1>
      <p className="at-intro">De pagina kon niet geladen worden.</p>
      <button type="button" className="at-btn" onClick={() => reset()}>
        Opnieuw proberen
      </button>
    </div>
  );
}
