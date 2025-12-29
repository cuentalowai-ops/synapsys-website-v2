const techStack = [
  { name: "Next.js 15", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "OpenID4VP", category: "Protocol" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Docker", category: "Infrastructure" },
]

export function TechStackSection() {
  return (
    <section id="tech" className="bg-white py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-4 font-display text-3xl font-semibold leading-[1.2] tracking-[-0.01em] text-gradient-teal sm:text-4xl md:text-5xl">
            Modern Tech Stack
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg">
            Built with industry-leading technologies for performance and reliability
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group glass-card rounded-xl sm:rounded-2xl border-2 border-teal-200/40 bg-white p-4 sm:p-6 text-center transition-all duration-300 hover-lift hover:border-teal-400/60 card-shadow-glow"
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

