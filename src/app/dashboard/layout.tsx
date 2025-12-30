"use client"

// Layout mínimo - sin Sidebar, el header está en cada página
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-void">
      {children}
    </div>
  )
}
