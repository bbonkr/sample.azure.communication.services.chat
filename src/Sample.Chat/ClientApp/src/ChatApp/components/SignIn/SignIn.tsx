import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useUserApi } from '../../hooks/useUserApi';
import { Section } from '../Layouts';
import { QueryStringParser } from '../../lib/QueryStringParser';
import { FormState, schema } from './FormState';
import * as yup from 'yup';
import { useMessaging } from '../../hooks/useMessaging';
import { FaEnvelope, FaCheck } from 'react-icons/fa';

export const SignIn = () => {
    const location = useLocation();
    const history = useHistory();
    const { user, getUserRequest, isLoadingUser, userError } = useUserApi();
    const { addMessage } = useMessaging();

    const [formState, setFormState] = useState<FormState>({
        isValid: false,
        modified: {},
        errors: {},
        values: {
            email: '',
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
                    getUserRequest({ ...result });
                })
                .catch((err) => {
                    console.error(err.errors);
                });
        }
    };

    useEffect(() => {
        const { search } = location;

        const { returnUrl } = QueryStringParser.parse(search);

        if (user) {
            let url = returnUrl ?? '/';
            history.replace(url);
        }
    }, [user]);

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

    return (
        <Section classNames={['is-full-screen', 'p-header']}>
            <Helmet title="Sign in" />
            <div className="columns is-felx-direction-column is-justify-content-center is-align-items-center">
                <div className="column is-full-mobile is-half is-felx-align-items-center">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label" htmlFor="signin-email">
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
                                    id="signin-email"
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
                            <button
                                className={`button is-primary is-full-width ${
                                    isLoadingUser ? 'is-loading' : ''
                                }`}
                                disabled={isLoadingUser || !formState.isValid}
                                type="submit"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                    <div className="mt-6">
                        <p className="mb-3">
                            If you does not have been account, You can create
                            account with your email address.
                        </p>
                        <Link to="/signup" className="button is-full-width">
                            Go to sign up
                        </Link>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default SignIn;
