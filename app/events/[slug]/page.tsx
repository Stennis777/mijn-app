import { getAllEvents, getEventBySlug } from "@/lib/events";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/app/components/FavoriteButton";
import ShareButton from "@/app/components/ShareButton";

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({ slug: event.slug }));
}

function formatDate(dateStr: string, endDateStr?: string) {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formatted = date.toLocaleDateString("nl-NL", options);
  if (endDateStr && endDateStr !== dateStr) {
    const endDate = new Date(endDateStr);
    const endFormatted = endDate.toLocaleDateString("nl-NL", options);
    return `${formatted} – ${endFormatted}`;
  }
  return formatted;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar agenda
          </Link>
          <span className="text-gray-200">|</span>
          <span className="text-sm font-medium text-gray-900 truncate">{event.title}</span>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-64 sm:h-80 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 pb-8">
          <span className="inline-block text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-full mb-3">
            {event.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Over dit evenement</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </section>

            {/* Schedule */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Programma</h2>
              <div className="space-y-0">
                {event.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 relative"
                  >
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 shrink-0 z-10" />
                      {index < event.schedule.length - 1 && (
                        <div className="w-px flex-1 bg-blue-100 my-1" />
                      )}
                    </div>
                    <div className="pb-5">
                      <span className="text-sm font-bold text-blue-600">{item.time}</span>
                      <p className="text-gray-800 font-medium">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Speakers */}
            {event.companies && event.companies.length > 0 ? (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Aanwezige bedrijven</h2>
                <div className="flex flex-wrap gap-3">
                  {event.companies.map((company, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-900">{company}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : event.speakers.length > 0 ? (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sprekers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={speaker.image}
                          alt={speaker.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{speaker.name}</p>
                        <p className="text-sm text-blue-600 mb-1">{speaker.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{speaker.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-900">Evenement details</h3>

              <div className="flex gap-3">
                <span className="text-blue-500 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Datum</p>
                  <p className="text-sm text-gray-800 font-medium">{formatDate(event.date, event.endDate)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-blue-500 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Locatie</p>
                  <p className="text-sm text-gray-800 font-medium">{event.venue.name}</p>
                  <p className="text-xs text-gray-500">{event.venue.address}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-blue-500 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Bereikbaarheid</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{event.venue.transport}</p>
                </div>
              </div>

              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Tickets & registratie
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <FavoriteButton slug={event.slug} />
              <ShareButton title={event.title} slug={event.slug} />
            </div>
          </div>
        </div>
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
