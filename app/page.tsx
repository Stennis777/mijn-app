import { getAllEvents } from "@/lib/events";
import EventAgenda from "@/app/components/EventAgenda";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const events = getAllEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">E-commerce</span>
            <span className="text-2xl font-bold text-gray-900">Events NL</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://evolvedigital.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span>Powered by</span>
              <Image
                src="https://cdn.prod.website-files.com/684487646291b265c36714a2/68448d1b4b1c8edbe1382b9d_Evolve-logo-text-only-wide-color.svg"
                alt="Evolve Digital"
                width={90}
                height={20}
                className="h-5 w-auto"
              />
            </a>
            <Link
              href="/aanmelden"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Evenement aanmelden
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              E-commerce Events in Nederland
            </h1>
            <p className="text-blue-100 text-lg sm:text-xl leading-relaxed">
              Ontdek alle e-commerce evenementen, conferenties en beurzen in Nederland.
              Blijf op de hoogte van de laatste trends en netwerk met vakgenoten.
            </p>
          </div>
        </div>
      </section>

      {/* Agenda */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
          <span className="text-sm text-gray-500">Gesorteerd op datum</span>
        </div>
        <EventAgenda events={events} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            © {new Date().getFullYear()} E-commerce Events NL
          </span>
          <a
            href="https://evolvedigital.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-600 transition-colors"
          >
            <span>Powered by</span>
            <Image
              src="https://cdn.prod.website-files.com/684487646291b265c36714a2/68448d1b4b1c8edbe1382b9d_Evolve-logo-text-only-wide-color.svg"
              alt="Evolve Digital"
              width={90}
              height={20}
              className="h-5 w-auto opacity-60 hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}
