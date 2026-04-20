import {
  Home,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Users,
  Briefcase,
  Laptop,
  HeartHandshake,
  Tag,
  Gamepad2,
  Bike,
  Shirt,
  MoreHorizontal
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export function CategoryIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  const normalizedName = name.toLowerCase();
  
  // Check exact matches against our 5 core categories
  const coreCategory = CATEGORIES.find(c => c.name.toLowerCase() === normalizedName);
  if (coreCategory) {
    const Icon = coreCategory.icon;
    return <Icon className={className} />;
  }

  // Fallbacks for any other random categories from the DB
  if (normalizedName.includes("appartament") || normalizedName.includes("cas") || normalizedName.includes("stanz")) return <Home className={className} />;
  if (normalizedName.includes("libr") || normalizedName.includes("appunt")) return <BookOpen className={className} />;
  if (normalizedName.includes("ripetizion") || normalizedName.includes("lezion")) return <GraduationCap className={className} />;
  if (normalizedName.includes("consigl")) return <Lightbulb className={className} />;
  if (normalizedName.includes("grupp") || normalizedName.includes("compagn")) return <Users className={className} />;
  if (normalizedName.includes("lavor") || normalizedName.includes("stage")) return <Briefcase className={className} />;
  if (normalizedName.includes("elettronic") || normalizedName.includes("pc") || normalizedName.includes("computer")) return <Laptop className={className} />;
  if (normalizedName.includes("serviz") || normalizedName.includes("aiut")) return <HeartHandshake className={className} />;
  if (normalizedName.includes("gioch") || normalizedName.includes("console")) return <Gamepad2 className={className} />;
  if (normalizedName.includes("bic") || normalizedName.includes("sport") || normalizedName.includes("mobilita")) return <Bike className={className} />;
  if (normalizedName.includes("vestit") || normalizedName.includes("abbigliament")) return <Shirt className={className} />;

  return <MoreHorizontal className={className} />;
}
