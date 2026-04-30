import { createContext, useContext, useReducer } from "react";

function authReducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                token: null,
            };
        default:
            return state;
    }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: localStorage.getItem("token") || null,
    });

    function login(user, token) {
        localStorage.setItem("token", token);
        dispatch({
            type: "LOGIN",
            payload: { user, token },
        });
    }

    function logout() {
        localStorage.removeItem("token");
        dispatch({
            type: "LOGOUT",
        });
    }

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
