import { Input } from "./Input";
import "~/tailwind.css";

export default {
    title: "components/Input",
    component: Input,
};

export const Default = () => <Input placeholder="Enter text..." />;

export const WithValue = () => <Input defaultValue="Pre-filled value" />;

export const Disabled = () => <Input placeholder="Disabled" disabled />;

export const WithLabel = () => (
    <div className="grid w-full max-w-sm gap-2">
        <label htmlFor="email" className="font-medium text-sm">
            Email
        </label>
        <Input id="email" type="email" placeholder="email@example.com" />
    </div>
);

export const Password = () => <Input type="password" placeholder="Password" />;
