
interface ModalPatchUserProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    title?: string;
    label1?: string;
    label2?: string;
    label3?: string;
    type1?: string;
    type2?: string;
    type3?: string;
    isFormValid: string;
    informationMessage: string;
}

const ModalPatchUser: React.FC<ModalPatchUserProps> = ({ isOpen, onClose, onSubmit, handleChange, errorMessage, informationMessage, isFormValid, title, label1, label2, label3, type1, type2, type3 }) => {
    return (
        <>
            {isOpen && (
                <div className="patchUserModal" onClick={onClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={onClose}>&times;</span>
                        <h2>{title}</h2>
                        <form onSubmit={onSubmit} className="patchUserForm">
                            {label1 && (
                                <>
                                    <label htmlFor={label1}>{label1}</label>
                                    <input type={type1} name={label1} placeholder={label1} onChange={handleChange} />
                                </>
                            )}
                            {label2 && (
                                <>
                                    <label htmlFor={label2}>{label2}</label>
                                    <input type={type2} name={label2} placeholder={label2} onChange={handleChange} />
                                </>
                            )}
                            {label3 && (
                                <>
                                    <label htmlFor={label3}>{label3}</label>
                                    <input type={type3} name={label3} placeholder={label3} onChange={handleChange} />
                                </>
                            )}
                            {errorMessage && <p className="error">{errorMessage}</p>}
                            {informationMessage && <p className="informationMessage">{informationMessage}</p>}
                            <div className="buttonContainerForm">
                                <button type="submit" disabled={!isFormValid} className={isFormValid ? "formOk" : "formNotOk"} title={isFormValid ? "Envoyer" : "Remplissez tous les champs !"}>Modifier</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default ModalPatchUser;
