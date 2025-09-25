// import { createContext, useContext, useState } from "react";

// // Create the context
// const AuthContext = createContext();

// // Custom hook for easier access
// export const useAuth = () => useContext(AuthContext);

// // Provider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     // Try to load from localStorage if page reloads
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : { isAuthenticated: false, role: null };
//   });

//   const login = (role) => {
//     const userData = { isAuthenticated: true, role };
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser({ isAuthenticated: false, role: null });
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// check this later AuthProvider should have been in main.jsx if you used auth context and not localstorage.
