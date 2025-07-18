import { createContext, useState, useContext } from "react";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    user: IUser | null;
    setUser: (v: IUser) => void;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
}
interface IProps {
    children: React.ReactNode;
}
const CurrentAppContext = createContext<IAppContext | null>(null);

export const AppProvider = ({ children }: IProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    return (
        <CurrentAppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                user,
                setUser,
                isAppLoading,
                setIsAppLoading,
            }}
        >
            {children}
        </CurrentAppContext.Provider>
    );
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentUser has to be used within <CurrentAppContext.Provider>"
        );
    }

    return currentAppContext;
};
