import styles from './Analytics.module.scss';

interface AnalyticsProps {
    income: number;
    expense: number;
    balance: number;
}

export default function Analytics({ income, expense, balance }: AnalyticsProps) {
    const isPositive = balance > 0;
    const isZero = balance === 0; 
    
    const totalIncome = income.toLocaleString('ru-RU');
    const totalExpense = expense.toLocaleString('ru-RU');
    const formattedDiff = Math.abs(balance).toLocaleString('ru-RU');

    const cardClass = isZero 
        ? styles.card 
        : (isPositive ? `${styles.card} ${styles.positiveCard}` : `${styles.card} ${styles.negativeCard}`);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <span className={styles.title}>Всего доходов:</span>
                    <span className={styles.info}>{totalIncome} руб</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.title}>Всего расходов:</span>
                    <span className={styles.info}>{totalExpense} руб</span>
                </div>
                <div className={cardClass}>
                    <span className={styles.totalTitle}>Итог:</span>
                    <span className={styles.totalInfo}>
                        {isZero ? '0 руб' : (isPositive ? `+ ${formattedDiff} руб` : `- ${formattedDiff} руб`)}
                    </span>
                </div>
            </div>
        </div>
    );
}