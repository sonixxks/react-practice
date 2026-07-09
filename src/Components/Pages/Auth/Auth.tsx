import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import styles from './Auth.module.scss';
import Button from '../../UI/Button/Button';
import { authSchema } from './schema';

export default function Auth() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            await authSchema.validate(
                { email, password, confirmPassword },
                { context: { isLogin } }
            );

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

                const generatedName = foundUser.username || email.split('@')[0];
                login(generatedName);
                navigate('/dashboard');
            } else {
                const isEmailTaken = usersList.some(
                    (u: any) => u.email.toLowerCase() === email.toLowerCase()
                );

                if (isEmailTaken) {
                    setError('Пользователь с таким Email уже зарегистрирован');
                    return;
                }

                const username = email.split('@')[0];
                const newUser = { username, email, password };
                usersList.push(newUser);
                localStorage.setItem('cashglow_users', JSON.stringify(usersList));

                login(username);
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleModeToggle = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <h2 className={styles.authTitle}>{isLogin ? 'Вход в CashGlow' : 'Регистрация'}</h2>
                
                <form onSubmit={submit} className={styles.form}>
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

                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Повторите пароль</label>
                            <input 
                                type="password"
                                placeholder="Повторите пароль" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input} 
                            />
                        </div>
                    )}

                    {error && <p className={styles.formError}>{error}</p>}
                    
                    <div className={styles.submitButton}>
                        <Button type="submit" text={isLogin ? 'Войти' : 'Создать аккаунт'} />
                    </div>
                </form>

                <div className={styles.toggle}>
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