import { useState } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './Components/Pages/Home/Home';
import Auth from './Components/Pages/Auth/Auth';
import Dashboard from './Components/Pages/Dashboard/Dashboard';
import styles from './App.module.scss';

export default function App() {
    const [isLogged, setIsLogged] = useState<boolean>(() => {
        return localStorage.getItem('isLogged') === 'true';
    });

    const handleLoginSuccess = () => {
        setIsLogged(true);
        localStorage.setItem('isLogged', 'true');
    };

    return (
        <div className={styles.appContainer}>
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
                            Вход / Регистрация
                        </NavLink>
                    ) : (
                        <NavLink to="/dashboard" className={({ isActive }) => `${styles.navButton} ${isActive ? styles.activeNav : ''}`}>
                            Личный кабинет
                        </NavLink>
                    )}
                </nav>
            </header>

            <main className={styles.mainContent}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>

            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} CashGlow. Все права защищены.</p>
                <div className={styles.footerLinks}>
                    <a href="https://github.com/sonixxks/react-practice" target="_blank" className={styles.githubLink}>GitHub</a>
                </div>
            </footer>
        </div>
    );
}