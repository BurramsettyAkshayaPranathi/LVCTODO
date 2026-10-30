
import { CheckCircle2, Sparkles } from "lucide-react";

export default function TodoHeader() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-indigo-600 p-2.5 text-white shadow-lg">
          <CheckCircle2 size={25} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Taskly</h2>
          <p className="text-xs text-slate-500">Your daily workspace</p>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 sm:flex">
        <Sparkles size={16} />
        Make today count
      </div>
    </header>
  );
}
