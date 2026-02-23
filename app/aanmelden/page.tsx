"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["Conferentie", "Congres & Vakbeurs", "Hackathon", "Workshop", "Netwerkborrel", "Webinar", "Anders"];

interface Speaker {
  name: string;
  title: string;
  bio: string;
  linkedin: string;
  photoPreview: string | null;
}

interface ScheduleItem {
  time: string;
  title: string;
}

interface Company {
  name: string;
  website: string;
  linkedin: string;
  logoPreview: string | null;
}

export default function AanmeldenPage() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    end_date: "",
    location: "",
    city: "",
    venue_address: "",
    venue_transport: "",
    description: "",
    category: "",
    ticket_url: "",
    contact_name: "",
    contact_email: "",
  });

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [speakerFiles, setSpeakerFiles] = useState<(File | null)[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyFiles, setCompanyFiles] = useState<(File | null)[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/webp", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Alleen JPG, WebP of PNG bestanden zijn toegestaan.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setImageError("Bestand is te groot. Maximum is 3 MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Speakers
  function addSpeaker() {
    setSpeakers((prev) => [...prev, { name: "", title: "", bio: "", linkedin: "", photoPreview: null }]);
    setSpeakerFiles((prev) => [...prev, null]);
  }
  function removeSpeaker(i: number) {
    setSpeakers((prev) => prev.filter((_, idx) => idx !== i));
    setSpeakerFiles((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateSpeaker(i: number, field: keyof Omit<Speaker, "photoPreview">, value: string) {
    setSpeakers((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }
  function handleSpeakerPhoto(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/webp", "image/png"];
    if (!allowedTypes.includes(file.type) || file.size > 2 * 1024 * 1024) return;
    const preview = URL.createObjectURL(file);
    setSpeakerFiles((prev) => prev.map((f, idx) => idx === i ? file : f));
    setSpeakers((prev) => prev.map((s, idx) => idx === i ? { ...s, photoPreview: preview } : s));
  }
  function removeSpeakerPhoto(i: number) {
    setSpeakerFiles((prev) => prev.map((f, idx) => idx === i ? null : f));
    setSpeakers((prev) => prev.map((s, idx) => idx === i ? { ...s, photoPreview: null } : s));
  }

  // Schedule
  function addScheduleItem() {
    setSchedule((prev) => [...prev, { time: "", title: "" }]);
  }
  function removeScheduleItem(i: number) {
    setSchedule((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateScheduleItem(i: number, field: keyof ScheduleItem, value: string) {
    setSchedule((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  // Companies
  function addCompany() {
    setCompanies((prev) => [...prev, { name: "", website: "", linkedin: "", logoPreview: null }]);
    setCompanyFiles((prev) => [...prev, null]);
  }
  function removeCompany(i: number) {
    setCompanies((prev) => prev.filter((_, idx) => idx !== i));
    setCompanyFiles((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateCompany(i: number, field: keyof Omit<Company, "logoPreview">, value: string) {
    setCompanies((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }
  function handleCompanyLogo(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/webp", "image/png"];
    if (!allowedTypes.includes(file.type) || file.size > 2 * 1024 * 1024) return;
    const preview = URL.createObjectURL(file);
    setCompanyFiles((prev) => prev.map((f, idx) => idx === i ? file : f));
    setCompanies((prev) => prev.map((c, idx) => idx === i ? { ...c, logoPreview: preview } : c));
  }
  function removeCompanyLogo(i: number) {
    setCompanyFiles((prev) => prev.map((f, idx) => idx === i ? null : f));
    setCompanies((prev) => prev.map((c, idx) => idx === i ? { ...c, logoPreview: null } : c));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    let image_url = "";

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `submissions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(path, imageFile, { contentType: imageFile.type, upsert: false });

      if (uploadError) {
        setStatus("error");
        setErrorMsg("Afbeelding kon niet worden geüpload: " + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(uploadData.path);
      image_url = urlData.publicUrl;
    }

    // Upload speaker photos
    const speakersWithPhotos = await Promise.all(
      speakers
        .filter((s) => s.name.trim())
        .map(async (speaker, i) => {
          const file = speakerFiles[i];
          let photoUrl = "";
          if (file) {
            const ext = file.name.split(".").pop();
            const path = `speakers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("event-images")
              .upload(path, file, { contentType: file.type, upsert: false });
            if (!uploadError && uploadData) {
              const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(uploadData.path);
              photoUrl = urlData.publicUrl;
            }
          }
          return { name: speaker.name, title: speaker.title, bio: speaker.bio, linkedin: speaker.linkedin, image: photoUrl };
        })
    );

    const res = await fetch("/api/events/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        image_url: image_url || null,
        speakers: speakersWithPhotos,
        schedule: schedule.filter((s) => s.time.trim() && s.title.trim()),
        companies: await Promise.all(
          companies
            .filter((c) => c.name.trim())
            .map(async (company, i) => {
              const file = companyFiles[i];
              let logoUrl = "";
              if (file) {
                const ext = file.name.split(".").pop();
                const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                  .from("event-images")
                  .upload(path, file, { contentType: file.type, upsert: false });
                if (!uploadError && uploadData) {
                  const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(uploadData.path);
                  logoUrl = urlData.publicUrl;
                }
              }
              return { name: company.name, website: company.website, linkedin: company.linkedin, logo: logoUrl };
            })
        ),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error || "Er is iets misgegaan. Probeer het opnieuw.");
    } else {
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aanmelding ontvangen!</h2>
          <p className="text-gray-500 mb-6">
            Bedankt voor je aanmelding. We beoordelen je evenement zo snel mogelijk en nemen contact op via <strong>{form.contact_email}</strong>.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Terug naar de agenda
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar agenda
          </Link>
          <span className="text-gray-200">|</span>
          <span className="text-sm font-medium text-gray-900">Evenement aanmelden</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Evenement aanmelden</h1>
          <p className="text-gray-500">
            Staat jouw e-commerce evenement er nog niet bij? Meld het aan en wij plaatsen het op de agenda na beoordeling.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Evenementgegevens */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Evenementgegevens</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Naam evenement <span className="text-red-500">*</span>
              </label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                placeholder="bijv. E-commerce Summit 2026" required className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Startdatum <span className="text-red-500">*</span>
                </label>
                <input type="date" name="date" value={form.date} onChange={handleChange}
                  required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Einddatum <span className="text-gray-400 font-normal">(optioneel)</span>
                </label>
                <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
                  className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Categorie <span className="text-red-500">*</span>
              </label>
              <select name="category" value={form.category} onChange={handleChange} required
                className={inputClass + " bg-white"}>
                <option value="">Kies een categorie</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Beschrijving <span className="text-red-500">*</span>
              </label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Beschrijf het evenement in een paar zinnen..." required rows={4}
                className={inputClass + " resize-none"} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bannerafbeelding <span className="text-gray-400 font-normal">(optioneel)</span>
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                    {imageFile?.name} ({(imageFile!.size / 1024).toFixed(0)} KB)
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 mb-1">Klik om een afbeelding te uploaden</p>
                  <p className="text-xs text-gray-400">JPG of WebP &bull; liggend formaat &bull; minimaal 1200×400px &bull; max 3 MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/webp,image/png"
                onChange={handleImageChange}
                className="hidden"
              />

              {imageError && (
                <p className="mt-1.5 text-sm text-red-600">{imageError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Website / ticket URL <span className="text-gray-400 font-normal">(optioneel)</span>
              </label>
              <input type="url" name="ticket_url" value={form.ticket_url} onChange={handleChange}
                placeholder="https://..." className={inputClass} />
            </div>
          </div>

          {/* Locatie */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Locatie</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Locatienaam <span className="text-red-500">*</span>
                </label>
                <input type="text" name="location" value={form.location} onChange={handleChange}
                  placeholder="bijv. Jaarbeurs Utrecht" required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stad <span className="text-red-500">*</span>
                </label>
                <input type="text" name="city" value={form.city} onChange={handleChange}
                  placeholder="bijv. Utrecht" required className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adres <span className="text-gray-400 font-normal">(optioneel)</span>
              </label>
              <input type="text" name="venue_address" value={form.venue_address} onChange={handleChange}
                placeholder="bijv. Jaarbeursplein 6, 3521 AL Utrecht" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vervoersinformatie <span className="text-gray-400 font-normal">(optioneel)</span>
              </label>
              <input type="text" name="venue_transport" value={form.venue_transport} onChange={handleChange}
                placeholder="bijv. 5 min. lopen van Utrecht Centraal" className={inputClass} />
            </div>
          </div>

          {/* Sprekers */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Sprekers</h2>
                <p className="text-sm text-gray-400 mt-0.5">Optioneel — voeg sprekers toe die op de detailpagina worden getoond.</p>
              </div>
              <button type="button" onClick={addSpeaker}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Spreker toevoegen
              </button>
            </div>

            {speakers.length === 0 && (
              <p className="text-sm text-gray-400 italic">Nog geen sprekers toegevoegd.</p>
            )}

            {speakers.map((speaker, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Spreker {i + 1}</span>
                  <button type="button" onClick={() => removeSpeaker(i)}
                    className="text-sm text-red-500 hover:text-red-700">Verwijderen</button>
                </div>

                {/* Foto + naam/titel */}
                <div className="flex items-start gap-4">
                  {/* Foto upload */}
                  <div className="shrink-0">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Foto</label>
                    <label className="cursor-pointer group relative block w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
                      {speaker.photoPreview ? (
                        <>
                          <img src={speaker.photoPreview} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                          </svg>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/webp,image/png"
                        className="hidden"
                        onChange={(e) => handleSpeakerPhoto(i, e)}
                      />
                    </label>
                    {speaker.photoPreview && (
                      <button type="button" onClick={() => removeSpeakerPhoto(i)}
                        className="mt-1 text-xs text-red-500 hover:text-red-700 w-16 text-center block">
                        Verwijderen
                      </button>
                    )}
                    <p className="text-xs text-gray-400 mt-1 w-16 leading-tight">JPG/WebP max 2MB</p>
                  </div>

                  {/* Naam + titel */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Naam</label>
                      <input type="text" value={speaker.name} onChange={(e) => updateSpeaker(i, "name", e.target.value)}
                        placeholder="Voornaam Achternaam" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Functie / titel</label>
                      <input type="text" value={speaker.title} onChange={(e) => updateSpeaker(i, "title", e.target.value)}
                        placeholder="bijv. CEO bij Bedrijf" className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Korte bio <span className="text-gray-400 font-normal">(optioneel)</span></label>
                  <textarea value={speaker.bio} onChange={(e) => updateSpeaker(i, "bio", e.target.value)}
                    placeholder="Korte beschrijving van de spreker..."
                    rows={2} className={inputClass + " resize-none"} />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn URL <span className="text-gray-400 font-normal">(optioneel)</span></label>
                  <input type="url" value={speaker.linkedin} onChange={(e) => updateSpeaker(i, "linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/naam" className={inputClass} />
                </div>
              </div>
            ))}
          </div>

          {/* Programma */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Programma</h2>
                <p className="text-sm text-gray-400 mt-0.5">Optioneel — voeg de agenda / tijdlijn toe.</p>
              </div>
              <button type="button" onClick={addScheduleItem}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Item toevoegen
              </button>
            </div>

            {schedule.length === 0 && (
              <p className="text-sm text-gray-400 italic">Nog geen programma-items toegevoegd.</p>
            )}

            {schedule.map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Item {i + 1}</span>
                  <button type="button" onClick={() => removeScheduleItem(i)}
                    className="text-sm text-red-500 hover:text-red-700">Verwijderen</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tijd</label>
                    <input type="text" value={item.time} onChange={(e) => updateScheduleItem(i, "time", e.target.value)}
                      placeholder="bijv. 09:00" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Omschrijving</label>
                    <input type="text" value={item.title} onChange={(e) => updateScheduleItem(i, "title", e.target.value)}
                      placeholder="bijv. Keynote: De toekomst van e-commerce" className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bedrijven */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Deelnemende bedrijven</h2>
                <p className="text-sm text-gray-400 mt-0.5">Optioneel — als alternatief voor of aanvulling op sprekers.</p>
              </div>
              <button type="button" onClick={addCompany}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Bedrijf toevoegen
              </button>
            </div>

            {companies.length === 0 && (
              <p className="text-sm text-gray-400 italic">Nog geen bedrijven toegevoegd.</p>
            )}

            {companies.map((company, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Bedrijf {i + 1}</span>
                  <button type="button" onClick={() => removeCompany(i)}
                    className="text-sm text-red-500 hover:text-red-700">Verwijderen</button>
                </div>

                {/* Logo + naam */}
                <div className="flex items-start gap-4">
                  {/* Logo upload */}
                  <div className="shrink-0">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Logo</label>
                    <label className="cursor-pointer group relative flex items-center justify-center w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
                      {company.logoPreview ? (
                        <>
                          <img src={company.logoPreview} alt="" className="w-full h-full object-contain p-1" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      <input type="file" accept="image/jpeg,image/webp,image/png" className="hidden"
                        onChange={(e) => handleCompanyLogo(i, e)} />
                    </label>
                    {company.logoPreview && (
                      <button type="button" onClick={() => removeCompanyLogo(i)}
                        className="mt-1 text-xs text-red-500 hover:text-red-700 w-16 text-center block">
                        Verwijderen
                      </button>
                    )}
                    <p className="text-xs text-gray-400 mt-1 w-16 leading-tight">PNG/WebP max 2MB</p>
                  </div>

                  {/* Naam */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bedrijfsnaam</label>
                    <input type="text" value={company.name} onChange={(e) => updateCompany(i, "name", e.target.value)}
                      placeholder="bijv. Bol.com" className={inputClass} />
                  </div>
                </div>

                {/* Website + LinkedIn */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Website <span className="text-gray-400 font-normal">(optioneel)</span></label>
                    <input type="url" value={company.website} onChange={(e) => updateCompany(i, "website", e.target.value)}
                      placeholder="https://..." className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn <span className="text-gray-400 font-normal">(optioneel)</span></label>
                    <input type="url" value={company.linkedin} onChange={(e) => updateCompany(i, "linkedin", e.target.value)}
                      placeholder="https://linkedin.com/company/..." className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contactgegevens */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Jouw contactgegevens</h2>
            <p className="text-sm text-gray-500 -mt-2">Niet zichtbaar op de website. Alleen voor communicatie over je aanmelding.</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Naam <span className="text-red-500">*</span>
              </label>
              <input type="text" name="contact_name" value={form.contact_name} onChange={handleChange}
                placeholder="Jouw volledige naam" required className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mailadres <span className="text-red-500">*</span>
              </label>
              <input type="email" name="contact_email" value={form.contact_email} onChange={handleChange}
                placeholder="jouw@email.nl" required className={inputClass} />
            </div>
          </div>

          {/* Error */}
          {status === "error" && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-base">
            {status === "loading" ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Versturen...
              </>
            ) : (
              "Evenement aanmelden"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
