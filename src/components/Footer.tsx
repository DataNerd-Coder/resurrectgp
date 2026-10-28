"use client";

interface FooterProps {
  onOpenStrategy: (id: number) => void;
}

const BLUEPRINTS = [
  { id: 1, strategy: "Strategy 01", title: "The Heavy Hitters" },
  { id: 2, strategy: "Strategy 02", title: "The 0.2 Safety Net" },
  { id: 3, strategy: "Strategy 03", title: "The PQ Protocol" },
  { id: 4, strategy: "Strategy 04", title: "Comeback Logic" },
];

const ACTIVITIES = [
  { name: "Sunday Light", time: "8:00 AM", place: "Carva Auditorium" },
  { name: "Charismatic Hour", time: "Tuesday, 6:00 PM", place: "Carva Auditorium" },
  { name: "Bible Study", time: "Thursday, 6:00 PM", place: "Carva Auditorium" },
];

export function Footer({ onOpenStrategy }: FooterProps) {
  return (
    <footer className="mt-5 mb-10 text-center animate-fade border-t border-slate-200 pt-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="app-panel rounded-2xl overflow-hidden shadow-sm text-left mb-8">
          <div className="bg-slate-900 p-4">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] italic">
              Resurrection Blueprint
            </h3>
          </div>
          <div className="p-2 space-y-1">
            {BLUEPRINTS.map((item) => (
              <button
                key={item.id}
                onClick={() => onOpenStrategy(item.id)}
                className="blueprint-item w-full text-left p-4 rounded-xl group"
              >
                <p className="text-[9px] font-black text-blue-600 uppercase mb-1">
                  {item.strategy}
                </p>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
                  {item.title}
                </h4>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 mt-9 uppercase tracking-[0.2em]">
            Powered By
          </p>
          <h4 className="text-xl font-bold text-slate-900">
            Watchman Fellowship UNN
          </h4>
          <p className="text-sm italic text-slate-500 font-medium">
            &quot;Sanctuary of reference&quot;
          </p>
        </div>

        <div className="bg-slate-50 py-6 px-8 rounded-2xl border border-slate-100 italic font-semibold text-slate-700 text-base leading-relaxed">
          &quot;Pray like it all depends on God and study like it depends on
          you.&quot;
        </div>

        <div className="space-y-6 pt-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Join us in our days of activities
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {ACTIVITIES.map((activity) => (
              <div
                key={activity.name}
                className="app-panel p-6 rounded-2xl shadow-sm border-slate-100"
              >
                <p className="text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">
                  {activity.name}
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-600">
                    {activity.time}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {activity.place}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-base font-bold text-slate-800 pt-4">
          Come along with us and God will do you GOOD!!
        </p>
      </div>
    </footer>
  );
}
