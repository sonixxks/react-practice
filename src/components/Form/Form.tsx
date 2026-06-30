import Button from "../Button/Button";
import Input from "../Input/Input";
import Radio from "../Radio/Radio";
import Select from "../Select/Select";
import styles from './Form.module.css';

export default function Form() {
const categories = ['Транспорт', 'Продукты', 'Госплатежи', 'Бытовые услуги', 'ЖКХ, связь и интернет', 'Развлечения', 'Кафе, рестораны и фастфуд', 'Маркетплейсы', 'Медецинские услуги и аптека', 'На инвестиции', 'Образование', 'Одежда и обувь', 'Парфюмерия и косметика', 'Переводы людям', 'Питомцы', 'Подписки', 'Путешествия', 'Салоны красоты', 'Прочее']

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
