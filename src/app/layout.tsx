import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/header'
import { Container } from "@mui/material"
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'N式家計簿',
  description: '家計簿',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <body className={inter.className}>
        <Header />
        <Container maxWidth="sm" className="mx-auto">
        {children}
        </Container>
      </body>
    </html>
  )
}
