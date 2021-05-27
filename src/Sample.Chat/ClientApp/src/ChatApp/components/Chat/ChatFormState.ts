import * as yup from 'yup';

export const schema = yup.object({
    message: yup.string().required().label('Message'),
});

export type FormValues = yup.InferType<typeof schema>;

export type FormValuesKeys = keyof FormValues;

export type FormModified = {
    [key in FormValuesKeys]?: boolean;
};

export type FormErrors = {
    [key in FormValuesKeys]?: string;
};

export interface FormState {
    isValid: boolean;
    values: FormValues;
    modified: FormModified;
    errors: FormErrors;
}
