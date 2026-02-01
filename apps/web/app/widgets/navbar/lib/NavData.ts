import { SOCIAL_GITHUB } from "~/shared/config/constants";
import type { NavLink, SocialLink } from "../model/types";

export const navLinks: NavLink[] = [
    {
        label: "Projects",
        pathname: "/#project-1",
    },
    {
        label: "Details",
        pathname: "/#details",
    },
    {
        label: "Articles",
        pathname: "/articles",
    },
    {
        label: "Contact",
        pathname: "/contact",
    },
];

export const socialLinks: SocialLink[] = [
    {
        label: "Github",
        url: SOCIAL_GITHUB,
        icon: "github",
    },
];
