const mongoose = require('mongoose');

const airQualitySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  pm25: {
    type: Number,
    required: true,
    min: 0,
    description: 'Концентрація PM2.5 (мкг/м³)'
  },
  pm10: {
    type: Number,
    required: true,
    min: 0,
    description: 'Концентрація PM10 (мкг/м³)'
  },
  no2: {
    type: Number,
    required: false,
    min: 0,
    description: 'Концентрація NO2 (мкг/м³)'
  },
  o3: {
    type: Number,
    required: false,
    min: 0,
    description: 'Концентрація O3 (мкг/м³)'
  },
  co: {
    type: Number,
    required: false,
    min: 0,
    description: 'Концентрація CO (мг/м³)'
  },
  temperature: {
    type: Number,
    required: false,
    description: 'Температура повітря (°C)'
  },
  humidity: {
    type: Number,
    required: false,
    min: 0,
    max: 100,
    description: 'Вологість повітря (%)'
  },
  airQualityIndex: {
    type: Number,
    required: false,
    min: 0,
    max: 500,
    description: 'Індекс якості повітря (AQI)'
  }
}, {
  timestamps: true
});

// Індекси для швидкого пошуку
airQualitySchema.index({ location: 1, date: -1 });
airQualitySchema.index({ date: -1 });

const AirQuality = mongoose.model('AirQuality', airQualitySchema);

module.exports = AirQuality;

