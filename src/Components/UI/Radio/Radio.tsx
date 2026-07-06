import styles from './Radio.module.scss';

interface RadioOption {
    value: string;
    label: string;
}

interface RadioProps {
    name: string;
    options: RadioOption[];
    selectedValue?: string | number;
}

export default function Radio({ name, options, selectedValue }: RadioProps) {
    return (
        <div className={styles.container}>
            {options.map((option) => (
                <label className={styles.label} key={option.value}>
                    <input type="radio" name={name} value={option.value} className={styles.input} checked={selectedValue===option.value}/>
                    <span className={styles.typeButton}>{option.label}</span>
                </label>
            ))}
        </div>
    );
}