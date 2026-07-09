import styles from './Input.module.scss';

interface InputProps {
    label: string;
    type: 'text' | 'number' | 'date' | 'email';
    placeholder?: string;
    value?: string | number;
    name?: string;
    onChange?: (e: any) => void;
    onBlur?: (e: any) => void;
    ref?: any;
}

export default function Input({ label, type, placeholder, value, name, onChange, onBlur, ref }: InputProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>
            <input 
                type={type} 
                placeholder={placeholder} 
                className={styles.input}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                value={value} 
            />
        </div>
    );
}