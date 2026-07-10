import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../../Context/AuthContext';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input'; 
import styles from './Profile.module.scss';

export default function Profile() {
    const { logout } = useAuth(); 
    const navigate = useNavigate();
    
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('cashglow_token');
            try {
                const response = await fetch('http://localhost:3001/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setEmail(data.email);
                }
            } catch (err) {
                console.error('Ошибка загрузки профиля:', err);
            }
        };

        fetchProfileData();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        setMessage({ text: 'Данные профиля успешно обновлены!', isError: false });
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