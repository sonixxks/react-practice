import { useState, useEffect } from 'react';
import styles from './TotalAnalytics.module.scss';

// Импортируем компоненты Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../../../Context/AuthContext';

// Регистрируем модули в Chart.js (обязательный шаг для работы)
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    date: string;
    category: string;
    title: string;
    amount: number;
}

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

export default function TotalAnalytics() {
    const { username } = useAuth();
    const userStorageKey = `wallet_transactions_${username || 'guest'}`;

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem(userStorageKey);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const saved = localStorage.getItem(userStorageKey);
        if (saved) {
            setTransactions(JSON.parse(saved));
        }
    }, [userStorageKey]);

    const currentYear = new Date().getFullYear();
    
    // Фильтруем транзакции только за текущий год
    const yearlyTransactions = transactions.filter(item => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear === currentYear;
    });

    // Общие доходы и расходы за год (для карточек)
    const yearlyIncome = yearlyTransactions
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

    const yearlyExpense = yearlyTransactions
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

    const yearlyBalance = yearlyIncome - yearlyExpense;

    // --- ПОДГОТОВКА ДАННЫХ ДЛЯ ГРАФИКА ---
    // Создаем два массива по 12 нулей (для каждого месяца)
    const monthlyIncomes = Array(12).fill(0);
    const monthlyExpenses = Array(12).fill(0);

    yearlyTransactions.forEach(item => {
        const monthIndex = new Date(item.date).getMonth(); // Получаем 0 для Янв, 1 для Фев...
        if (item.type === 'income') {
            monthlyIncomes[monthIndex] += item.amount;
        } else {
            monthlyExpenses[monthIndex] += item.amount;
        }
    });

    // Настройки данных для Chart.js
    const chartData = {
        labels: months, // Оси Х (Янв, Фев...)
        datasets: [
            {
                label: 'Доходы',
                data: monthlyIncomes,
                backgroundColor: '#F282B0', // Твой зеленый цвет
                borderRadius: 6,           // Скругление столбиков
            },
            {
                label: 'Расходы',
                data: monthlyExpenses,
                backgroundColor: '#C53771', // Фирменный темно-розовый CashGlow
                borderRadius: 6,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    // Настройка шрифта для легенды (Доходы / Расходы)
                    font: { 
                        family: 'Montserrat, sans-serif', 
                        size: 13,
                        weight: 500
                    },
                    color: '#333'
                }
            },
            tooltip: {
                // Настройка шрифта внутри всплывающего окошка
                titleFont: { family: 'Montserrat, sans-serif', size: 14 },
                bodyFont: { family: 'Montserrat, sans-serif', size: 13 },
                callbacks: {
                    label: function(context: any) {
                        return ` ${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')} руб`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    font: { family: 'Montserrat, sans-serif', size: 12 },
                    color: '#666'
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: { family: 'Montserrat, sans-serif', size: 12 },
                    color: '#666',
                    callback: function(value: any) {
                        return value.toLocaleString('ru-RU') + ' ₽';
                    }
                }
            }
        }
    };

    // --- РЕЙТИНГ КАТЕГОРИЙ ---
    const categoryMap: { [key: string]: number } = {};
    yearlyTransactions
        .filter(item => item.type === 'expense')
        .forEach(item => {
            if (categoryMap[item.category]) {
                categoryMap[item.category] += item.amount;
            } else {
                categoryMap[item.category] = item.amount;
            }
        });

    const sortedCategories = Object.keys(categoryMap)
        .map(name => ({ name, amount: categoryMap[name] }))
        .sort((a, b) => b.amount - a.amount);

    return (
        <div className={styles.container}>
            <h1>Годовая аналитика ({currentYear})</h1>

            {/* Твоя сетка карточек */}
            <div className={styles.grid}>
                <div className={styles.card}>
                    <span className={styles.title}>Доходы за год:</span>
                    <span className={styles.info}>
                        + {yearlyIncome.toLocaleString('ru-RU')} руб
                    </span>
                </div>
                
                <div className={styles.card}>
                    <span className={styles.title}>Расходы за год:</span>
                    <span className={styles.info}>
                        - {yearlyExpense.toLocaleString('ru-RU')} руб
                    </span>
                </div>
                
                <div className={`${styles.card} ${yearlyBalance >= 0 ? styles.positiveCard : styles.negativeCard}`}>
                    <span className={styles.totalTitle}>Итог за год:</span>
                    <span className={styles.totalInfo}>
                        {yearlyBalance >= 0 ? `+ ${yearlyBalance.toLocaleString('ru-RU')}` : `${yearlyBalance.toLocaleString('ru-RU')}`} руб
                    </span>
                </div>
            </div>

            {/* НАШ НОВЫЙ БЛОК С ГРАФИКОМ */}
            <div className={styles.chartSection}>
                <h2>Сравнение доходов и расходов</h2>
                <div className={styles.chartContainer}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* Рейтинг категорий */}
            <div className={styles.categoriesSection}>
                <h2>Траты по категориям</h2>
                {sortedCategories.length === 0 ? (
                    <p className={styles.empty}>У вас пока нет расходов за этот год</p>
                ) : (
                    <div className={styles.categoryList}>
                        {sortedCategories.map((cat, index) => (
                            <div key={cat.name} className={styles.categoryRow}>
                                <div className={styles.categoryInfo}>
                                    <span className={styles.place}>{index + 1}.</span>
                                    <span className={styles.name}>{cat.name}</span>
                                </div>
                                <span className={styles.amount}>
                                    {cat.amount.toLocaleString('ru-RU')} руб
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}