import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "../lib/api";
import { formatCurrency } from "../utils/format";

type Transaction = {
    id: number;
    user_id: number;
    category_id: number | null;
    amount: string;
    type: "income" | "expense";
    description: string;
    transaction_date: string;
    created_at: string;
};

export default function Transactions() {
    const { data: transactions, isLoading, isError } = useQuery<Transaction[]>({
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await api.get("/transactions/");
            return response.data;
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <p className="p-6">Loading…</p>;
    if (isError) return <p className="p-6 text-red-600">Failed to load transactions.</p>;


    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    New
                </button>
            </div>
            {transactions && transactions.length === 0 ? (
                <p className="text-gray-600">No transactions yet.</p>
            ) : (
                <ul className="space-y-2">
                    {transactions?.map((transaction) => (
                        <li
                            key={transaction.id}
                            className="bg-white p-3 rounded shadow flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-gray-500">
                                    {transaction.transaction_date}
                                </p>
                            </div>
                            <p
                                className={
                                    transaction.type === "expense"
                                        ? "text-red-600 font-semibold"
                                        : "text-green-600 font-semibold"
                                }
                            >
                                {formatCurrency(transaction.amount, transaction.type)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">New Transaction</h2>
                        <p>Form will go here.</p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

}