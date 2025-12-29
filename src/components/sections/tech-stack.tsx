const techStack = [
  { name: "Next.js 15", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Redis", category: "Cache" },
  { name: "OpenID4VP", category: "Protocol" },
  { name: "Docker", category: "Infrastructure" },
]

export function TechStackSection() {
  return (
    <section id="tech" className="bg-gradient-subtle py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Modern Tech Stack
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Built with industry-leading technologies for performance and reliability
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group rounded-lg border bg-white p-6 text-center transition-all hover:border-teal-300 hover:shadow-md"
            >
              <div className="mb-2 font-display text-lg font-semibold text-foreground group-hover:text-teal-600">
                {tech.name}
              </div>
              <div className="text-xs text-muted-foreground">{tech.category}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

