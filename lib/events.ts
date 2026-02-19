import eventsData from "@/data/events.json";

export interface Speaker {
  name: string;
  title: string;
  bio: string;
  image: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
}

export interface Venue {
  name: string;
  address: string;
  transport: string;
}

export interface Event {
  title: string;
  slug: string;
  date: string;
  endDate: string;
  location: string;
  city: string;
  description: string;
  image: string;
  ticketUrl: string;
  category: string;
  speakers: Speaker[];
  schedule: ScheduleItem[];
  venue: Venue;
}

export function getAllEvents(): Event[] {
  return (eventsData as Event[]).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getEventBySlug(slug: string): Event | undefined {
  return (eventsData as Event[]).find((event) => event.slug === slug);
}

export function searchEvents(query: string): Event[] {
  const q = query.toLowerCase();
  return getAllEvents().filter(
    (event) =>
      event.title.toLowerCase().includes(q) ||
      event.city.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q)
  );
}
