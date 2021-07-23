export interface Register {
  id: number;
  name: string;
  description: string;
  status: "pending" | "canceled" | "completed";
  date: string;
}