import styles from './Button.module.scss';

interface ButtonProps {
    text: string;
    type?: 'submit' | 'button' | 'reset';
    onClick?: () => void; 
}

export default function Button({ text, type = 'button', onClick }: ButtonProps) {
    return (
        <button 
            type={type} 
            className={styles.button} 
            onClick={onClick}
        >
            {text}
        </button>
    );
}