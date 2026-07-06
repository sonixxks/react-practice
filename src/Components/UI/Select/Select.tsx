import styles from './Select.module.scss';

interface SelectProps {
    label: string,
    value?: string,
    placeholder?: string,
    options: string[]
}

export default function Select(props: SelectProps) {
    const isPlaceholderActive = !props.value;
    
    return (
        <div className={styles.container}>
            <label className={styles.label}>{props.label}</label>
            <select className={`${styles.select} ${isPlaceholderActive ? styles.placeholder : ''}`} value={props.value || ""}>
                {props.placeholder && (
                    <option value="" hidden>{props.placeholder}</option>
                )}
                {props.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}