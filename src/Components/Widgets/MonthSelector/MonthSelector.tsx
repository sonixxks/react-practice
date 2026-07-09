import Radio from '../../UI/Radio/Radio';
import styles from './MonthSelector.module.scss';

interface MonthSelectorProps {
    selected: string;
    onChange: (month: string) => void;
}

const months = [
    { value: 'Янв', label: 'Янв' }, 
    { value: 'Фев', label: 'Фев' },
    { value: 'Мар', label: 'Мар' }, 
    { value: 'Апр', label: 'Апр' },
    { value: 'Май', label: 'Май' }, 
    { value: 'Июн', label: 'Июн' },
    { value: 'Июл', label: 'Июл' }, 
    { value: 'Авг', label: 'Авг' },
    { value: 'Сен', label: 'Сен' }, 
    { value: 'Окт', label: 'Окт' },
    { value: 'Ноя', label: 'Ноя' }, 
    { value: 'Дек', label: 'Дек' }
];

export default function MonthSelector({ selected, onChange }: MonthSelectorProps) {
    return (
        <div className={styles.container}>
            <Radio 
                name="monthSelector" 
                options={months} 
                selectedValue={selected} 
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}