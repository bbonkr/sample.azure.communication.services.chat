import React, { useEffect, useState } from 'react';
import { FormState, FormValues, schema } from './ChatFormState';
import { FaPaperclip } from 'react-icons/fa';
import * as yup from 'yup';

export interface ChatFormProps {
    onSendMessage?: (message: string) => void;
    onSendFile?: (files: File[]) => void;
}

export const ChatForm = ({ onSendFile, onSendMessage }: ChatFormProps) => {
    const [formState, setFormState] = useState<FormState>({
        isValid: false,
        errors: {},
        modified: {},
        values: {
            message: '',
        },
    });

    const validateFormState = async (
        resolve?: (values: FormValues) => void,
        reject?: (err: yup.ValidationError) => void,
    ) => {
        if (formState?.values) {
            schema
                .validate(formState.values, {
                    abortEarly: false,
                })
                .then((result) => {
                    setFormState((prevState) => ({
                        ...prevState,
                        isValid: true,
                        errors: {},
                    }));

                    if (resolve) {
                        resolve(formState?.values);
                    }
                })
                .catch((err: yup.ValidationError) => {
                    setFormState((prevState) => {
                        prevState.errors = {};

                        err.inner.forEach((validationError) => {
                            if (validationError.path) {
                                prevState.errors = {
                                    ...prevState.errors,
                                    [validationError.path]:
                                        validationError.message,
                                };
                            }
                        });

                        return { ...prevState, isValid: false };
                    });

                    if (reject) {
                        reject(err);
                    }
                });
        }
    };

    const handleChangeFormValue = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;

        setFormState((prevState) => ({
            ...prevState,
            values: {
                ...prevState.values,
                [name]: value,
            },
            modified: {
                ...prevState.modified,
                [name]: true,
            },
        }));
    };

    const handleClickSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        validateFormState((values) => {
            if (onSendMessage) {
                console.info('sendMessage', values.message);
                onSendMessage(values.message);
                setFormState((prevState) => ({
                    ...prevState,
                    values: {
                        message: '',
                    },
                    modified: {
                        message: false,
                    },
                    errors: {
                        message: '',
                    },
                }));
            }
        });
    };

    const handleClickChangeFile = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.currentTarget.files) {
            if (onSendFile) {
                const files = Array.from(event.currentTarget.files).map(
                    (f: File) => f,
                );
                onSendFile(files);

                event.currentTarget.value = '';
            }
        }
    };

    useEffect(() => {
        if (formState?.values) {
            validateFormState()
                .then(() => {
                    console.info('FormState validate completed.');
                })
                .catch((err) => {
                    console.error('FormState validate failed.');
                });
        }
    }, [formState.values]);

    return (
        <form onSubmit={handleClickSendMessage}>
            <div className="field">
                {/* <label className="label" htmlFor="chat-message">
                    Message
                </label> */}
                <p
                    className={`help ${
                        !formState.modified.message
                            ? ''
                            : formState.errors.message
                            ? 'is-danger'
                            : 'is-success'
                    }`}
                >
                    {formState.modified.message ? formState.errors.message : ''}
                </p>
                <div className="field has-addons">
                    <div className="control">
                        <div className="file">
                            <label className="file-label">
                                <input
                                    className="file-input"
                                    type="file"
                                    name="files"
                                    multiple
                                    onChange={handleClickChangeFile}
                                />

                                <span className="file-cta">
                                    <span className="file-icon">
                                        <FaPaperclip />
                                    </span>
                                    <span className="file-label"></span>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="control is-expanded">
                        <textarea
                            name="message"
                            id="chat-message"
                            className="textarea"
                            value={formState.values.message}
                            onChange={handleChangeFormValue}
                        ></textarea>
                    </div>
                    <div className="control">
                        <button type="submit" className="button is-full-height">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};
