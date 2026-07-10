import * as yup from 'yup';

const regex = /^[a-zA-Z0-9@._\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~-]+$/;

export const profileSchema = yup.object().shape({
    email: yup.string()
        .required('Email не может быть пустым')
        .email('Некорректный формат email')
        .matches(regex, 'Некорректный формат email'),
        
    password: yup.string()
        .required('Введите новый пароль')
        .min(8, 'Пароль должен быть не менее 8 символов')
        .matches(regex, 'Пароль должен содержать только английские буквы и символы'),
        
    confirmPassword: yup.string()
        .required('Повторите новый пароль')
        .oneOf([yup.ref('password')], 'Пароли не совпадают')
});