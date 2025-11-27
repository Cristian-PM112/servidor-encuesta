const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. Importamos Mongoose
const app = express();
const PORT = 3001;

// --- CONFIGURACIÓN ---
app.use(cors());
app.use(express.json());

// --- 2. CONEXIÓN A LA BASE DE DATOS (MongoDB) ---
// NOTA: Reemplaza 'TU_URL_DE_MONGO' con tu link real de MongoDB Atlas
// Si no tienes uno, te explico abajo cómo obtenerlo gratis.
const MONGO_URI = 'mongodb+srv://admin:admin123@cluster0.fmwtyrr.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB exitosamente'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// --- 3. DEFINICIÓN DEL MODELO (¿Qué vamos a guardar?) ---
const EncuestaSchema = new mongoose.Schema({
  // Parte 1
  conoceUniversidad: String, // p1
  opinion: String,           // p2
  queTeGusto: String,        // p3
  carreraPensada: String,    // p4

  // Parte 2
  carreraInteres: String,    // carrera seleccionada

  // Parte 3 (Datos Personales)
  apellidoPaterno: String,
  apellidoMaterno: String,
  nombre: String,
  edad: String,
  fechaNacimiento: String,
  sexo: String,
  estadoNacimiento: String,
  email: String,
  celular: String,

  // Parte 4 (Datos Académicos)
  ocupacion: String,
  escuelaProcedencia: String,
  turno: String,
  fechaEncuesta: String,

  // Extra
  fechaRegistro: { type: Date, default: Date.now }
});

const Encuesta = mongoose.model('Encuesta', EncuestaSchema);

// --- RUTAS ---

app.get('/', (req, res) => {
  res.send('API Funcionando y Conectada a BD 🐺');
});

// GUARDAR ENCUESTA (POST)
app.post('/api/encuestas', async (req, res) => {
  try {
    const data = req.body;
    console.log('--- RECIBIENDO DATOS ---', data);

    // Mapeamos los datos raros del frontend (p1, p2...) a nombres bonitos
    const nuevaEncuesta = new Encuesta({
      conoceUniversidad: data.p1,
      opinion: data.p2,
      queTeGusto: data.p3,
      carreraPensada: data.p4,
      carreraInteres: data.carrera,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno,
      nombre: data.nombre,
      edad: data.edad,
      fechaNacimiento: data.fechaNac,
      sexo: data.sexo,
      estadoNacimiento: data.estadoNac,
      email: data.email,
      celular: data.celular,
      ocupacion: data.ocupacion,
      escuelaProcedencia: data.escuela,
      turno: data.turno,
      fechaEncuesta: data.fecha
    });

    // ¡GUARDAR EN LA NUBE!
    await nuevaEncuesta.save();
    console.log('✅ Encuesta guardada en la Base de Datos');

    res.status(201).json({ message: 'Guardado exitosamente' });
  } catch (error) {
    console.error('Error al guardar:', error);
    res.status(500).json({ error: 'No se pudo guardar en la base de datos' });
  }
});

// VER TODAS LAS ENCUESTAS (GET) - Útil para exportar luego
app.get('/api/encuestas', async (req, res) => {
  try {
    const encuestas = await Encuesta.find().sort({ fechaRegistro: -1 });
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});