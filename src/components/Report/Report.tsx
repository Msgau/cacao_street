import { useState } from 'react';
import "./Report.css";

export default function Report({ onSend, setReportWindow }) {
    const [reportText, setReportText] = useState('');

    const handleSend = () => {
        const userToken = localStorage.getItem('token');
        // Vérifiez que le token existe avant de l'envoyer
        if (userToken) {
            onSend(reportText, userToken);
            // Réinitialisez le champ de texte après l'envoi
            setReportText('');
        } else {
            console.error('User token not found in local storage');
        }
    };

    const handleChange = (event) => {
        setReportText(event.target.value);
    };

    return (
        <div className="reportWindow">
            <label htmlFor="report">Signaler un problème</label>
            <textarea
                className="inputReport"
                value={reportText}
                onChange={handleChange}
                maxLength={500}
            ></textarea>
            <div className='sendReportButtons'>
                <button onClick={handleSend}>Envoyer</button>
                <button onClick={() => setReportWindow(false)}>Retour</button>
            </div>

        </div>
    );
}
