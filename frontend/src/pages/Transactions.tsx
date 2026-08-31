import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

type Category = {
    id: number;
    name: string;
};

export default function Transactions() {
    const { data: transactions, isLoading, isError } = useQuery<Transaction[]>({
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await api.get("/transactions/");
            return response.data;
        },
    });

    const { data: categories } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await api.get("/categories/");
            return response.data;
        },
    });

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post("/transactions/", {
                amount,
                type: transactionType,
                description,
                transaction_date: transactionDate,
                category_id: categoryId,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            setIsModalOpen(false);
            setAmount("");
            setTransactionType("expense");
            setDescription("");
            setTransactionDate(new Date().toISOString().slice(0, 10));
            setCategoryId(null);
            setCreateError(null);
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setCreateError("Please check your inputs.");
            } else {
                setCreateError("Something went wrong. Please try again.");
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (transactionId: number) => {
            await api.delete(`/transactions/${transactionId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (transactionId: number) => {
            const response = await api.patch(`/transactions/${transactionId}`, {
                amount,
                type: transactionType,
                description,
                transaction_date: transactionDate,
                category_id: categoryId,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            setIsModalOpen(false);
            setEditingTransactionId(null);
            setAmount("");
            setTransactionType("expense");
            setDescription("");
            setTransactionDate(new Date().toISOString().slice(0, 10));
            setCategoryId(null);
            setCreateError(null);
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setCreateError("Please check your inputs.");
            } else {
                setCreateError("Something went wrong. Please try again.");
            }
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
    const [description, setDescription] = useState("");
    const [transactionDate, setTransactionDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);

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
                            <div className="flex items-center gap-4">
                                <p
                                    className={
                                        transaction.type === "expense"
                                            ? "text-red-600 font-semibold"
                                            : "text-green-600 font-semibold"
                                    }
                                >
                                    {formatCurrency(transaction.amount, transaction.type)}
                                </p>
                                <button
                                    onClick={() => {
                                        setEditingTransactionId(transaction.id);
                                        setAmount(transaction.amount);
                                        setTransactionType(transaction.type);
                                        setDescription(transaction.description);
                                        setTransactionDate(transaction.transaction_date);
                                        setCategoryId(transaction.category_id);
                                        setCreateError(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Delete "${transaction.description}"?`)) {
                                            deleteMutation.mutate(transaction.id);
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => {
                        setIsModalOpen(false);
                        setEditingTransactionId(null);
                        setAmount("");
                        setTransactionType("expense");
                        setDescription("");
                        setTransactionDate(new Date().toISOString().slice(0, 10));
                        setCategoryId(null);
                        setCreateError(null);
                    }}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {editingTransactionId !== null ? "Edit Transaction" : "New Transaction"}
                        </h2>
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setCreateError(null);
                                if (editingTransactionId !== null) {
                                    updateMutation.mutate(editingTransactionId);
                                } else {
                                    createMutation.mutate();
                                }
                            }}
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value as "income" | "expense")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input
                                    type="date"
                                    value={transactionDate}
                                    onChange={(e) => setTransactionDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    value={categoryId ?? ""}
                                    onChange={(e) =>
                                        setCategoryId(e.target.value === "" ? null : Number(e.target.value))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">(No category)</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {createError && (
                                <p className="text-red-600 text-sm">{createError}</p>
                            )}

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingTransactionId(null);
                                        setAmount("");
                                        setTransactionType("expense");
                                        setDescription("");
                                        setTransactionDate(new Date().toISOString().slice(0, 10));
                                        setCategoryId(null);
                                        setCreateError(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingTransactionId !== null ? "Save" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}