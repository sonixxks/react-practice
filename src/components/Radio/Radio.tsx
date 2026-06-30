import styles from './Radio.module.css';

interface RadioProps {
    selectedValue: 'expense' | 'income'
}

export default function Radio(props: RadioProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                <input type="radio" name="operationType" value="expense" className={styles.input} checked={props.selectedValue==="expense"}/>
                <span className={styles.typeButton}>Расход</span>
            </label>

            <label className={styles.label}>
                <input type="radio" name="operationType" value="income" className={styles.input} checked={props.selectedValue==="income"}/>
                <span className={styles.typeButton}>Доход</span>
            </label>
        </div>
    );
}