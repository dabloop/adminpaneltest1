import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function Modal({ show, handleClose, handleSave, title, children, type, handleRemoveIssue, handleRemoveVehicle, errors, errRef }) {
    
    useEffect(() => {
        const preventScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        if (show) {
            // Add scroll prevention to `wheel`, `touchmove`, and `keydown` events
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            window.addEventListener('keydown', (e) => {
                // Prevent arrow keys and spacebar from scrolling
                if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
                    preventScroll(e);
                }
            });
        } else {
            // Clean up the scroll prevention
            window.removeEventListener('wheel', preventScroll, { passive: false });
            window.removeEventListener('touchmove', preventScroll, { passive: false });
            window.removeEventListener('keydown', preventScroll);
        }

        // Clean up on unmount
        return () => {
            window.removeEventListener('wheel', preventScroll, { passive: false });
            window.removeEventListener('touchmove', preventScroll, { passive: false });
            window.removeEventListener('keydown', preventScroll);
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                <form onSubmit={handleSave} className="modal-form">
                    {errors && (
                        <div ref={errRef} className="error-messages">
                            {Object.values(errors).map((error, index) => (
                                <p key={index} className="error-text">{error}</p>
                            ))}
                        </div>
                    )}
                    {children}
                    <div className="modal-buttons">
                        { 
                            type.startsWith('manageVehicle') 
                            ? (
                                <button type="button" onClick={handleRemoveVehicle} className="inside-button">Delete {type.split('-')[2]}</button>
                              )
                            : type.startsWith('ManageIssue') 
                            ? (
                                <button type="button" className="inside-button" onClick={handleRemoveIssue}>Delete {type.split('-')[1]}</button>
                              ) 
                            : (
                                <button type="button" className="cancel-button" onClick={handleClose}>Cancel</button>
                              )
                        }
                        <button type="submit" className="submit-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default Modal;
