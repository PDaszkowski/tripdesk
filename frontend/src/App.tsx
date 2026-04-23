import { useState } from 'react';
import axios from 'axios';

function App() {
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
        <div>
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

export default App;