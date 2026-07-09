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

export default function Radio({ name, options, selectedValue, onChange }: RadioProps) {
    return (
        <div className={styles.container}>
            {options.map((option) => (
                <label className={styles.label} key={option.value}>
                    <input 
                        type="radio" 
                        name={name} 
                        value={option.value} 
                        className={styles.input} 
                        checked={selectedValue === option.value}
                        onChange={onChange}
                    />
                    <span className={styles.typeButton}>{option.label}</span>
                </label>
            ))}
        </div>
    );
}