import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import styles from './Auth.module.scss';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import { authSchema } from './schema';

export default function Auth() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>('');

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');

        try {
            await authSchema.validate(
                { email, password, confirmPassword },
                { abortEarly: false, context: { isLogin } }
            );

            const savedUsers = localStorage.getItem('cashglow_users');
            const usersList = savedUsers ? JSON.parse(savedUsers) : [];

            if (isLogin) {
                const foundUser = usersList.find(
                    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
                );

                if (!foundUser) {
                    setGeneralError('Неверный Email или Пароль, либо аккаунт не существует');
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
                    setErrors(prev => ({ ...prev, email: 'Пользователь с таким Email уже зарегистрирован' }));
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
            if (err.inner) {
                const validationErrors: Record<string, string> = {};
                err.inner.forEach((error: any) => {
                    if (error.path) {
                        validationErrors[error.path] = error.message;
                    }
                });
                setErrors(validationErrors);
            } else {
                setGeneralError(err.message);
            }
        }
    };

    const handleModeToggle = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        setGeneralError('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <h2 className={styles.authTitle}>{isLogin ? 'Вход в CashGlow' : 'Регистрация'}</h2>
                
                <form onSubmit={submit} className={styles.form}>
                    <div className={styles.fieldWrapper}>
                        <Input 
                            label="Email"
                            type="email"
                            placeholder="Введите email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                    
                    <div className={styles.fieldWrapper}>
                        <Input 
                            label="Пароль"
                            type="password"
                            placeholder="Введите пароль" 
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    {!isLogin && (
                        <div className={styles.fieldWrapper}>
                            <Input 
                                label="Повторите пароль"
                                type="password"
                                placeholder="Повторите пароль" 
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                        </div>
                    )}

                    {generalError && <p className={styles.formError}>{generalError}</p>}
                    
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