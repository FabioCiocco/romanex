import { BookOpen, Home, Lightbulb, Users, GraduationCap } from "lucide-react";

export const CATEGORIES = [
  {
    id: "appartamenti",
    name: "Appartamenti",
    description: "Stanze e appartamenti in affitto vicino all'università",
    icon: Home,
    colorClass: "cat-appartamenti",
    hasPrice: true,
  },
  {
    id: "libri",
    name: "Libri di Testo",
    description: "Compra e vendi libri universitari usati",
    icon: BookOpen,
    colorClass: "cat-libri",
    hasPrice: true,
  },
  {
    id: "ripetizioni",
    name: "Ripetizioni",
    description: "Tutor e lezioni private per ogni materia",
    icon: GraduationCap,
    colorClass: "cat-ripetizioni",
    hasPrice: true,
  },
  {
    id: "consigli",
    name: "Consigli",
    description: "Consigli su università, esami e vita da studente",
    icon: Lightbulb,
    colorClass: "cat-consigli",
    hasPrice: false,
  },
  {
    id: "gruppi-studio",
    name: "Gruppi Studio",
    description: "Trova compagni per studiare insieme",
    icon: Users,
    colorClass: "cat-gruppi-studio",
    hasPrice: false,
  },
];

export const getCategoryConfig = (id: string) => {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
};
