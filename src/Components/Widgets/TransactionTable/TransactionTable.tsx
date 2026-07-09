import styles from './TransactionTable.module.scss';

interface Transaction {
    id: string | number;
    title: string;
    category: string;
    amount: number;
    type: 'expense' | 'income';
    date: string;
}

interface TransactionTableProps {
    items: Transaction[];
}

export default function TransactionTable({ items }: TransactionTableProps) {
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
                        {items.map((item) => (
                            <tr key={item.id} className={styles.row}>
                                <td className={styles.cell}>{item.title}</td>
                                <td className={styles.cell}>
                                    <span className={styles.categoryBadge}>{item.category}</span>
                                </td>
                                <td className={styles.cell}>{item.date}</td>
                                <td className={`${styles.cell} ${styles.amount} ${item.type === 'income' ? styles.income : styles.expense}`}>
                                    {item.type === 'income' ? '+' : '-'} {item.amount.toLocaleString('ru-RU')} руб
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}