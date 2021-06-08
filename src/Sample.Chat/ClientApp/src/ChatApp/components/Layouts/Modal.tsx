import React, { PropsWithChildren } from 'react';

interface ModalProps {
    title: React.ReactNode;
    body?: React.ReactNode;
    footer?: React.ReactNode;
    open?: boolean;
    onClose?: () => void;
}

export const Modal = ({
    title,
    body,
    footer,
    open,
    children,
    onClose,
}: PropsWithChildren<ModalProps>) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };
    if (!open) {
        return <React.Fragment></React.Fragment>;
    }
    return (
        <div className={`modal ${open ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={handleClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{title}</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={handleClose}
                    ></button>
                </header>
                <section className="modal-card-body">
                    {body ?? children}
                </section>
                <footer className="modal-card-foot">
                    {footer ?? (
                        <button className="button" onClick={onClose}>
                            Close
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};
