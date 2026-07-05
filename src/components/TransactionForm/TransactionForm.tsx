import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import Radio from "../../UI/Radio/Radio";
import Select from "../../UI/Select/Select";
import styles from './TransactionForm.module.css';

export default function TransactionForm() {
const categories = ['Транспорт', 'Продукты', 'Стипендия', 'Бытовые услуги', 'ЖКХ, связь и интернет', 'Развлечения', 'Кафе, рестораны и фастфуд', 'Маркетплейсы', 'Медецинские услуги и аптека', 'На инвестиции', 'Образование', 'Одежда и обувь', 'Парфюмерия и косметика', 'Переводы людям', 'Питомцы', 'Подписки', 'Путешествия', 'Салоны красоты', 'Прочее']

    return (
        <form className={styles.container}>
            <h2>Новая транзакция</h2>
            <Radio selectedValue="expense"/>
            <Input label="Дата" type="date" value="" placeholder=""/>
            <Select label="Категория" value="" placeholder="Выберите категорию" options={categories}/>
            <Input label="Название / описание" type="text" placeholder="Например, маникюр" value=""/>
            <Input label="Сумма, руб" type="number" placeholder="Введите сумму в рублях" value="" />
            <Button text="Добавить" type="submit" />
        </form>
    );
}
