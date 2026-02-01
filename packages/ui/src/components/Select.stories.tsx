import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./Select";
import "~/tailwind.css";

export default {
    title: "components/Select",
    component: Select,
};

export const Default = () => (
    <Select>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
    </Select>
);

export const WithDefaultValue = () => (
    <Select defaultValue="banana">
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
    </Select>
);

export const WithGroups = () => (
    <Select>
        <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectContent>
    </Select>
);
