import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authSchema } from './schema';
import styles from './Auth.module.scss';
import Button from '../../UI/Button/Button';

type AuthFormData = yup.InferType<typeof authSchema>;

interface AuthProps {
    onLoginSuccess: () => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const form = useForm<AuthFormData>({
        resolver: yupResolver(authSchema),
        defaultValues: {
            remember: false
        }
    });

    const submit = (data: AuthFormData) => {
        console.log(data);
        onLoginSuccess();
    };

    const handleModeToggle = () => {
        setIsLogin(!isLogin);
        form.reset();
    };

    return (
        <div className={styles.authWrapper}>
            <div className={styles.authCard}>
                <h2 className={styles.authTitle}>{isLogin ? 'Вход в CashGlow' : 'Регистрация'}</h2>
                <form onSubmit={form.handleSubmit(submit)} className={styles.form}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Имя</label>
                            <Controller 
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <input 
                                        placeholder="Ваше имя" 
                                        {...field} 
                                        className={`${styles.input} ${form.formState.errors.username ? styles.inputError : ''}`} 
                                    />
                                )}
                            />
                            {form.formState.errors.username && (
                                <p className={styles.errorText}>{form.formState.errors.username.message}</p>
                            )}
                        </div>
                    )}
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <Controller 
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <input 
                                    placeholder="email@example.com" 
                                    {...field} 
                                    className={`${styles.input} ${form.formState.errors.email ? styles.inputError : ''}`} 
                                />
                            )}
                        />
                        {form.formState.errors.email && (
                            <p className={styles.errorText}>{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Пароль</label>
                        <Controller 
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <input 
                                    type="password"
                                    placeholder="Введите пароль" 
                                    {...field} 
                                    className={`${styles.input} ${form.formState.errors.password ? styles.inputError : ''}`} 
                                />
                            )}
                        />
                        {form.formState.errors.password && (
                            <p className={styles.errorText}>{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    <div className={styles.checkboxGroup}>
                        <Controller 
                            name="remember"
                            control={form.control}
                            render={({ field: { value, onChange, ...rest } }) => (
                                <input 
                                    type="checkbox" 
                                    id="remember" 
                                    checked={value}
                                    onChange={(e) => onChange(e.target.checked)}
                                    {...rest} 
                                />
                            )}
                        />
                        <label htmlFor="remember">Запомнить меня</label>
                    </div>

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