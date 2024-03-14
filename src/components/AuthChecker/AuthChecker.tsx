import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthChecker({ children }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const isLoggedIn = !!user && !!user.roles && user.roles.includes("ROLE_USER");
        setIsLoggedIn(isLoggedIn);
        
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        if (!isLoggedIn) {
            navigate("/login"); // Assurez-vous de remplacer "/login" par votre chemin de connexion réel
        }
    }, [navigate]);

    if (!isLoggedIn) {
        // Si l'utilisateur n'est pas connecté, ne pas afficher les enfants
        return null;
    }

    // Si l'utilisateur est connecté, afficher les enfants
    return (
        <>
            {children}
        </>
    );
}
