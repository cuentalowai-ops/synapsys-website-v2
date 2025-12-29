import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

const compliances = [
  {
    name: "eIDAS 2.0",
    description: "EU Regulation 2024/1183",
    status: "98% Compliant",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    name: "ISO 27001",
    description: "Information Security",
    status: "Certified",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    name: "NIS2",
    description: "Cybersecurity Directive",
    status: "95% Compliant",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    name: "GDPR",
    description: "Data Protection",
    status: "Fully Compliant",
    color: "bg-pink-50 text-pink-700 border-pink-200",
  },
]

export function ComplianceSection() {
  return (
    <section id="compliance" className="border-y py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Compliance & Standards
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Built with security, privacy, and regulatory compliance as foundational pillars
          </p>
        </div>

        {/* Compliance Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {compliances.map((item) => (
            <div
              key={item.name}
              className={`rounded-xl border p-6 text-center transition-all cursor-glow hover-lift hover:shadow-md ${item.color}`}
            >
              <div className="mb-4 flex justify-center">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-display text-lg font-bold">{item.name}</h3>
              <p className="mb-2 text-xs opacity-80">{item.description}</p>
              <Badge variant="secondary" className="mt-2">
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

