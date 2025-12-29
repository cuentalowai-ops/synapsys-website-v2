const techStack = [
  { name: "Next.js 15", category: "React framework with App Router" },
  { name: "TypeScript", category: "Type-safe development" },
  { name: "Tailwind CSS", category: "Utility-first styling" },
  { name: "OpenID4VP", category: "Verifiable presentations" },
  { name: "PostgreSQL", category: "Reliable database" },
  { name: "Docker", category: "Containerized deployment" },
]

export function TechStackSection() {
  return (
    <section id="technology" className="bg-white py-12 sm:py-16 md:py-20 lg:py-28 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] tracking-[-0.01em] text-gradient-teal sm:text-4xl md:text-5xl">
            Built With Modern Technology
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
            Powered by industry-leading tools and frameworks
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {techStack.map((tech, index) => (
            <div
              key={tech.name}
              className="group bg-white/95 backdrop-blur-lg border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center transition-all duration-300 hover:border-teal-500/50 hover-lift card-shadow-glow animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-2 font-display text-base font-semibold text-gray-800 group-hover:text-teal-600 sm:text-lg">
                {tech.name}
              </div>
              <div className="text-xs font-medium text-gray-600">{tech.category}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

