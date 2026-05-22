import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

import { useState } from "react";
import axios from "axios";

type Category = {
    id: number;
    name: string;
    created_at: string;
};

const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Name is required.")
        .max(100, "Name must be 100 characters or fewer."),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

function Categories() {
    const { data, isLoading, isError } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await api.get("/categories/");
            return response.data;
        },
    });

    const [serverError, setServerError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");

    const [editError, setEditError] = useState<string | null>(null);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
    });

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (values: CategoryFormValues) => {
            const response = await api.post("/categories/", values);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            reset();
            setServerError(null);
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setServerError("A category with this name already exists.");
            } else {
                setServerError("Something went wrong. Please try again.");
            }
        },
    });


    const deleteMutation = useMutation({
        mutationFn: async (categoryId: number) => {
            await api.delete(`/categories/${categoryId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    const onSubmit = (values: CategoryFormValues) => {
        setServerError(null);
        createMutation.mutate(values);
    };

    const updateMutation = useMutation({
        mutationFn: async (variables: { id: number; name: string }) => {
            const response = await api.patch(
                `/categories/${variables.id}`,
                { name: variables.name }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setEditingId(null);
            setEditingName("");
            setEditError(null);
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setEditError("A category with this name already exists.");
            } else {
                setEditError("Something went wrong. Please try again.");
            }
        },
    });

    return (

        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

            {isLoading && (
                <p className="text-gray-700 mt-4">Loading...</p>
            )}

            {isError && (
                <p className="text-red-600 mt-4">Failed to load categories.</p>
            )}

            {data && data.length === 0 && (
                <p className="text-gray-700 mt-4">
                    You don't have any categories yet.
                </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex gap-2">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="New category name"
                        {...register("name")}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {createMutation.isPending ? "Adding..." : "Add"}
                </button>
            </form>

            {serverError && (
                <p className="text-red-600 text-sm mt-2">{serverError}</p>
            )}

            {data && data.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {data.map((category) => (
                        <li
                            key={category.id}
                            className="bg-white p-3 rounded shadow"
                        >
                            {editingId === category.id ? (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() => {
                                                setEditError(null);
                                                updateMutation.mutate({
                                                    id: category.id,
                                                    name: editingName,
                                                });
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditingName("");
                                                setEditError(null);
                                            }}
                                            className="text-gray-600 hover:text-gray-800 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    {editError && (
                                        <p className="text-red-600 text-sm">{editError}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="flex-1">{category.name}</span>
                                    <button
                                        onClick={() => {
                                            setEditingId(category.id);
                                            setEditingName(category.name);
                                            setEditError(null);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Delete "${category.name}"?`)) {
                                                deleteMutation.mutate(category.id);
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Categories;