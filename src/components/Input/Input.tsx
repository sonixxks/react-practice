import styles from './Input.module.css';

interface InputProps {
    label: string,
    type: 'text' | 'number' | 'date',
    placeholder: string,
    value?: string | number
}

export default function Input(props: InputProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{props.label}</label>
            <input type={props.type} placeholder={props.placeholder} value={props.value || ""} className={styles.input}/>
        </div>
    );
}