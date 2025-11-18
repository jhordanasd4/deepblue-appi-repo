const express = require('express');
const cors = require('cors');
// Importamos los datos de usuarios (la lista)
const allData = require('./data.json'); 
const usuarios = allData.usuarios; // Asegúrate de que tu data.json tenga una propiedad 'usuarios'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: Permite la comunicación entre el Frontend y el Backend
app.use(cors());
// Middleware: Permite que el servidor entienda datos JSON del cuerpo de la solicitud (req.body)
app.use(express.json()); 

// RUTA 1: LOGIN (POST) - Autentica al usuario
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Busca si existe un usuario con esas credenciales
    const user = usuarios.find(u => u.username === username && u.password === password);

    if (user) {
        return res.json({
            success: true,
            message: "Login exitoso",
            user_id: user.user_id // Devuelve el ID para que el Frontend pida los datos
        });
    }

    res.status(401).json({ success: false, message: "Credenciales inválidas." });
});

// RUTA 2: OBTENER DATOS DEL ARRECIFE (GET) - Obtiene la información específica del usuario logueado
app.get('/api/arrecife/:userId', (req, res) => {
    const { userId } = req.params;

    // Busca el usuario por ID
    const user = usuarios.find(u => u.user_id === userId);

    if (user) {
        return res.json({
            success: true,
            data: user // Devuelve el objeto de usuario completo
        });
    }

    res.status(404).json({ success: false, message: "Usuario no encontrado." });
});

// RUTA 3: OBTENER LISTA DE USUARIOS (ADMIN) - Para uso administrativo
app.get('/api/admin/users', (req, res) => {
    // Proyectamos solo la información relevante para el informe (nombre, correo, etc.)
    const userList = allData.usuarios.map(user => ({
        id: user.user_id,
        nombre: user.username,
        email: user.email,
        nivel: user.nivel,
        ultimo_acceso: '2025-11-17' // Simulación de registro de acceso
    }));

    res.json({
        success: true,
        total: userList.length,
        data: userList
    });
});

// INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Backend DeepBlue Connect corriendo en http://localhost:${PORT}`);
});