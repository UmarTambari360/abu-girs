import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  academic: "bg-blue-50 text-blue-700 border-blue-200",
  administrative: "bg-purple-50 text-purple-700 border-purple-200",
  health: "bg-red-50 text-red-700 border-red-200",
  accommodation: "bg-orange-50 text-orange-700 border-orange-200",
  recreation: "bg-teal-50 text-teal-700 border-teal-200",
  worship: "bg-yellow-50 text-yellow-700 border-yellow-200",
  transport: "bg-cyan-50 text-cyan-700 border-cyan-200",
  food: "bg-amber-50 text-amber-700 border-amber-200",
  security: "bg-gray-100 text-gray-700 border-gray-300",
  other: "bg-slate-50 text-slate-600 border-slate-200",
};

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        CATEGORY_COLORS[category] ??
          "bg-gray-100 text-gray-600 border-gray-200",
        className,
      )}
    >
      {category}
    </span>
  );
}
