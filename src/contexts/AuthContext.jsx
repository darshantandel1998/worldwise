import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Darshan",
  email: "darshan@example.com",
  password: "password",
  avatar: "https://i.pravatar.cc/100?img=12",
};

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return initialState;
    default:
      throw new Error("Unknow action type: " + action.type);
  }
}

export function AuthContextProvider({ children }) {
  const [{ user, isAuthenticated }, disaptch] = useReducer(
    reducer,
    initialState,
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      disaptch({ type: "login", payload: FAKE_USER });
      localStorage.setItem("worldwise", 1);
    }
  }

  function logout() {
    disaptch({ type: "logout" });
    localStorage.removeItem("worldwise");
  }

  useEffect(() => {
    if (localStorage.getItem("worldwise") === "1")
      disaptch({ type: "login", payload: FAKE_USER });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used out side the AuthProvider");
  return context;
}
