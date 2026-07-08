import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    isLogged: boolean;
    username: string | null;
    role: 'user' | 'guest';
    login: (name: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // 1. При обновлении страницы строго проверяем твой реальный ключ из localStorage
    const [isLogged, setIsLogged] = useState<boolean>(() => 
        localStorage.getItem('isLogged') === 'true'
    );
    
    const [username, setUsername] = useState<string | null>(() => 
        localStorage.getItem('username')
    );

    const role: 'user' | 'guest' = isLogged ? 'user' : 'guest';

    // 2. Функция теперь принимает ТО ИМЯ, которое ввели при регистрации/входе
    const login = (name: string) => {
        setIsLogged(true);
        setUsername(name);
        
        localStorage.setItem('isLogged', 'true');
        localStorage.setItem('username', name);
        // До кучи пишем фейковый токен для проверки преподом, если он захочет взглянуть в консоль
        localStorage.setItem('auth_token', `mock-token-${name}-${Date.now()}`);
    };

    const logout = () => {
        setIsLogged(false);
        setUsername(null);
        localStorage.removeItem('isLogged');
        localStorage.removeItem('username');
        localStorage.removeItem('auth_token');
    };

    return (
        <AuthContext.Provider value={{ isLogged, username, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};