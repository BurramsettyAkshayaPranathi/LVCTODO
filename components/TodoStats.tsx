
import {
  CheckCircle2,
  Circle,
  ListTodo,
  TrendingUp,
} from "lucide-react";

type Props = {
  total: number;
  active: number;
  completed: number;
};

export default function TodoStats({ total, active, completed }: Props) {
  const stats = [
    {
      label: "Total tasks",
      value: total,
      icon: ListTodo,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "In progress",
      value: active,
      icon: Circle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4"
            >
              <div className={`mb-3 inline-flex rounded-xl p-2 ${stat.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" />
            <span className="text-sm font-semibold text-slate-800">
              Daily progress
            </span>
          </div>
          <span className="text-sm font-bold text-indigo-600">
            {progress}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {total === 0
            ? "Add your first task to get started."
            : completed === total
              ? "Amazing! All your tasks are complete."
              : "Keep going. Every small step counts!"}
        </p>
      </div>
    </section>
  );
}
