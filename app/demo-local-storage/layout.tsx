import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo Local Storage - Recipunto',
  description: 'Demostración completa del sistema de Local Storage con CRUD, formularios persistentes, toggles de UI y eventos en tiempo real.',
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}

