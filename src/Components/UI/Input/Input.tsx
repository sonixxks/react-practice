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

export default function Input(props: InputProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{props.label}</label>
            <input 
                type={props.type} 
                placeholder={props.placeholder} 
                className={styles.input}
                name={props.name}
                onChange={props.onChange}
                onBlur={props.onBlur}
                ref={props.ref}
                value={props.value !== undefined ? props.value : undefined} 
            />
        </div>
    );
}