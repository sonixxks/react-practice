import styles from './Select.module.scss';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    label: string;
    options: Option[];
    value?: string;
    name?: string;
    onChange?: (e: any) => void;
    onBlur?: (e: any) => void;
    ref?: any;
}

export default function Select({ label, options, value, name, onChange, onBlur, ref }: SelectProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>
            <select 
                className={styles.select}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                value={value}
            >
                <option value="" disabled>Выберите категорию</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}