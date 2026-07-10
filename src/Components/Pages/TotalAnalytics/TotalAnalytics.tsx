import { useState, useEffect } from 'react';
import styles from './TotalAnalytics.module.scss';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../../Context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    date: string;
    category: string;
    title: string;
    amount: number;
}

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const categoryColors = [
    '#C53771', '#F282B0', '#7a465a', '#9b59b6', 
    '#e74c3c', '#e67e22', '#f1c40f', '#1abc9c', 
    '#2ecc71', '#3498db', '#34495e', '#95a5a6'
];

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
    
    const yearlyTransactions = transactions.filter(item => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear === currentYear;
    });

    const yearlyIncome = yearlyTransactions
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

    const yearlyExpense = yearlyTransactions
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

    const yearlyBalance = yearlyIncome - yearlyExpense;

    const isZero = yearlyBalance === 0;
    const isPositive = yearlyBalance > 0;

    const monthlyIncomes = Array(12).fill(0);
    const monthlyExpenses = Array(12).fill(0);

    yearlyTransactions.forEach(item => {
        const monthIndex = new Date(item.date).getMonth();
        if (item.type === 'income') {
            monthlyIncomes[monthIndex] += item.amount;
        } else {
            monthlyExpenses[monthIndex] += item.amount;
        }
    });

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Доходы',
                data: monthlyIncomes,
                backgroundColor: '#F282B0',
                borderRadius: 6,
            },
            {
                label: 'Расходы',
                data: monthlyExpenses,
                backgroundColor: '#C53771',
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
                    font: { family: 'Montserrat, sans-serif', size: 13, weight: 500 },
                    color: '#333'
                }
            },
            tooltip: {
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
                ticks: { font: { family: 'Montserrat, sans-serif', size: 12 }, color: '#666' },
                grid: { display: false }
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

    const categoryMap: { [key: string]: number } = {};
    yearlyTransactions
        .filter(item => item.type === 'expense')
        .forEach(item => {
            categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
        });

    const sortedCategories = Object.keys(categoryMap)
        .map(name => ({ name, amount: categoryMap[name] }))
        .sort((a, b) => b.amount - a.amount);

    const categoryChartData = {
        labels: sortedCategories.map(c => c.name),
        datasets: [
            {
                data: sortedCategories.map(c => c.amount),
                backgroundColor: categoryColors.slice(0, sortedCategories.length),
                borderWidth: 1,
            }
        ]
    };

    const categoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false 
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const value = context.raw;
                        const percentage = ((value / yearlyExpense) * 100).toFixed(1);
                        return ` ${context.label}: ${value.toLocaleString('ru-RU')} руб (${percentage}%)`;
                    }
                }
            }
        }
    };

    const totalCardClass = isZero 
        ? styles.card 
        : (isPositive ? `${styles.card} ${styles.positiveCard}` : `${styles.card} ${styles.negativeCard}`);

    return (
        <div className={styles.container}>
            <h1>Годовая аналитика ({currentYear})</h1>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <span className={styles.title}>Доходы за год:</span>
                    <span className={styles.info}>
                        {yearlyIncome.toLocaleString('ru-RU')} руб
                    </span>
                </div>
                
                <div className={styles.card}>
                    <span className={styles.title}>Расходы за год:</span>
                    <span className={styles.info}>
                        {yearlyExpense.toLocaleString('ru-RU')} руб
                    </span>
                </div>
                
                <div className={totalCardClass}>
                    <span className={styles.totalTitle}>Итог за год:</span>
                    <span className={styles.totalInfo}>
                        {isZero ? '0 руб' : (isPositive ? `+ ${yearlyBalance.toLocaleString('ru-RU')} руб` : `${yearlyBalance.toLocaleString('ru-RU')} руб`)}
                    </span>
                </div>
            </div>

            <div className={styles.chartSection}>
                <h2>Сравнение доходов и расходов</h2>
                <div className={styles.chartContainer}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className={styles.categoriesSection}>
                <h2>Расходы по категориям</h2>
                {sortedCategories.length === 0 ? (
                    <p className={styles.empty}>У вас пока нет расходов за этот год</p>
                ) : (
                    <div className={styles.categoriesContent}>
                        <div className={styles.doughnutContainer}>
                            <Doughnut data={categoryChartData} options={categoryChartOptions} />
                        </div>
                        
                        <div className={styles.categoryList}>
                            {sortedCategories.map((category, index) => {
                                return (
                                    <div key={category.name} className={styles.categoryRow}>
                                        <div className={styles.categoryInfo}>
                                            <span 
                                                className={styles.colorMarker} 
                                                style={{ backgroundColor: categoryColors[index] }}
                                            />
                                            <span className={styles.name}>{category.name}</span>
                                        </div>
                                        <span className={styles.amount}>
                                            {category.amount.toLocaleString('ru-RU')} руб
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}