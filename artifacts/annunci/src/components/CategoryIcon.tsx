import { Car, Home, Laptop, Briefcase, Wrench, MoreHorizontal, Shirt, Bike, Palette } from "lucide-react";
import { ReactNode } from "react";

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className = "w-5 h-5" }: CategoryIconProps) {
  const normalized = name.toLowerCase();
  
  if (normalized.includes("auto") || normalized.includes("motori")) return <Car className={className} />;
  if (normalized.includes("casa") || normalized.includes("immobili")) return <Home className={className} />;
  if (normalized.includes("elettronica") || normalized.includes("tech")) return <Laptop className={className} />;
  if (normalized.includes("lavoro")) return <Briefcase className={className} />;
  if (normalized.includes("servizi")) return <Wrench className={className} />;
  if (normalized.includes("abbigliamento") || normalized.includes("moda")) return <Shirt className={className} />;
  if (normalized.includes("sport") || normalized.includes("bici")) return <Bike className={className} />;
  if (normalized.includes("arte") || normalized.includes("hobby")) return <Palette className={className} />;
  
  return <MoreHorizontal className={className} />;
}
