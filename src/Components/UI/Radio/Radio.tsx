import styles from './Radio.module.scss';

interface RadioOption {
    value: string;
    label: string;
}

interface RadioProps {
    name: string;
    options: RadioOption[];
    selectedValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Radio(props: RadioProps) {
    return (
        <div className={styles.container}>
            {props.options.map((option) => (
                <label className={styles.label} key={option.value}>
                    <input 
                        type="radio" 
                        name={props.name} 
                        value={option.value} 
                        className={styles.input} 
                        checked={props.selectedValue === option.value}
                        onChange={props.onChange}
                    />
                    <span className={styles.typeButton}>{option.label}</span>
                </label>
            ))}
        </div>
    );
}