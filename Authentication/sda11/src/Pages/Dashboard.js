import { useEffect } from 'react';
import CommonNavbar from '../components/CommonNavbar';
import { useNavigate } from "react-router-dom";


function Dashboard() {
    const navigate = useNavigate()
    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.hash.substring(1));
        const idTokenParam = queryParameters.get("id_token");
        const accessTokenParam = queryParameters.get("access_token");
        const verified = localStorage.getItem('verified');
        if (idTokenParam && accessTokenParam) {
            localStorage.setItem('token', accessTokenParam);
            localStorage.setItem('idToken', idTokenParam);
        }
        const token = localStorage.getItem('token');
        const idToken = localStorage.getItem('idToken');
        if (token && idToken && verified !== 'true') {
            navigate('/verify')
        }
    }, [])

    return (
        <>
            <CommonNavbar />
            Home
        </>
    )
}

export default Dashboard;