import styles from './TransactionTable.module.css';

interface Transaction {
    id: number;
    title: string;
    category: string;
    amount: string;
    type: 'expense' | 'income';
    date: string;
}

export default function TransactionTable() {
    const testData: Transaction[] = [
        {id: 1, title: 'Продукты на ужин', category: 'Продукты', amount: '-500 руб', type: 'expense', date: '29.06.2026'},
        {id: 2, title: 'Стипендия в мае', category: 'Стипендия', amount: '+19865 руб', type: 'income', date: '25.05.2026'}
    ];

    return (
        <div className={styles.container}>
            <h2>История транзакций</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeadRow}>
                            <th className={styles.th}>Транзакция</th>
                            <th className={styles.th}>Категория</th>
                            <th className={styles.th}>Дата</th>
                            <th className={`${styles.th} ${styles.thAmount}`}>Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testData.map((item) => (
                            <tr key={item.id} className={styles.row}>
                                <td className={styles.cell}>{item.title}</td>
                                <td className={styles.cell}>
                                <span className={styles.categoryBadge}>{item.category}</span>
                                </td>
                                <td className={styles.cell}>{item.date}</td>
                                <td className={`${styles.cell} ${styles.amount} ${item.type === 'income' ? styles.income : styles.expense}`}>
                                {item.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}