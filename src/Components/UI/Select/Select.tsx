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

export default function Select(props: SelectProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{props.label}</label>
            <select 
                className={styles.select}
                name={props.name}
                onChange={props.onChange}
                onBlur={props.onBlur}
                ref={props.ref}
                value={props.value !== undefined ? props.value : undefined}
            >
                <option value="" disabled>Выберите категорию</option>
                {props.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}