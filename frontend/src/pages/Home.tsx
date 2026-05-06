import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Home() {
    const { currentUser, isLoading, logout } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Finance Tracker</h1>

                {isLoading && <p className="text-gray-600">Loading...</p>}

                {!isLoading && currentUser && (
                    <>
                        <p className="text-gray-600 mb-6">
                            Welcome back,{" "}
                            <span className="font-medium">{currentUser.email}</span>.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link
                                to="/dashboard"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Go to Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-200"
                            >
                                Log out
                            </button>
                        </div>
                    </>
                )}

                {!isLoading && !currentUser && (
                    <>
                        <p className="text-gray-600 mb-6">
                            Track your money. Plan your budget.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-200"
                            >
                                Sign up
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;