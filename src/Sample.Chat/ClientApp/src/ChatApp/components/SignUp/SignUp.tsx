import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory } from 'react-router-dom';
import { useUserApi } from '../../hooks/useUserApi';
import { Section } from '../Layouts';
import { FormState, schema } from './FormState';
import { FaEnvelope, FaCheck } from 'react-icons/fa';
import * as yup from 'yup';
import { useMessaging } from '../../hooks/useMessaging';
import { QueryStringParser } from '../../lib/QueryStringParser';

export const SignUp = () => {
    const history = useHistory();
    const { user, createUserRequest, isLoadingUser, userError } = useUserApi();
    const { addMessage } = useMessaging();

    const [formState, setFormState] = useState<FormState>({
        isValid: false,
        modified: {},
        errors: {},
        values: {
            email: '',
            displayName: '',
        },
    });

    const handleChangeFormState = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formState.isValid) {
            schema
                .validate(formState.values)
                .then((result) => {
                    createUserRequest({ ...result });
                })
                .catch((err) => {
                    console.error(err.errors);
                });
        }
    };

    useEffect(() => {
        schema
            .validate(formState.values, { abortEarly: false })
            .then((result) => {
                setFormState((prevState) => ({
                    ...prevState,
                    isValid: true,
                    errors: {},
                }));
            })
            .catch((err: yup.ValidationError) => {
                setFormState((prevState) => {
                    prevState.errors = {};

                    err.inner.forEach((validationError) => {
                        if (validationError.path) {
                            prevState.errors = {
                                ...prevState.errors,
                                [validationError.path]: validationError.message,
                            };
                        }
                    });

                    return { ...prevState, isValid: false };
                });
            });
    }, [formState.values]);

    useEffect(() => {
        if (userError) {
            addMessage({
                id: `${+new Date()}`,
                title: 'Notification',
                detail: <p>{userError.message}</p>,
                color: 'is-danger',
            });
        }
    }, [userError]);

    useEffect(() => {
        const { search } = location;

        const { returnUrl } = QueryStringParser.parse(search);

        if (user) {
            let url = returnUrl ?? '/';
            history.replace(url);
        }
    }, [user]);

    return (
        <Section classNames={['is-full-screen']}>
            <Helmet title="Sign up" />
            <div className="columns is-felx-direction-column is-justify-content-center is-align-items-center">
                <div className="column is-full-mobile is-half is-felx-align-items-center">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label" htmlFor="signup-email">
                                Email
                            </label>
                            <div className="control has-icons-right">
                                <input
                                    type="email"
                                    className={`input ${
                                        !formState.modified.email
                                            ? ''
                                            : formState.errors.email
                                            ? 'is-danger'
                                            : 'is-success'
                                    }`}
                                    id="signup-email"
                                    name="email"
                                    value={formState?.values?.email}
                                    onChange={handleChangeFormState}
                                    placeholder="Your email address"
                                />

                                <span className="icon is-small is-right">
                                    {!formState.modified.email ? (
                                        <span></span>
                                    ) : formState.errors.email ? (
                                        <FaEnvelope />
                                    ) : (
                                        <FaCheck />
                                    )}
                                </span>
                                <p
                                    className={`help ${
                                        !formState.modified.email
                                            ? ''
                                            : formState.errors.email
                                            ? 'is-danger'
                                            : 'is-success'
                                    }`}
                                >
                                    {formState.modified.email
                                        ? formState.errors.email
                                        : ''}
                                </p>
                            </div>
                        </div>

                        <div className="field">
                            <label
                                htmlFor="signup-displayName"
                                className="label"
                            >
                                Name
                            </label>
                            <div className="control has-icons-right">
                                <input
                                    type="text"
                                    className={`input ${
                                        !formState.modified.displayName
                                            ? ''
                                            : formState.errors.displayName
                                            ? 'is-danger'
                                            : 'is-success'
                                    }`}
                                    id="signup-displayName"
                                    name="displayName"
                                    value={formState?.values?.displayName}
                                    onChange={handleChangeFormState}
                                    placeholder="Your name"
                                />
                                <span className="icon is-small is-right">
                                    {!formState.modified.displayName ? (
                                        <span></span>
                                    ) : formState.errors.displayName ? (
                                        <FaEnvelope />
                                    ) : (
                                        <FaCheck />
                                    )}
                                </span>
                                <p
                                    className={`help ${
                                        !formState.modified.displayName
                                            ? ''
                                            : formState.errors.displayName
                                            ? 'is-danger'
                                            : 'is-success'
                                    }`}
                                >
                                    {formState.modified.displayName
                                        ? formState.errors.displayName
                                        : ''}
                                </p>
                            </div>
                        </div>

                        <div className="field">
                            <button
                                className={`button is-primary is-full-width ${
                                    isLoadingUser ? 'is-loading' : ''
                                }`}
                                disabled={isLoadingUser || !formState.isValid}
                                type="submit"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                    <div className="mt-6">
                        <p className="mb-3">
                            If you has been account already, Sign in using your
                            email address.
                        </p>
                        <Link to="/signin" className="button is-full-width">
                            Go to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default SignUp;
