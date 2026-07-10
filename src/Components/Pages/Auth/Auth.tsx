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

            const url = isLogin 
                ? 'http://localhost:3001/login' 
                : 'http://localhost:3001/register';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setGeneralError(data.message || 'Произошла ошибка при авторизации');
                return;
            }

            localStorage.setItem('cashglow_token', data.token);
            
            login(data.username);
            
            navigate('/dashboard');

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
                setGeneralError(err.message || 'Что-то пошло не так');
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
                        <div className={styles.errorContainer}>
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                    </div>
                    
                    <div className={styles.fieldWrapper}>
                        <Input 
                            label="Пароль"
                            type="password"
                            placeholder="Введите пароль" 
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        <div className={styles.errorContainer}>
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>
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
                            <div className={styles.errorContainer}>
                                {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                            </div>
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