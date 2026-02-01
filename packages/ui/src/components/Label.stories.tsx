import { Input } from "./Input";
import { Label } from "./Label";
import "~/tailwind.css";

export default {
    title: "components/Label",
    component: Label,
};

export const Default = () => <Label>Label text</Label>;

export const WithInput = () => (
    <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter username" />
    </div>
);

export const Required = () => (
    <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
        </Label>
        <Input id="email" type="email" placeholder="email@example.com" required />
    </div>
);
