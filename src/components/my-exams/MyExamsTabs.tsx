import { MY_EXAM_TABS, type MyExamTab } from "@/lib/my-exams/filters";
import { cn } from "@/lib/utils";

type MyExamsTabsProps = {
  activeTab: MyExamTab;
  onTabChange: (tab: MyExamTab) => void;
};

export function MyExamsTabs({ activeTab, onTabChange }: MyExamsTabsProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div className="inline-flex min-w-max rounded-2xl border border-slate-200 bg-white p-1">
        {MY_EXAM_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
