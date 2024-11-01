import React from 'react';
// import './Modal.css';

function Modal({ show, handleClose, handleSave, title, children }) {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                <form onSubmit={handleSave} className="modal-form">
                    {children}
                    <div className="modal-buttons">
                        <button type="button" className="cancel-button" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="submit-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;