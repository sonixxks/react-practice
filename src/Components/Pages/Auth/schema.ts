import * as yup from 'yup';

export const authSchema = yup.object().shape({
    email: yup.string().required('Введите Email').email('Некорректный формат email'),     
    password: yup.string().required('Введите пароль').min(8, 'Пароль должен быть не менее 8 символов'),
    confirmPassword: yup.string().when('$isLogin', {
        is: false,
        then: (schema) => schema
            .required('Повторите пароль')
            .oneOf([yup.ref('password')], 'Пароли не совпадают'),
        otherwise: (schema) => schema.notRequired()
    })
});