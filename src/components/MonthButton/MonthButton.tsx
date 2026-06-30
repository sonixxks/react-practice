import styles from './MonthButton.module.css';

interface MonthButtonProps {
    label: string,
    isActive: boolean
}

export default function MonthButton(props: MonthButtonProps) {
    return (
        <button type="button" className={`${styles.monthButton} ${props.isActive ? styles.active : ''}`}>{props.label}</button>
    );
}