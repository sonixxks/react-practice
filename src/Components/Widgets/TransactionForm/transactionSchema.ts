import * as yup from 'yup';

export const transactionSchema = yup.object().shape({
    date: yup.date()
        .typeError('Выберите корректную дату')
        .required('Выберите дату транзакции')
        .max(new Date(), 'Нельзя добавлять транзакции из будущего'),
    category: yup.string().required('Выберите категорию'),
    title: yup.string()
        .required('Введите название или описание операции')
        .max(50, 'Название не должно быть длиннее 50 символов'),
    amount: yup.number()
        .typeError('Сумма должна быть числом')
        .required('Укажите сумму')
        .positive('Сумма должна быть больше нуля')
});