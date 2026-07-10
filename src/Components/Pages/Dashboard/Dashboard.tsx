import { useState, useEffect } from 'react';
import styles from './Dashboard.module.scss';
import MonthSelector from '../../Widgets/MonthSelector/MonthSelector';
import Analytics from '../../Widgets/Analytics/Analytics';
import TransactionTable from '../../Widgets/TransactionTable/TransactionTable';
import TransactionForm from '../../Widgets/TransactionForm/TransactionForm';

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    date: string;
    category: string;
    title: string;
    amount: number;
}

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

export default function Dashboard() {
    const currentMonth = months[new Date().getMonth()];
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingError, setLoadingError] = useState<string>('');

    // Функция получения транзакций с нативного сервера (порт 3001)
    const fetchTransactions = async () => {
        const token = localStorage.getItem('cashglow_token');
        try {
            const response = await fetch('http://localhost:3001/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить транзакции');
            }

            const data = await response.json();
            setTransactions(data);
        } catch (err: any) {
            setLoadingError(err.message || 'Ошибка сети');
        }
    };

    // Загружаем операции один раз при монтировании компонента
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Отправка новой операции на бэкенд
    const handleAddTransaction = async (data: {
        type: 'income' | 'expense';
        date: string;
        category: string;
        title: string;
        amount: string;
    }) => {
        const token = localStorage.getItem('cashglow_token');
        const newTransaction = {
            type: data.type,
            date: data.date,
            category: data.category,
            title: data.title,
            amount: Number(data.amount)
        };

        try {
            const response = await fetch('http://localhost:3001/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTransaction)
            });

            if (response.ok) {
                // Если сервер успешно сохранил в db.json, обновляем стейт на фронте
                fetchTransactions();
            }
        } catch (err) {
            console.error('Ошибка добавления транзакции:', err);
        }
    };

    const filteredTransactions = transactions
        .filter(item => {
            const itemDate = new Date(item.date);
            const itemMonthName = months[itemDate.getMonth()];
            const itemYear = itemDate.getFullYear();
            const currentYear = new Date().getFullYear();

            return itemMonthName === selectedMonth && itemYear === currentYear;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalIncome = filteredTransactions
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = filteredTransactions
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    return (
        <div className={styles.container}>
            <h1>Твой финансовый трекер</h1>

            <MonthSelector 
                selected={selectedMonth} 
                onChange={setSelectedMonth} 
            />

            {loadingError && <p className={styles.formError}>{loadingError}</p>}

            <div className={styles.main}>
                <section className={styles.form}>
                    <TransactionForm onAdd={handleAddTransaction} />
                </section>
                
                <section className={styles.info}>
                    <Analytics 
                        income={totalIncome} 
                        expense={totalExpense} 
                        balance={totalBalance} 
                    />
                    <TransactionTable items={filteredTransactions} />
                </section>
            </div>
        </div>
    );
}