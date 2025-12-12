const express = require('express');
const router = express.Router();
const AirQuality = require('../models/AirQuality');

// GET /api/air-quality - отримати всі записи про якість повітря
router.get('/', async (req, res) => {
  try {
    const { location, limit, skip } = req.query;
    const query = {};
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    const limitNum = limit ? parseInt(limit) : 100;
    const skipNum = skip ? parseInt(skip) : 0;
    
    const records = await AirQuality.find(query)
      .sort({ date: -1 })
      .limit(limitNum)
      .skip(skipNum);
    
    const total = await AirQuality.countDocuments(query);
    
    res.json({
      success: true,
      count: records.length,
      total,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/air-quality/:id - отримати конкретне вимірювання за ID
router.get('/:id', async (req, res) => {
  try {
    const record = await AirQuality.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Запис не знайдено'
      });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Невірний формат ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/air-quality - створити новий запис вимірювання
router.post('/', async (req, res) => {
  try {
    const record = new AirQuality(req.body);
    const savedRecord = await record.save();
    
    res.status(201).json({
      success: true,
      message: 'Запис успішно створено',
      data: savedRecord
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Помилка валідації',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/air-quality/:id - повністю оновити існуюче вимірювання
router.put('/:id', async (req, res) => {
  try {
    const record = await AirQuality.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Запис не знайдено'
      });
    }
    
    res.json({
      success: true,
      message: 'Запис успішно оновлено',
      data: record
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Невірний формат ID'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Помилка валідації',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/air-quality/:id - видалити запис вимірювання
router.delete('/:id', async (req, res) => {
  try {
    const record = await AirQuality.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Запис не знайдено'
      });
    }
    
    res.json({
      success: true,
      message: 'Запис успішно видалено',
      data: record
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Невірний формат ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

