import styles from './Analytics.module.scss';

interface AnalyticsProps {
    income: number;
    expense: number;
    balance: number;
}

export default function Analytics(props: AnalyticsProps) {
    const isPositive = props.balance >= 0;
    const totalIncome = props.income.toLocaleString('ru-RU');
    const totalExpense = props.expense.toLocaleString('ru-RU');
    const formattedDiff = Math.abs(props.balance).toLocaleString('ru-RU');

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <span className={styles.title}>Всего доходов:</span>
                    <span className={styles.info}>+ {totalIncome} руб</span>
                </div>
                <div className={styles.card}>
                    <span className={styles.title}>Всего расходов:</span>
                    <span className={styles.info}>- {totalExpense} руб</span>
                </div>
                <div className={`${styles.card} ${isPositive ? styles.positiveCard : styles.negativeCard}`}>
                    <span className={styles.totalTitle}>Итог:</span>
                    <span className={styles.totalInfo}>
                        {isPositive ? `+ ${formattedDiff} руб` : `- ${formattedDiff} руб`}
                    </span>
                </div>
            </div>
        </div>
    );
}