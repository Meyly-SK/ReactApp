const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; 

app.use(express.json());

app.get('/api/dni', async (req, res) => {
  try {
    const { numero } = req.query;
    const token = 'apis-token-6209.ps7vv2d8fLzbYi8ozkbSDK4lzHw0zj-b'; 
    const response = await axios.get(`https://api.apis.net.pe/v1/dni?numero=${numero}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    res.status(500).json({ error: 'Error al obtener datos de la API' });
  }
});

app.listen(port, () => {
  console.log(`Servidor de proxy escuchando en el puerto ${port}`);
});