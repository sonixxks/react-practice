import * as yup from 'yup';

export const authSchema = yup.object().shape({
    username: yup.string().min(2, 'Минимум 2 символа'),       
    email: yup.string().required('Введите Email').email('Некорректный email'),     
    password: yup.string().required('Введите пароль').min(8, 'Пароль должен быть не менее 8 символов'),      
    remember: yup.boolean().default(false)
});