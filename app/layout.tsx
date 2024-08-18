import './global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </head>
      <body>
        <div id="Banner" className="bg-blue-500 text-white p-4 border-4 border-emerald-800 rounded-lg mb-2">
          <h1 className="font-titleFont">BotC-Tools</h1>
        </div>
        {children}
      </body>
    </html>
  )
}