import React, { PropsWithChildren } from 'react';

interface ModalProps {
    title: React.ReactNode;
    open?: boolean;
    onClose?: () => void;
}

export const Modal = ({
    title,
    open,
    children,
    onClose,
}: PropsWithChildren<ModalProps>) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };
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
                <section className="modal-card-body">{children}</section>
                <footer className="modal-card-foot">
                    <button className="button is-success">Save changes</button>
                    <button className="button">Cancel</button>
                </footer>
            </div>
        </div>
    );
};
