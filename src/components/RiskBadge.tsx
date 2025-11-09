import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "./ui/badge";

interface RiskBadgeProps {
  riskLevel: 'high' | 'medium' | 'low';
  size?: "default" | "lg";
}

export const RiskBadge = ({ riskLevel, size = "default" }: RiskBadgeProps) => {
  const getRiskConfig = () => {
    if (riskLevel === 'low') return { label: "An toàn", variant: "success", icon: CheckCircle };
    if (riskLevel === 'medium') return { label: "Hơi lo", variant: "warning", icon: AlertTriangle };
    return { label: "Nguy hiểm", variant: "destructive", icon: AlertCircle };
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
