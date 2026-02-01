import { Badge } from "./Badge";
import "~/tailwind.css";

export default {
    title: "components/Badge",
    component: Badge,
};

export const Default = () => <Badge>Badge</Badge>;

export const Secondary = () => <Badge variant="secondary">Secondary</Badge>;

export const Destructive = () => <Badge variant="destructive">Destructive</Badge>;

export const Outline = () => <Badge variant="outline">Outline</Badge>;

export const AllVariants = () => (
    <div className="flex flex-wrap gap-2">
        <Badge>default</Badge>
        <Badge variant="secondary">secondary</Badge>
        <Badge variant="destructive">destructive</Badge>
        <Badge variant="outline">outline</Badge>
    </div>
);
