import Link from "next/link";
import { pageWindow } from "@/lib/routes";

export function Pagination({
  page,
  pages,
  hrefFor,
}: {
  page: number;
  pages: number;
  hrefFor: (page: number) => string;
}) {
  if (pages <= 1) return null;
  const items = pageWindow(page, pages);
  const next = page < pages ? hrefFor(page + 1) : null;

  return (
    <nav className="at-pagination" aria-label="Paginering">
      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="at-page-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            className={item === page ? "at-page is-active" : "at-page"}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Link>
        ),
      )}
      {next ? (
        <Link className="at-page" href={next}>
          Volgende →
        </Link>
      ) : null}
    </nav>
  );
}
