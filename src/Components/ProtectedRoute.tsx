import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLogged } = useAuth();

    // Если токена/сессии нет в стейте, строго отправляем на авторизацию
    if (!isLogged) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <>
            {children}
        </>
    );
}