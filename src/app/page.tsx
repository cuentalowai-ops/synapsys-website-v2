export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 py-16 px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Synapsys
          </h1>
          <p className="text-xl font-semibold text-muted-foreground">
            EUDI Wallet Relying Party Dashboard
          </p>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Enterprise-grade dashboard for EUDI wallet verification and management.
            Compliant with eIDAS 2.0, GDPR, NIS2, and ISO 27001.
          </p>
        </div>
        
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-card-foreground">
            <h3 className="mb-2 text-lg font-semibold">OpenID4VP</h3>
            <p className="text-sm text-muted-foreground">
              Integrated with synapsys-verifier for secure credential verification
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground">
            <h3 className="mb-2 text-lg font-semibold">eIDAS 2.0</h3>
            <p className="text-sm text-muted-foreground">
              Full compliance with European Digital Identity standards
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground">
            <h3 className="mb-2 text-lg font-semibold">Security First</h3>
            <p className="text-sm text-muted-foreground">
              GDPR, NIS2, and ISO 27001 compliant architecture
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/ui</p>
        </div>
      </main>
    </div>
  );
}
