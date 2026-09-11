import React, { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
}

interface AuthContextType {
  user: User | null;
  loginAs: (role: "teacher" | "student", name?: string, email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Fresh start without forcing auto-login so login screen always appears
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = sessionStorage.getItem("the_big_classes_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginAs = (role: "teacher" | "student", name?: string, email?: string) => {
    const newUser: User = {
      id: role === "teacher" ? "teacher_1" : "student_1",
      name: name || (role === "teacher" ? "Faculty Admin" : "Candidate"),
      email: email || (role === "teacher" ? "faculty@thebigclasses.edu" : "student@thebigclasses.edu"),
      role,
    };
    setUser(newUser);
    sessionStorage.setItem("the_big_classes_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("the_big_classes_user");
    localStorage.removeItem("the_big_classes_user");
  };

  return (
    <AuthContext.Provider value={{ user, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
