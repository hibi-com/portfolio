import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./Table";
import "~/tailwind.css";

export default {
    title: "components/Table",
    component: Table,
};

export const Default = () => (
    <Table>
        <TableCaption>Sample table</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>Alice</TableCell>
                <TableCell>alice@example.com</TableCell>
                <TableCell>Admin</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Bob</TableCell>
                <TableCell>bob@example.com</TableCell>
                <TableCell>User</TableCell>
            </TableRow>
        </TableBody>
    </Table>
);

export const WithFooter = () => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Amount</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell className="text-right">$100.00</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Tax</TableCell>
                <TableCell className="text-right">$10.00</TableCell>
            </TableRow>
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell>Total</TableCell>
                <TableCell className="text-right">$110.00</TableCell>
            </TableRow>
        </TableFooter>
    </Table>
);
