import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const TOGGLE_SETTINGS = [
  {
    id: "auto-dispatch",
    label: "Smart Auto Assignment",
    desc: "Automatically assign urgent cases nearby.",
  },
  {
    id: "anonymous",
    label: "Allow Anonymous Reports",
    desc: "Users can report without login.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp Alerts",
    desc: "Send instant rescue notifications.",
  },
];

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(
    Object.fromEntries(TOGGLE_SETTINGS.map(item => [item.id, true]))
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("Settings saved");
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border p-6 bg-white dark:bg-zinc-900">
        <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Brand Name</label>
            <input
              defaultValue="ResQPaws"
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Support Email</label>
            <input
              type="email"
              defaultValue="support@resqpaws.org"
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-6 bg-white dark:bg-zinc-900">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>

        <div className="space-y-5">
          {TOGGLE_SETTINGS.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border rounded-xl p-4"
            >
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>

              <input
                type="checkbox"
                checked={settings[item.id]}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, [item.id]: e.target.checked }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-orange-500 text-white px-8 py-3 hover:bg-orange-600"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}