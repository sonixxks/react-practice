import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import Home from '../Components/Pages/Home/Home';
import Auth from '../Components/Pages/Auth/Auth';
import Dashboard from '../Components/Pages/Dashboard/Dashboard';
import TotalAnalytics from '../Components/Pages/TotalAnalytics/TotalAnalytics';
import styles from './App.module.scss';
import { useAuth, ProtectedRoute } from '../Context/AuthContext'; // Забираем ProtectedRoute отсюда

export default function App() {
    const { isLogged } = useAuth();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link to="/" className={styles.logo}>
                    <h1>CashGlow</h1>
                </Link>
                <nav className={styles.nav}>
                    <NavLink to="/" className={({ isActive }) => `${styles.navButton} ${isActive ? styles.activeNav : ''}`}>
                        Главная
                    </NavLink>
                    
                    {!isLogged ? (
                        <NavLink to="/auth" className={({ isActive }) => `${styles.navButton} ${isActive ? styles.activeNav : ''}`}>
                            Вход
                        </NavLink>
                    ) : (
                        <NavLink to="/dashboard" className={({ isActive }) => `${styles.navButton} ${isActive ? styles.activeNav : ''}`}>
                            Личный кабинет
                        </NavLink>
                    )}

                    {isLogged && (
                        <NavLink to="/analytics" className={({ isActive }) => `${styles.navButton} ${isActive ? styles.activeNav : ''}`}>
                            Аналитика
                        </NavLink>
                    )}
                </nav>
            </header>

            <main className={styles.mainContent}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                        <ProtectedRoute>
                            <TotalAnalytics />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <footer className={styles.footer}>
                <p>© 2026 CashGlow</p>
                <div className={styles.footerLinks}>
                    <span>Политика конфиденциальности</span>
                    <span>Условия использования</span>
                    <a href="https://github.com/sonixxks" target="_blank" rel="noreferrer" className={styles.githubLink}>GitHub</a>
                </div>
            </footer>
        </div>
    );
}