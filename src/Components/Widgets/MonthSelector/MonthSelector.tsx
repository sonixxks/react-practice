import Radio from '../../UI/Radio/Radio';
import styles from './MonthSelector.module.scss';

export default function MonthSelector() {
    const months = [
        { value: 'jan', label: 'Янв' }, 
        { value: 'feb', label: 'Фев' },
        { value: 'mar', label: 'Мар' }, 
        { value: 'apr', label: 'Апр' },
        { value: 'may', label: 'Май' }, 
        { value: 'jun', label: 'Июн' },
        { value: 'jul', label: 'Июл' }, 
        { value: 'aug', label: 'Авг' },
        { value: 'sep', label: 'Сен' }, 
        { value: 'oct', label: 'Окт' },
        { value: 'nov', label: 'Ноя' }, 
        { value: 'dec', label: 'Дек' }
    ];

    return (
        <div className={styles.container}>
            <Radio name="monthSelector" options={months} selectedValue="jul" />
        </div>
    );
}