import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

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
        },
    });

    const onSubmit = (values: CategoryFormValues) => {
        createMutation.mutate(values);
    };

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

            {data && data.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {data.map((category) => (
                        <li
                            key={category.id}
                            className="bg-white p-3 rounded shadow"
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Categories;