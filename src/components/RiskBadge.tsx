import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "./ui/badge";

interface RiskBadgeProps {
  riskLevel?: 'high' | 'medium' | 'low';
  score?: number;
  size?: "default" | "lg";
}

export const RiskBadge = ({ riskLevel, score, size = "default" }: RiskBadgeProps) => {
  const getRiskConfig = () => {
    // If riskLevel is provided, use it directly
    if (riskLevel) {
      if (riskLevel === 'low') return { label: "An toàn", variant: "success", icon: CheckCircle };
      if (riskLevel === 'medium') return { label: "Hơi lo", variant: "warning", icon: AlertTriangle };
      return { label: "Nguy hiểm", variant: "destructive", icon: AlertCircle };
    }

    // Otherwise, derive from score
    if (score !== undefined) {
      if (score < 30) return { label: "An toàn", variant: "success", icon: CheckCircle };
      if (score < 70) return { label: "Cần chú ý", variant: "warning", icon: AlertTriangle };
      return { label: "Nguy hiểm", variant: "destructive", icon: AlertCircle };
    }

    // Default fallback
    return { label: "Không rõ", variant: "secondary", icon: AlertCircle };
  };

  const risk = getRiskConfig();
  const Icon = risk.icon;
  const sizeClass = size === "lg" ? "text-base px-4 py-2" : "text-sm";

  return (
    <Badge
      variant={risk.variant as any}
      className={`flex items-center gap-2 ${sizeClass}`}
    >
      <Icon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      {risk.label}
    </Badge>
  );
};
