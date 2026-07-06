import styles from './Analytics.module.scss';

export default function Analytics() {
    const income = 15000;
    const expense = 4500;
    const difference = income - expense;
    const isPositive = difference >= 0;

    // Форматирование чисел
    const totalIncome = income.toLocaleString('ru-RU');
    const totalExpense = expense.toLocaleString('ru-RU');
    const formattedDiff = Math.abs(difference).toLocaleString('ru-RU');

    return (
        <div className={styles.container}>
            <h2>Статистика</h2>
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
    )
}