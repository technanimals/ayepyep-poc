import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";

const invoices = [
  {
    item: "Chicken",
    totalAmount: "R250.00",
    paymentMethod: "Credit Card",
    totalSales: 12,
  },
  {
    item: "Beef",
    totalAmount: "R150.00",
    paymentMethod: "PayPal",
    totalSales: 15,
  },
  {
    item: "Pizza",
    totalAmount: "R350.00",
    paymentMethod: "Bank Transfer",
    totalSales: 16,
  },
  {
    item: "Burger",
    totalAmount: "R450.00",
    paymentMethod: "Credit Card",
    totalSales: 13,
  },
  {
    item: "Chips",
    totalAmount: "R550.00",
    paymentMethod: "PayPal",
    totalSales: 14,
  },
];

export function TopSales() {
  return (
    <Table>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{invoice.item}</TableCell>{" "}
            <TableCell>{invoice.totalAmount}</TableCell>
            <TableCell className="text-right">{invoice.totalSales}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
