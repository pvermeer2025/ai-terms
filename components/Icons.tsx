export function IconSearch({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconGrid() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" />
      <rect x="9" y="1" width="6" height="6" />
      <rect x="1" y="9" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  );
}

export function IconList() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="1" y="2" width="14" height="2" />
      <rect x="1" y="7" width="14" height="2" />
      <rect x="1" y="12" width="14" height="2" />
    </svg>
  );
}

export function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

export function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.5 3h2.7l-5.9 6.7L22 21h-6.2l-4.3-5.6L6.4 21H3.7l6.3-7.2L2 3h6.4l3.9 5.2L17.5 3zm-1 16.2h1.5L7.6 4.7H6L16.5 19.2z" />
    </svg>
  );
}

export function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.3 9.3H3.5V20h2.8V9.3zM4.9 4C3.9 4 3 4.9 3 5.9s.9 1.9 1.9 1.9 1.9-.9 1.9-1.9S5.9 4 4.9 4zM20.5 13.3c0-2.6-1.4-3.8-3.3-3.8-1.5 0-2.2.8-2.6 1.4V9.3h-2.8c0 .8 0 10.7 0 10.7h2.8v-6c0-.3 0-.6.1-.8.3-.6.9-1.3 1.9-1.3 1.3 0 1.9 1 1.9 2.5V20h2.8v-6.7z" />
    </svg>
  );
}

export function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm5 2.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.8 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
    </svg>
  );
}
