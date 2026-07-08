import Radio from '../../UI/Radio/Radio';
import styles from './MonthSelector.module.scss';

interface MonthSelectorProps {
    selected: string;
    onChange: (month: string) => void;
}

export default function MonthSelector(props: MonthSelectorProps) {
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

    return (
        <div className={styles.container}>
            <Radio 
                name="monthSelector" 
                options={months} 
                selectedValue={props.selected} 
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    );
}