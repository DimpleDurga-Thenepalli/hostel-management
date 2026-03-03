import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedStudent = localStorage.getItem('student');
    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      if (storedStudent) setStudent(JSON.parse(storedStudent));
    }
  }, []);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
    setRole(data.user.role);
    setStudent(data.student || null);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('role', data.user.role);
    if (data.student) {
      localStorage.setItem('student', JSON.stringify(data.student));
    } else {
      localStorage.removeItem('student');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    setStudent(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('student');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

