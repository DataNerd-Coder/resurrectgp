"use client";

interface FooterProps {
  onOpenStrategy: (id: number) => void;
}

const BLUEPRINTS = [
  { id: 1, title: "The Heavy Hitters" },
  { id: 2, title: "The 0.2 Safety Net" },
  { id: 3, title: "The PQ Protocol" },
  { id: 4, title: "Comeback Logic" },
];

const ACTIVITIES = [
  { name: "Sunday Light", time: "Sunday, 8:00 AM", place: "Carva Auditorium" },
  { name: "Charismatic Hour", time: "Tuesday, 6:00 PM", place: "Carva Auditorium" },
  { name: "Bible Study", time: "Thursday, 6:00 PM", place: "Carva Auditorium" },
];

export function Footer({ onOpenStrategy }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-[#e6e6e6] animate-fade">
      <div className="pt-10 pb-4 space-y-10">
        <section>
          <h3 className="card-title mb-4">Playbook</h3>
          <div className="flex flex-wrap gap-2">
            {BLUEPRINTS.map((item) => (
              <button
                key={item.id}
                onClick={() => onOpenStrategy(item.id)}
                className="blueprint-item h-10 px-4 text-sm font-medium text-[#0a0a0a] bg-[#ffffff] border border-[#8f8f8f]"
              >
                {item.title}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-[#0a0a0a] mb-1">
            Watchman Fellowship UNN
          </h3>
          <p className="text-sm text-[#6b6b6b] max-w-[32rem]">
            &quot;Sanctuary of reference.&quot; Pray like it all depends on God
            and study like it depends on you.
          </p>
        </section>

        <section>
          <h3 className="card-title mb-4">Join us in our days of activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ACTIVITIES.map((activity) => (
              <div key={activity.name} className="app-panel p-5">
                <p className="text-sm font-medium text-[#0a0a0a] mb-2">
                  {activity.name}
                </p>
                <p className="text-xs text-[#6b6b6b]">{activity.time}</p>
                <p className="text-xs text-[#6b6b6b]">{activity.place}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#0a0a0a] pt-6">
            Come along with us and God will do you good.
          </p>
        </section>

        <p className="text-xs text-[#6b6b6b] pt-2">
          Resurrect My GPA · 5.0 scale · Built by Watchman Fellowship UNN
        </p>
      </div>
    </footer>
  );
}
