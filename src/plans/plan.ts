export interface PlanRow {
  id: number;
  name: string;
  monthly_price: string;
}

export interface Plan {
  id: number;
  name: string;
  monthlyPrice: number;
}

export function toPlan(row: PlanRow): Plan {
  return {
    id: row.id,
    name: row.name,
    monthlyPrice: Number(row.monthly_price),
  };
}
