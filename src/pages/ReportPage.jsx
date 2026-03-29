import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { detectSeverity, isPotentialDuplicate } from "../utils/reportUtils";

export default function ReportPage() {
  const { session } = useAuth();
  const { reports, submitReport } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    animalType: "dog",
    condition: "",
    details: "",
    location: "",
    latitude: "",
    longitude: "",
    city: "",
    state: "",
    language: "en",
    contact: session?.email || ""
  });
  const [urgency, setUrgency] = useState("regular");
  const [mediaNames, setMediaNames] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ai = useMemo(() => detectSeverity(`${form.condition} ${form.details}`), [form.condition, form.details]);

  const applyAiUrgency = () => {
    setUrgency(ai.urgency);
    setMsg(`Urgency auto-set to ${ai.severity}.`);
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const next = `${lat}, ${lng}`;

        setForm((prev) => ({ ...prev, latitude: lat, longitude: lng, location: next }));
        setError("");
      },
      () => setError("Unable to fetch location. Add latitude and longitude manually.")
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMsg("");

    if (!session) {
      setError("Please login first to submit a report.");
      return;
    }

    if (!form.condition.trim() || !form.details.trim() || !form.location.trim()) {
      setError("Condition, details, and location are required.");
      return;
    }

    if (!form.latitude || !form.longitude) {
      setError("Latitude and longitude are required by backend API.");
      return;
    }

    if (isPotentialDuplicate(reports, { location: form.location, details: form.details })) {
      const confirmDup = window.confirm("A similar report exists in recent timeline. Submit anyway?");
      if (!confirmDup) {
        setError("Duplicate submission prevented.");
        return;
      }
    }

    setSubmitting(true);
    const result = await submitReport({
      animalType: form.animalType,
      description: `${form.condition.trim()}. ${form.details.trim()}`,
      urgency,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      address: form.location.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      media: mediaNames,
      language: form.language,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMsg(`Report submitted successfully with ID ${result.raw.caseId || result.report.id}.`);
    setTimeout(() => navigate("/user"), 700);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Emergency Report</h1>
        <p className="mt-1 text-sm text-slate-600">Add details, media, and location for faster rescue coordination.</p>

        <div className="mt-4 grid gap-3">
          <select
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={form.animalType}
            onChange={(e) => setForm((p) => ({ ...p, animalType: e.target.value }))}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="cow">Cow</option>
            <option value="monkey">Monkey</option>
            <option value="reptile">Reptile</option>
            <option value="other">Other</option>
          </select>

          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Condition summary" value={form.condition} onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))} required />
          <textarea className="min-h-28 rounded-lg border border-slate-300 px-3 py-2" placeholder="Detailed description" value={form.details} onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))} required />

          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Address / location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required />
            <button type="button" onClick={captureLocation} className="rounded-lg border border-brand-500 px-3 py-2 font-semibold text-brand-700 hover:bg-brand-50">Use Current Location</button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Latitude" value={form.latitude} onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))} required />
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Longitude" value={form.longitude} onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))} required />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
            <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="State" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <select className="rounded-lg border border-slate-300 px-3 py-2" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
              <option value="regular">Regular</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
            <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
              <option value="ta">Tamil</option>
            </select>
            <input type="file" multiple accept="image/*,video/*" className="rounded-lg border border-slate-300 px-3 py-2" onChange={(e) => setMediaNames(Array.from(e.target.files || []).map((file) => file.name))} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-3 py-2 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        {msg ? <p className="mt-3 text-sm text-emerald-600">{msg}</p> : null}
      </form>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-lg font-bold">AI Severity Assistant</h2>
          <p className="mt-2 text-sm text-slate-700">Predicted Severity: <strong>{ai.severity}</strong></p>
          <p className="mt-2 text-sm text-slate-600">First Aid: {ai.aid}</p>
          <button type="button" onClick={applyAiUrgency} className="mt-3 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700">Apply AI Urgency</button>
        </div>

        {mediaNames.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold">Attached Media (names only for now)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {mediaNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
