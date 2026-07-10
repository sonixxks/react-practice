import * as yup from 'yup';

const noCyrillicRegex = /^[a-zA-Z0-9@._\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~-]+$/;

export const authSchema = yup.object().shape({
    email: yup.string()
        .required('Введите Email')
        .email('Некорректный формат email'),
        
    password: yup.string().when('$isLogin', {
        is: false,
        then: (schema) => schema
            .required('Введите пароль')
            .min(8, 'Пароль должен быть не менее 8 символов')
            .matches(noCyrillicRegex, 'Пароль должен содержать только английские буквы и символы'),
        otherwise: (schema) => schema
            .required('Введите пароль')
    }),

    confirmPassword: yup.string().when('$isLogin', {
        is: false,
        then: (schema) => schema
            .required('Повторите пароль')
            .oneOf([yup.ref('password')], 'Пароли не совпадают'),
        otherwise: (schema) => schema.notRequired()
    })
});