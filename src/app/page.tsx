'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'
import { TechButton } from '@/components/ui/TechButton'
import { ScanButton } from '@/components/ui/ScanButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Componente para el mapa de nodos SVG animado
function NetworkMap() {
  const nodes = [
    { id: 'ES', x: '20%', y: '40%', label: 'ES-2' },
    { id: 'FR', x: '30%', y: '35%', label: 'FR-1' },
    { id: 'DE', x: '50%', y: '30%', label: 'DE-3' },
    { id: 'IT', x: '45%', y: '50%', label: 'IT-1' },
    { id: 'NL', x: '40%', y: '25%', label: 'NL-2' },
    { id: 'BE', x: '35%', y: '28%', label: 'BE-1' },
  ]

  return (
    <div className="relative w-full h-64 md:h-96 border border-structure">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* Líneas de conexión */}
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((target) => (
            <line
              key={`${node.id}-${target.id}`}
              x1={node.x}
              y1={node.y}
              x2={target.x}
              y2={target.y}
              stroke="rgba(56, 189, 248, 0.1)"
              strokeWidth="1"
            />
          ))
        )}
        {/* Nodos */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill="#38BDF8"
              className="animate-pulse"
            />
            <text
              x={node.x}
              y={parseFloat(node.y) + 20}
              textAnchor="middle"
              className="text-data fill-text-muted"
              fontSize="10"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// Componente para logs simulados en tiempo real
function DataStream() {
  const [logs, setLogs] = useState<string[]>([])
  
  useEffect(() => {
    const logMessages = [
      'Verifying node ES-2... OK',
      'Establishing secure channel... OK',
      'Validating certificate chain... OK',
      'Peer connection established... OK',
      'Synchronizing trust registry... OK',
    ]
    
    let index = 0
    const interval = setInterval(() => {
      if (index < logMessages.length) {
        setLogs(prev => [...prev.slice(-4), logMessages[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 1500)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border border-structure bg-void-surface/50 p-4 h-64 overflow-y-auto">
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="text-data text-text-muted font-mono text-xs">
            <span className="text-truth">[{new Date().toLocaleTimeString()}]</span> {log}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-void text-text-primary relative overflow-x-hidden">
      {/* Header Brutalista */}
      <header className="sticky top-0 z-50 border-b border-structure bg-void/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-truth flex items-center justify-center text-truth font-mono text-xs">
              S
            </div>
            <span className="text-lg font-display font-bold uppercase tracking-tight">
              SYNAPSYS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#technology" className="text-data text-text-muted hover:text-truth transition-colors">
              TECHNOLOGY
            </a>
            <a href="#trust" className="text-data text-text-muted hover:text-truth transition-colors">
              TRUST
            </a>
            <Link href="/dashboard" className="text-data text-text-muted hover:text-truth transition-colors">
              DASHBOARD
            </Link>
          </nav>

          <TechButton href="/dashboard" size="sm">
            INITIATE
          </TechButton>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="border-b border-structure py-12 md:py-24 px-4 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8">
              {/* Left: Headline + CTA */}
              <div className="md:col-span-7 space-y-8">
                <div>
                  <div className="badge-pill mb-6 inline-block">
                    SYSTEM OPERATIONAL
                  </div>
                  <h1 className="text-hero mb-6">
                    DECENTRALIZED TRUST<br />
                    INFRASTRUCTURE
                  </h1>
                  <p className="text-fluid-body text-text-muted max-w-2xl mb-8">
                    OpenID4VP compliant engine. Zero-knowledge proofs. &lt;50ms latency.
                  </p>
                  <ScanButton href="/dashboard" size="lg" className="min-w-[200px]">
                    INITIATE SEQUENCE
                    <ArrowRight className="ml-2 h-4 w-4 inline" />
                  </ScanButton>
                </div>
              </div>

              {/* Right: Network Map + Data Stream */}
              <div className="md:col-span-5 space-y-4">
                <GlassCard>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-truth animate-pulse rounded-full"></div>
                      <span className="text-data text-text-muted uppercase">NETWORK STATUS</span>
                    </div>
                    <NetworkMap />
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-truth animate-pulse rounded-full"></div>
                      <span className="text-data text-text-muted uppercase">DATA STREAM</span>
                    </div>
                    <DataStream />
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY SECTION */}
        <section id="technology" className="border-b border-structure py-12 md:py-24 px-4 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-fluid-h1 font-display uppercase tracking-tight mb-12 text-text-primary">
              TECHNOLOGY
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Protocol */}
              <GlassCard border="none" className="p-6">
                <div className="tech-container mb-4 w-fit">
                  <Shield className="h-6 w-6 text-truth" />
                </div>
                <h3 className="text-fluid-h3 font-display uppercase mb-4 text-text-primary">
                  PROTOCOL
                </h3>
                <p className="text-fluid-body text-text-muted mb-4">
                  Native OID4VP implementation supporting ISO mDL formats.
                </p>
                <div className="space-y-2">
                  <div className="data-display">
                    <span className="text-truth">PROTOCOL:</span> OID4VP 1.0
                  </div>
                  <div className="data-display">
                    <span className="text-truth">FORMAT:</span> ISO mDL
                  </div>
                </div>
              </GlassCard>

              {/* Card 2: Privacy */}
              <GlassCard border="none" className="p-6">
                <div className="tech-container mb-4 w-fit">
                  <Lock className="h-6 w-6 text-truth" />
                </div>
                <h3 className="text-fluid-h3 font-display uppercase mb-4 text-text-primary">
                  PRIVACY
                </h3>
                <p className="text-fluid-body text-text-muted mb-4">
                  GDPR Article 5 compliant by design. No PII storage on edge nodes.
                </p>
                <div className="space-y-2">
                  <div className="data-display">
                    <span className="text-truth">COMPLIANCE:</span> GDPR Art. 5
                  </div>
                  <div className="data-display">
                    <span className="text-truth">STORAGE:</span> Zero PII
                  </div>
                </div>
              </GlassCard>

              {/* Card 3: Architecture */}
              <GlassCard border="none" className="p-6">
                <div className="tech-container mb-4 w-fit">
                  <Zap className="h-6 w-6 text-truth" />
                </div>
                <h3 className="text-fluid-h3 font-display uppercase mb-4 text-text-primary">
                  ARCHITECTURE
                </h3>
                <p className="text-fluid-body text-text-muted mb-4">
                  Serverless Edge Runtime backed by Redis KV.
                </p>
                <div className="space-y-2">
                  <div className="data-display">
                    <span className="text-truth">RUNTIME:</span> Serverless Edge
                  </div>
                  <div className="data-display">
                    <span className="text-truth">STORAGE:</span> Redis KV
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section id="trust" className="border-b border-structure py-12 md:py-24 px-4 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-fluid-h1 font-display uppercase tracking-tight mb-12 text-text-primary">
              TRUST
            </h2>
            
            <GlassCard border="none" className="overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-white/5 bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-data text-text-muted uppercase">CERTIFICATION</th>
                    <th className="text-left p-4 text-data text-text-muted uppercase">STATUS</th>
                    <th className="text-left p-4 text-data text-text-muted uppercase">VALID UNTIL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-text-primary">ISO_27001</td>
                    <td className="p-4">
                      <StatusBadge status="success">CERTIFIED</StatusBadge>
                    </td>
                    <td className="p-4 font-mono text-text-muted">2026-12-31</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-text-primary">EIDAS_TSP</td>
                    <td className="p-4">
                      <StatusBadge status="success">CERTIFIED</StatusBadge>
                    </td>
                    <td className="p-4 font-mono text-text-muted">2026-12-31</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-text-primary">SOC2_TYPE_II</td>
                    <td className="p-4">
                      <StatusBadge status="active">IN_PROGRESS</StatusBadge>
                    </td>
                    <td className="p-4 font-mono text-text-muted">PENDING</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-text-primary">NIS2_COMPLIANT</td>
                    <td className="p-4">
                      <StatusBadge status="success">COMPLIANT</StatusBadge>
                    </td>
                    <td className="p-4 font-mono text-text-muted">ONGOING</td>
                  </tr>
                </tbody>
              </table>
            </GlassCard>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-12 md:py-24 px-4 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto text-center">
            <GlassCard border="none" className="p-12">
              <h2 className="text-fluid-h1 font-display uppercase tracking-tight mb-6 text-text-primary">
                READY TO DEPLOY?
              </h2>
              <p className="text-fluid-body text-text-muted mb-8 max-w-2xl mx-auto">
                INITIATE VERIFICATION SEQUENCE // CONNECT TO EUDI WALLET // VALIDATE CREDENTIALS IN &lt; 2S
              </p>
              <ScanButton href="/dashboard" size="lg">
                ACCESS DASHBOARD
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </ScanButton>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* FOOTER BRUTALISTA */}
      <footer className="border-t border-structure py-8 px-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 border-b border-structure pb-8 mb-8">
            <div>
              <h4 className="text-data text-text-primary uppercase mb-4">SYSTEM</h4>
              <ul className="space-y-2">
                <li><a href="#technology" className="text-data text-text-muted hover:text-truth">TECHNOLOGY</a></li>
                <li><a href="#trust" className="text-data text-text-muted hover:text-truth">TRUST</a></li>
                <li><Link href="/dashboard" className="text-data text-text-muted hover:text-truth">DASHBOARD</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-data text-text-primary uppercase mb-4">COMPLIANCE</h4>
              <ul className="space-y-2">
                <li className="text-data text-text-muted">GDPR Art. 5</li>
                <li className="text-data text-text-muted">eIDAS 2.0</li>
                <li className="text-data text-text-muted">NIS2</li>
              </ul>
            </div>
            <div>
              <h4 className="text-data text-text-primary uppercase mb-4">STATUS</h4>
              <div className="space-y-2">
                <StatusBadge status="success">PRODUCTION</StatusBadge>
                <div className="text-data text-text-muted text-xs mt-2">
                  UPTIME: 99.9%
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-data text-text-muted text-xs">
              © 2025 SYNAPSYS // THE TRUST PROTOCOL FOR EUROPE // SSE-POWERED REAL-TIME VERIFICATION
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
