import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { api } from "../lib/api";

type User = {
    id: number;
    email: string;
    created_at: string;
};

type AuthContextType = {
    currentUser: User | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setIsLoading(false);
            return;
        }

        api
            .get("/auth/me")
            .then((res) => setCurrentUser(res.data))
            .catch(() => {
                // Token invalid or expired — clear it
                localStorage.removeItem("access_token");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (token: string) => {
        localStorage.setItem("access_token", token);
        const res = await api.get("/auth/me");
        setCurrentUser(res.data);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}