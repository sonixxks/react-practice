import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../../Context/AuthContext';
import { profileSchema } from './profileSchema';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input'; 
import styles from './Profile.module.scss';

export default function Profile() {
    const { username, login, logout } = useAuth(); 
    const navigate = useNavigate();
    
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

    useEffect(() => {
        const savedUsers = localStorage.getItem('cashglow_users');
        if (savedUsers && username) {
            const usersList = JSON.parse(savedUsers);
            const currentUser = usersList.find((u: any) => u.username === username);
            if (currentUser) {
                setEmail(currentUser.email);
                setPassword('');
                setConfirmPassword('');
            }
        }
    }, [username]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            await profileSchema.validate({ email, password, confirmPassword });

            const savedUsers = localStorage.getItem('cashglow_users');
            let usersList = savedUsers ? JSON.parse(savedUsers) : [];

            const isEmailTaken = usersList.some(
                (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.username !== username
            );

            if (isEmailTaken) {
                setMessage({ text: 'Этот Email уже занят другим пользователем', isError: true });
                return;
            }

            usersList = usersList.map((u: any) => {
                if (u.username === username) {
                    return { ...u, email, password };
                }
                return u;
            });

            localStorage.setItem('cashglow_users', JSON.stringify(usersList));
            
            if (username) {
                login(username);
            }

            setMessage({ text: 'Данные профиля успешно обновлены!', isError: false });
        } catch (err: any) {
            setMessage({ text: err.message, isError: true });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    return (
        <div className={styles.container}>
            <h1>Настройки профиля</h1>

            <div className={styles.profileCard}>
                <form onSubmit={handleUpdate} className={styles.form}>
                    <Input 
                        label="Email"
                        type="email" 
                        value={email} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                        placeholder="Введите email"
                    />

                    <Input 
                        label="Новый пароль"
                        type="password" 
                        value={password} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                        placeholder="Введите новый пароль"
                    />

                    <Input 
                        label="Повторите новый пароль"
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} 
                        placeholder="Повторите новый пароль"
                    />

                    {message && (
                        <p className={message.isError ? styles.error : styles.success}>
                            {message.text}
                        </p>
                    )}

                    <div className={styles.btnWrapper}>
                        <Button type="submit" text="Сохранить изменения" />
                    </div>
                </form>
            </div>
            <div className={styles.logout}>
                <Button type="button" text="Выйти из аккаунта" onClick={handleLogout} />
            </div>
        </div>
    );
}