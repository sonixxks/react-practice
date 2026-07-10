import { useState } from 'react';
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import Radio from "../../UI/Radio/Radio";
import Select from "../../UI/Select/Select";
import styles from './TransactionForm.module.scss';
import { transactionSchema } from './transactionSchema';

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

export default function TransactionForm({ onAdd }: TransactionFormProps) {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    
    const [errors, setErrors] = useState<Record<string, string>>({});

    const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

    const handleTypeChange = (newType: 'income' | 'expense') => {
        setType(newType);
        setCategory(''); 
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await transactionSchema.validate(
                { date, category, title, amount }, 
                { abortEarly: false }
            );

            onAdd({ type, date, category, title, amount });
            setDate('');
            setCategory('');
            setTitle('');
            setAmount('');
        } catch (err: any) {
            if (err.inner) {
                const validationErrors: Record<string, string> = {};
                err.inner.forEach((error: any) => {
                    if (error.path) {
                        validationErrors[error.path] = error.message;
                    }
                });
                setErrors(validationErrors);
            }
        }
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

            <div className={styles.fieldWrapper}>
                <Input 
                    label="Дата" 
                    type="date" 
                    value={date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                />
                {errors.date && <span className={styles.errorText}>{errors.date}</span>}
            </div>
            
            <div className={styles.fieldWrapper}>
                <Select 
                    label="Категория" 
                    options={currentCategories.map(cat => ({ value: cat, label: cat }))}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                {errors.category && <span className={styles.errorText}>{errors.category}</span>}
            </div>
            
            <div className={styles.fieldWrapper}>
                <Input 
                    label="Название / описание" 
                    type="text" 
                    placeholder="Например, маникюр" 
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                />
                {errors.title && <span className={styles.errorText}>{errors.title}</span>}
            </div>
            
            <div className={styles.fieldWrapper}>
                <Input 
                    label="Сумма, руб" 
                    type="number" 
                    placeholder="Введите сумму в рублях" 
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                />
                {errors.amount && <span className={styles.errorText}>{errors.amount}</span>}
            </div>
            
            <Button text="Добавить" type="submit" />
        </form>
    );
}