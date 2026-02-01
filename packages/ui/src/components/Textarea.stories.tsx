import { Label } from "./Label";
import { Textarea } from "./Textarea";
import "~/tailwind.css";

export default {
    title: "components/Textarea",
    component: Textarea,
};

export const Default = () => <Textarea placeholder="Type your message..." />;

export const WithValue = () => <Textarea defaultValue="Pre-filled content" />;

export const Disabled = () => <Textarea placeholder="Disabled" disabled />;

export const WithLabel = () => (
    <div className="grid w-full gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Type your message here." />
    </div>
);
