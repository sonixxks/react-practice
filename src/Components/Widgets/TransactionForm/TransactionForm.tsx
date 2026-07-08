import { useState } from 'react';
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import Radio from "../../UI/Radio/Radio";
import Select from "../../UI/Select/Select";
import styles from './TransactionForm.module.scss';

interface TransactionData {
    type: 'income' | 'expense';
    date: string;
    category: string;
    title: string;
    amount: string;
}

interface TransactionFormProps {
    onAdd: (data: TransactionData) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
    const typeOptions = [
        { value: 'income', label: 'Доход' },
        { value: 'expense', label: 'Расход' }
    ];
    
    const expenseCategories = [
        'Транспорт', 'Продукты', 'Бытовые услуги', 'ЖКХ, связь и интернет', 
        'Развлечения', 'Кафе, рестораны и фастфуд', 'Маркетплейсы', 
        'Медицинские услуги и аптека', 'На инвестиции', 'Образование', 
        'Одежда и обувь', 'Парфюмерия и косметика', 'Переводы людям', 
        'Питомцы', 'Подписки', 'Путешествия', 'Салоны красоты', 'Прочее'
    ];

    const incomeCategories = [
        'Стипендия', 'Зарплата', 'Подработка', 
        'Подарок', 'Кэшбэк', 'Инвестиции', 'Прочее'
    ];

    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    const currentCategories = type === 'income' ? incomeCategories : expenseCategories;
    const selectOptions = currentCategories.map(cat => ({ value: cat, label: cat }));

    const handleTypeChange = (newType: 'income' | 'expense') => {
        setType(newType);
        setCategory(''); 
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ type, date, category, title, amount });
        setDate('');
        setCategory('');
        setTitle('');
        setAmount('');
        setType('expense');
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <h2>Новая транзакция</h2>
            
            <Radio 
                name="transactionType"
                options={typeOptions} 
                selectedValue={type}
                onChange={(e) => handleTypeChange(e.target.value as 'income' | 'expense')}
            />

            <Input 
                label="Дата" 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            
            <Select 
                label="Категория" 
                options={selectOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            
            <Input 
                label="Название / описание" 
                type="text" 
                placeholder="Например, маникюр" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            
            <Input 
                label="Сумма, руб" 
                type="number" 
                placeholder="Введите сумму в рублях" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            
            <Button text="Добавить" type="submit" />
        </form>
    );
}