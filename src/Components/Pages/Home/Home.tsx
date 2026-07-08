import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import Button from '../../UI/Button/Button';
import Card from '../../UI/Card/Card';
import styles from './Home.module.scss';
import analyticsImg from '../../../assets/analytics.jpg'
import expensesImg from '../../../assets/expenses.jpg'
import moneyImg from '../../../assets/money.jpg'


export default function Home() {
    const { isLogged } = useAuth();
    const navigate = useNavigate();

    const handleTrackerClick = () => {
        if (isLogged) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h2>Финансовый помощник</h2>
                <p>Контролируйте свои доходы и расходы, анализируйте бюджет по месяцам и оставайтесь в плюсе!</p>
                <Button type="button" text="Перейти в финансовый трекер" onClick={handleTrackerClick} />
            </section>

            <section className={styles.info}>
                <Card 
                    title="Умная аналитика"
                    description="Приложение автоматически считает итог за месяц и предупреждает, если бюджет уходит в минус."
                />
                <Card image={analyticsImg} alt="Превью аналитики" />
                <Card 
                    title="Помесячный контроль"
                    description="Удобный переключатель позволяет быстро просматривать историю операций за любой выбранный месяц."
                />

                <Card image={expensesImg} alt="Превью транзакций" />
                <Card 
                    title="Быстрый учет"
                    description="Добавление расходов и доходов с мгновенным обновлением всей статистики приложения."
                />
                <Card image={moneyImg} alt="Превью денег" />
            </section>
        </div>
    );
}