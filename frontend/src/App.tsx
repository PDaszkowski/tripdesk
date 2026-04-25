import { useState } from 'react';
import axios from 'axios';

// --- KOMPONENT REJESTRACJI ---
function RegisterForm() {
    const [formData, setFormData] = useState({
        email: '', password: '', firstName: '', lastName: '', phoneNumber: '', role: 'CLIENT',
        agencyName: '', agencyNip: '', passportNumber: '', passportExpiry: ''
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/register', formData);
            alert('Sukces: ' + res.data);
        } catch (err) {
            alert('Błąd rejestracji');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #eee' }}>
            <h2>Rejestracja</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} /><br />
                <input name="password" type="password" placeholder="Hasło" onChange={handleChange} /><br />
                <input name="firstName" placeholder="Imię" onChange={handleChange} /><br />
                <input name="lastName" placeholder="Nazwisko" onChange={handleChange} /><br />
                <input name="phoneNumber" placeholder="Telefon" onChange={handleChange} /><br />

                <select name="role" onChange={handleChange}>
                    <option value="CLIENT">Klient</option>
                    <option value="AGENT">Agent</option>
                    <option value="ADMIN">Admin</option>
                </select><br />

                {formData.role === 'ADMIN' && (
                    <>
                        <input name="agencyName" placeholder="Nazwa agencji" onChange={handleChange} /><br />
                        <input name="agencyNip" placeholder="NIP agencji" onChange={handleChange} /><br />
                    </>
                )}

                {formData.role === 'CLIENT' && (
                    <>
                        <input name="passportNumber" placeholder="Paszport" onChange={handleChange} /><br />
                        <input name="passportExpiry" type="date" onChange={handleChange} /><br />
                    </>
                )}
                <button type="submit">Zarejestruj</button>
            </form>
        </div>
    );
}

// --- KOMPONENT LOGOWANIA ---
function LoginForm() {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginChange = (e: any) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/login', loginData);
            alert('Zalogowano! Witaj ' + res.data.firstName);
            setIsLoggedIn(true);
        } catch (err) {
            alert('Błąd logowania: Nieprawidłowe dane');
        }
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Logowanie</h2>
            {isLoggedIn ? <p style={{color: 'green'}}>Status: Zalogowany pomyślnie!</p> : (
                <form onSubmit={handleLoginSubmit}>
                    <input name="email" placeholder="Email" onChange={handleLoginChange} /><br />
                    <input name="password" type="password" placeholder="Hasło" onChange={handleLoginChange} /><br />
                    <button type="submit">Zaloguj</button>
                </form>
            )}
        </div>
    );
}

// --- GŁÓWNY KOMPONENT APP ---
function App() {
    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1>TripDesk System</h1>
            <RegisterForm />
            <LoginForm />
        </div>
    );
}

export default App;