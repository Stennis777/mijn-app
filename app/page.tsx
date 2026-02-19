import { getAllEvents } from "@/lib/events";
import EventAgenda from "@/app/components/EventAgenda";

export default function Home() {
  const events = getAllEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">E-commerce</span>
            <span className="text-2xl font-bold text-gray-900">Events NL</span>
          </div>
          <span className="text-sm text-gray-400">{events.length} evenementen</span>
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
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="bg-blue-500/40 text-white text-sm font-medium px-3 py-1 rounded-full">
                Conferenties
              </span>
              <span className="bg-blue-500/40 text-white text-sm font-medium px-3 py-1 rounded-full">
                Beurzen
              </span>
              <span className="bg-blue-500/40 text-white text-sm font-medium px-3 py-1 rounded-full">
                Workshops
              </span>
              <span className="bg-blue-500/40 text-white text-sm font-medium px-3 py-1 rounded-full">
                Networking
              </span>
            </div>
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
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} E-commerce Events NL
        </div>
      </footer>
    </div>
  );
}
