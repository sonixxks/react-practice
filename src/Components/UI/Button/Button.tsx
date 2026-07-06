import styles from './Button.module.scss';

interface ButtonProps {
    text: string,
    type: 'button' | 'submit'
}

export default function Button(props: ButtonProps) {
    return (
        <button type={props.type} className={styles.button}>
            {props.text}
        </button>
    );
}