import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TopSales } from "./components/top-sales";
import { BottomSales } from "./components/bottom-sales";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QueryType } from "~/query";
import { useState } from "react";

export function Dashboard() {
  const [date, setDate] = useState(getLast12Months()[11].date.toISOString());
  const { data: revenueData, isLoading: revenueIsLoading } = useQuery({
    queryKey: ["revenue", date],
    queryFn: async () => {
      return axios
        .get("/api/revenue", { params: { date } })
        .then((res) => res.data);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [QueryType.ORDER_COUNT, date],
    queryFn: async () => {
      return axios
        .get("/api/orders", {
          params: { type: QueryType.ORDER_COUNT, date },
        })
        .then((res) => res.data);
    },
  });

  const revenue =
    revenueIsLoading || !revenueData?.revenue
      ? "...Loading"
      : revenueData?.revenue;

  const orderCount = isLoading || !data?.count ? "...Loading" : data?.count;

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-row">
          <div className="flex-1"></div>
          <Select value={date} onValueChange={(value) => setDate(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {getLast12Months().map((el) => (
                  <SelectItem value={el.date.toISOString()} key={el.name}>
                    {el.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <span className="h-4 w-4 text-muted-foreground">ZAR</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenue}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-9">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Bottom 5 sales</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <BottomSales date={date} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top 5 sales</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TopSales date={date} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function getLast12Months() {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(currentDate);
    currentDate.setHours(0, 0, 0, 0); // Setting the hours to 0 to get the first day of the month
    // set date to 1st of the month
    currentDate.setDate(1);
    months.push({
      name: `${monthName} ${currentYear}`,
      date: new Date(currentDate),
    });

    currentDate.setMonth(currentMonth - 1); // Move to the previous month
  }

  return months.reverse(); // Reversing the array to get the months in chronological order
}
