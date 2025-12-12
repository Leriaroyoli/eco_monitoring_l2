const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. Підключаємо пакет cors
const airQualityRoutes = require('./routes/airQuality');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lab_user:cGnuzefaxLBFAKk1@cluster0.xd2ujuf.mongodb.net/ecological-monitoring?retryWrites=true&w=majority&appName=Cluster0';

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Підключено до MongoDB Atlas');
        console.log(`База даних: ${mongoose.connection.name}`);

        app.listen(PORT, () => {
            console.log(`Сервер запущено на порту ${PORT}`);
            console.log(`API доступне за адресою: http://localhost:${PORT}/api/air-quality`);
            console.log(`Базовий маршрут: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Помилка підключення до MongoDB:', error.message);
        process.exit(1);
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB відключено');
});

mongoose.connection.on('error', (err) => {
    console.error('Помилка MongoDB:', err);
});

startServer();

app.use('/api/air-quality', airQualityRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'API для системи екологічного моніторингу',
        endpoints: {
            'GET /api/air-quality': 'Отримати всі записи про якість повітря',
            'GET /api/air-quality/:id': 'Отримати конкретне вимірювання за ID',
            'POST /api/air-quality': 'Створити новий запис вимірювання',
            'PUT /api/air-quality/:id': 'Повністю оновити існуюче вимірювання',
            'DELETE /api/air-quality/:id': 'Видалити запис вимірювання'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Щось пішло не так!',
        message: err.message
    });
});

