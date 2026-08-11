import { cn } from "@/lib/cn";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: "primary" | "secondary" | "accent" | "warning";
  showGlow?: boolean;
}

const colorMap = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  warning: "bg-warning",
};

function Progress({
  value,
  max = 10,
  color = "primary",
  showGlow = false,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-border", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          colorMap[color],
          showGlow && "shadow-lg"
        )}
        style={{
          width: `${percentage}%`,
          boxShadow: showGlow ? `0 0 12px ${color === "primary" ? "rgba(108,99,255,0.5)" : color === "secondary" ? "rgba(0,201,167,0.5)" : color === "accent" ? "rgba(255,107,107,0.5)" : "rgba(255,200,87,0.5)"}` : undefined,
        }}
      />
    </div>
  );
}

export { Progress };
