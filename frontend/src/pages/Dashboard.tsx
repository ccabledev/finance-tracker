import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
    const { currentUser, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <Link to="/categories" className="text-blue-600 hover:underline">
                        Categories
                    </Link>
                    <button
                        onClick={logout}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-200"
                    >
                        Log out
                    </button>
                </div>



                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600">
                        Logged in as <span className="font-medium">{currentUser?.email}</span>.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        (Real dashboard content coming in a later step.)
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;