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
      <body className='bg-repeat bg-parchment-pattern'>
        <div className='flex flex-col min-h-screen justify-between' >
          <header id="Banner" className="bg-emerald-500 text-white p-4 border-b-4 border-emerald-800 rounded-b-3xl mb-2">
            <h1 className="font-titleFont">BotC-Tools</h1>
          </header>

          <main className='md:p-4'>
            {children}
          </main>

          <footer className='w-full top-full bg-black bg-opacity-70 text-gray-200 text-sm flex justify-between'>
            <p>© 2024 BotC-Tools</p>
            <p></p>
          </footer>
        </div>
      </body>
    </html>
  )
}