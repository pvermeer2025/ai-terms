import Image from "next/image";
import Link from "next/link";

export function SiteFooter({ topics }: { topics: { slug: string; name: string }[] }) {
  const year = new Date().getFullYear();
  const email = process.env.CONTACT_EMAIL?.trim();

  return (
    <div className="at-footer-wrap" id="contact">
      <footer className="at-footer">
        <div className="at-footer-body">
          <div className="at-footer-about">
            <Link href="/begrippen" className="at-logo">
              <Image src="/images/logo/logo.svg" alt="TOPBOT" width={193} height={65} />
            </Link>
            <p className="at-blurb">AI-termen in gewone taal voor het MKB.</p>
          </div>
          <div className="at-footer-cols">
            <div>
              <h2 className="at-footer-heading">Snel naar</h2>
              <ul className="at-footer-links">
                <li>
                  <Link href="/begrippen">Home</Link>
                </li>
                <li>
                  <Link href="/begrippen">Begrippen</Link>
                </li>
                <li>
                  <Link href="/begrippen/letter/a">A–Z</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="at-footer-heading">Onderwerpen</h2>
              <ul className="at-footer-links">
                {topics.map((topic) => (
                  <li key={topic.slug}>
                    <Link href={`/begrippen/onderwerp/${topic.slug}`}>{topic.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="at-footer-heading">Contact</h2>
              <ul className="at-footer-links">
                <li>
                  <a href="#contact">Term gemist?</a>
                </li>
                <li>
                  {email ? <a href={`mailto:${email}`}>E-mail</a> : <a href="#contact">E-mail</a>}
                </li>
                <li>
                  <a href="#contact">Nieuwsbrief</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="at-footer-bottom">
          <span>© {year} AI Pulse</span>
          <ul className="at-legal">
            <li>
              <a href="#privacy">Privacy</a>
            </li>
            <li>
              <a href="#voorwaarden">Voorwaarden</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
