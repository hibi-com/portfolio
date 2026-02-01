import { Briefcase, FileText, Headphones, LayoutDashboard, MessageSquare, Users } from "lucide-react";
import type { NavigationItem } from "./types";

export const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Posts", href: "/posts", icon: FileText },
    { name: "Portfolios", href: "/portfolios", icon: Briefcase },
    { name: "CRM", href: "/crm", icon: Users },
    { name: "Support", href: "/support", icon: Headphones },
    { name: "Chat", href: "/chat", icon: MessageSquare },
];
