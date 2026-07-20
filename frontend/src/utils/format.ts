export function formatCurrency(amount: string, type: "income" | "expense"): string {
    const sign = type === "expense" ? "-" : "+";
    const numeric = Number(amount);
    const formatted = numeric.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
    return `${sign}${formatted}`;
}