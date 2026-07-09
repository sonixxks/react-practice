import { useState, useEffect } from 'react';
import styles from './Dashboard.module.scss';
import Button from '../../UI/Button/Button';
import MonthSelector from '../../Widgets/MonthSelector/MonthSelector';
import Analytics from '../../Widgets/Analytics/Analytics';
import TransactionTable from '../../Widgets/TransactionTable/TransactionTable';
import TransactionForm from '../../Widgets/TransactionForm/TransactionForm';
import { useAuth } from '../../../Context/AuthContext';

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
    const { username, logout } = useAuth(); 
    
    const currentMonth = months[new Date().getMonth()];
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

    const userStorageKey = `wallet_transactions_${username || 'guest'}`;

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem(userStorageKey);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(userStorageKey, JSON.stringify(transactions));
    }, [transactions, userStorageKey]);

    const handleAddTransaction = (data: {
        type: 'income' | 'expense';
        date: string;
        category: string;
        title: string;
        amount: string;
    }) => {
        const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: data.type,
            date: data.date,
            category: data.category,
            title: data.title,
            amount: Number(data.amount)
        };

        setTransactions(prev => [newTransaction, ...prev]);
    };

    const filteredTransactions = transactions.filter(item => {
        const itemMonthIndex = new Date(item.date).getMonth();
        const itemMonthName = months[itemMonthIndex];
        return itemMonthName === selectedMonth;
    });

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

            <div className={styles.exit}>
                <Button text="Выйти из аккаунта" onClick={logout} />
            </div>
        </div>
    );
}