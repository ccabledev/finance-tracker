type Category = {
    id: number;
    name: string;
    created_at: string;
};

function Categories() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-700 mt-2">Coming soon...</p>
        </div>
    );
}

export default Categories;