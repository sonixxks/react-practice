import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import styles from './Auth.module.scss';
import Button from '../../UI/Button/Button';

export default function Auth() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Обычные стейты для инпутов
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Заполните обязательные поля: Email и Пароль');
            return;
        }

        // 1. Достаем список уже существующих пользователей из localStorage
        const savedUsers = localStorage.getItem('cashglow_users');
        const usersList = savedUsers ? JSON.parse(savedUsers) : [];

        if (isLogin) {
            const foundUser = usersList.find(
                (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );

            if (!foundUser) {
                setError('Неверный Email или Пароль, либо аккаунт не существует');
                return;
            }

            // Если нашли — успешно логиним под его сохраненным именем
            login(foundUser.username);
            navigate('/dashboard');

        } else {
            // --- ЛОГИКА РЕГИСТРАЦИИ ---
            if (!username) {
                setError('Введите ваше имя при регистрации');
                return;
            }

            // Проверяем, не занят ли email
            const isEmailTaken = usersList.some(
                (u: any) => u.email.toLowerCase() === email.toLowerCase()
            );

            if (isEmailTaken) {
                setError('Пользователь с таким Email уже зарегистрирован');
                return;
            }

            // Создаем нового пользователя и добавляем в массив
            const newUser = { username, email, password };
            usersList.push(newUser);
            localStorage.setItem('cashglow_users', JSON.stringify(usersList));

            // Сразу логиним после успешной регистрации
            login(username);
            navigate('/dashboard');
        }
    };

    const handleModeToggle = () => {
        setIsLogin(!isLogin);
        // Сбрасываем поля при переключении режима
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
    };

    return (
        <div className={styles.authWrapper}>
            <div className={styles.authCard}>
                <h2 className={styles.authTitle}>{isLogin ? 'Вход в CashGlow' : 'Регистрация'}</h2>
                
                <form onSubmit={submit} className={styles.form}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Имя</label>
                            <input 
                                type="text"
                                placeholder="Ваше имя" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input} 
                            />
                        </div>
                    )}
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input 
                            type="email"
                            placeholder="Введите email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Пароль</label>
                        <input 
                            type="password"
                            placeholder="Введите пароль" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input} 
                        />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input 
                            type="checkbox" 
                            id="remember" 
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label htmlFor="remember">Запомнить меня</label>
                    </div>

                    {error && <p className={styles.formError}>{error}</p>}
                    
                    <div className={styles.submitBtnWrapper}>
                        <Button type="submit" text={isLogin ? 'Войти' : 'Создать аккаунт'} />
                    </div>
                </form>

                <div className={styles.toggleMode}>
                    <p>
                        {isLogin ? 'Ещё нет аккаунта?' : 'Уже зарегистрированы?'}
                        <span className={styles.toggleLink} onClick={handleModeToggle}>
                            {isLogin ? ' Зарегистрироваться' : ' Войти в профиль'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}