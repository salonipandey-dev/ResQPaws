'use client';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Camera, MapPin, Phone, AlertTriangle, Upload, Send, Dog, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import SeverityBadge from '@/components/SeverityBadge';

export default function ReportPage() {
  const [form, setForm] = useState({ animal: 'Dog', description: '', severity: 'Medium', phone: '', location: '' });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const detectLocation = () => {
    toast.info('Detecting your location…');
    setTimeout(() => {
      setForm((f) => ({ ...f, location: 'MG Road, Bengaluru, Karnataka 560001' }));
      toast.success('Location detected!');
    }, 900);
  };

  const submit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Rescue request sent! NGO dispatched. Report ID: RP-1022');
      setSubmitting(false);
      setForm({ animal: 'Dog', description: '', severity: 'Medium', phone: '', location: '' });
      setPreview(null);
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Emergency Report
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Send a <span className="text-gradient-orange">Rescue Request</span></h1>
          <p className="text-neutral-600 mt-2">Fill out the form below. The nearest verified NGO will be notified instantly.</p>
        </motion.div>

        <div className="mt-8 grid lg:grid-cols-[1.5fr_1fr] gap-6">
          <form onSubmit={submit} className="bg-white/80 backdrop-blur-xl rounded-3xl p-7 border border-white/60 shadow-[0_10px_40px_rgba(255,122,0,0.08)] space-y-6">
            {/* Upload */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Photo or Video</label>
              {preview ? (
                <div className="relative rounded-2xl overflow-hidden h-64">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setPreview(null)} className="absolute top-2 right-2 w-9 h-9 grid place-items-center rounded-full bg-white/90 shadow"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-orange-200 rounded-2xl py-12 cursor-pointer hover:bg-orange-50 transition">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] grid place-items-center shadow-lg shadow-orange-500/30">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-semibold">Click to upload photo or video</div>
                  <div className="text-xs text-neutral-500">PNG, JPG, MP4 up to 10MB</div>
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={onFile} />
                </label>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Animal Type</label>
                <select value={form.animal} onChange={(e) => setForm({ ...form, animal: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:border-[#ff7a00] focus:ring-4 focus:ring-orange-100 outline-none">
                  <option>Dog</option><option>Puppy</option><option>Cat</option><option>Kitten</option><option>Cow</option><option>Bird</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Contact Number (optional)</label>
                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 focus-within:border-[#ff7a00] focus-within:ring-4 focus-within:ring-orange-100">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98XXXXXXXX" className="flex-1 bg-transparent py-3 text-sm outline-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Description</label>
              <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:border-[#ff7a00] focus:ring-4 focus:ring-orange-100 outline-none resize-none"
                placeholder="Describe the animal's condition, injuries, and any landmarks…" />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'Critical'].map((u) => (
                  <button type="button" key={u} onClick={() => setForm({ ...form, severity: u })}
                    className={`py-3 rounded-xl border-2 font-semibold text-sm transition ${
                      form.severity === u
                        ? u === 'Critical' ? 'border-red-500 bg-red-50 text-red-700' : u === 'Medium' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
                    }`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Location</label>
              <div className="flex gap-2">
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Auto-detect or enter manually"
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:border-[#ff7a00] focus:ring-4 focus:ring-orange-100 outline-none" />
                <button type="button" onClick={detectLocation} className="px-4 rounded-xl bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white text-sm font-semibold flex items-center gap-1 shadow">
                  <MapPin className="w-4 h-4" /> Detect
                </button>
              </div>
              <div className="mt-3 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 h-40 relative grid place-items-center">
                <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 30% 40%, #ff7a00 1px, transparent 2px), radial-gradient(circle at 70% 70%, #ff9a2f 1px, transparent 2px)', backgroundSize: '24px 24px'}} />
                <div className="relative text-center">
                  <MapPin className="w-8 h-8 text-[#ff7a00] mx-auto animate-bounce" />
                  <div className="text-xs text-neutral-600 mt-1">{form.location || 'Map preview — detect location to see pin'}</div>
                </div>
              </div>
            </div>

            <button disabled={submitting} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white font-semibold shadow-xl shadow-orange-500/30 hover:scale-[1.01] transition disabled:opacity-60">
              {submitting ? 'Dispatching rescuer…' : <><Send className="w-4 h-4" /> Send Rescue Request</>}
            </button>
          </form>

          {/* Live Preview */}
          <aside className="space-y-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 shadow-[0_10px_40px_rgba(255,122,0,0.08)] sticky top-24">
              <div className="relative h-48 bg-neutral-100">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-neutral-400">
                    <div className="text-center">
                      <Dog className="w-10 h-10 mx-auto mb-2" />
                      <div className="text-xs">Live preview</div>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3"><SeverityBadge level={form.severity} /></div>
              </div>
              <div className="p-5">
                <div className="text-xs text-neutral-500 mb-1">Report preview</div>
                <h3 className="font-bold text-lg">{form.animal || 'Animal'}</h3>
                <p className="text-sm text-neutral-600 mt-1 line-clamp-3">{form.description || 'Description will appear here as you type…'}</p>
                <div className="mt-3 text-xs text-neutral-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{form.location || 'Location pending'}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] text-white rounded-3xl p-5 shadow-xl shadow-orange-500/30">
              <AlertTriangle className="w-6 h-6 mb-2" />
              <h4 className="font-bold">Tip</h4>
              <p className="text-sm text-white/90 mt-1">For critical cases, stay near the animal (safely) until help arrives and keep your phone reachable.</p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
