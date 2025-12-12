import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/air-quality';

const AirQualityTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        location: '',
        pm25: '',
        pm10: '',
        temperature: '',
        humidity: ''
    });

    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.data) {
                setData(response.data.data);
            } else {
                setData(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.location || !formData.pm25 || !formData.pm10) {
            alert('Будь ласка, заповніть обов\'язкові поля (Локація, PM2.5, PM10)');
            return;
        }

        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, formData);
                alert('Запис успішно оновлено!');
            } else {
                await axios.post(API_URL, formData);
                alert('Запис успішно створено!');
            }

            setFormData({ location: '', pm25: '', pm10: '', temperature: '', humidity: '' });
            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error('Помилка при збереженні:', err);
            alert('Помилка при збереженні даних');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей запис?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setData(data.filter(item => item._id !== id));
            } catch (err) {
                console.error('Помилка при видаленні:', err);
                alert('Не вдалося видалити запис');
            }
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            location: item.location,
            pm25: item.pm25,
            pm10: item.pm10,
            temperature: item.temperature || '',
            humidity: item.humidity || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ location: '', pm25: '', pm10: '', temperature: '', humidity: '' });
    };

    if (loading) return <div>Завантаження даних...</div>;
    if (error) return <div style={{ color: 'red' }}>Помилка: {error}</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Система моніторингу якості повітря</h2>

            {/* ФОРМА */}
            <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <h3>{editingId ? 'Редагування запису' : 'Додати новий запис'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        name="location"
                        placeholder="Локація *"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px' }}
                    />
                    <input
                        type="number"
                        name="pm25"
                        placeholder="PM2.5 *"
                        value={formData.pm25}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', width: '80px' }}
                    />
                    <input
                        type="number"
                        name="pm10"
                        placeholder="PM10 *"
                        value={formData.pm10}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '8px', width: '80px' }}
                    />
                    <input
                        type="number"
                        name="temperature"
                        placeholder="Темп. °C"
                        value={formData.temperature}
                        onChange={handleInputChange}
                        style={{ padding: '8px', width: '80px' }}
                    />
                    <input
                        type="number"
                        name="humidity"
                        placeholder="Волог. %"
                        value={formData.humidity}
                        onChange={handleInputChange}
                        style={{ padding: '8px', width: '80px' }}
                    />

                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                        {editingId ? 'Зберегти зміни' : 'Додати'}
                    </button>

                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
                            Скасувати
                        </button>
                    )}
                </form>
            </div>

            {/* ТАБЛИЦЯ */}
            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                    <th>Локація</th>
                    <th>Час</th>
                    <th>PM2.5</th>
                    <th>PM10</th>
                    <th>Темп.</th>
                    <th>Волог.</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item._id}>
                        <td>{item.location}</td>
                        <td>{new Date(item.date).toLocaleString()}</td>
                        <td>{item.pm25}</td>
                        <td>{item.pm10}</td>
                        <td>{item.temperature ? item.temperature + ' °C' : '-'}</td>
                        <td>{item.humidity ? item.humidity + ' %' : '-'}</td>
                        <td>
                            <button
                                onClick={() => handleEdit(item)}
                                style={{ marginRight: '5px', cursor: 'pointer', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px' }}
                            >
                                Ред.
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                style={{ cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px' }}
                            >
                                Вид.
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AirQualityTable;