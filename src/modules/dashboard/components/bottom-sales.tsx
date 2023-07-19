import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { QueryType } from "~/query";
import axios from "axios";

export function BottomSales() {
  const { data } = useQuery({
    queryKey: [QueryType.WORST_PIZZAS],
    queryFn: async () => {
      return axios
        .get("/api/orders", {
          params: { type: QueryType.WORST_PIZZAS },
        })
        .then((res) => res.data);
    },
  });

  if (!data) {
    return "Loading...";
  }

  return (
    <Table>
      <TableBody>
        {
          // @ts-ignore
          data.map((order, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order.name}</TableCell>
              {/* <TableCell>{order.totalAmount}</TableCell> */}
              <TableCell className="text-right">{order.count}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
}
