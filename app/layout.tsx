import "../public/scss/main.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <div id="wrapper">{children}</div>
      </body>
    </html>
  );
}
