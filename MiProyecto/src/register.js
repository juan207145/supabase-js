// src/register.js
import { supabase } from './supabase.js';
import { mostrarLogin } from './login.js';

export function mostrarRegistro() {
    const app = document.getElementById('root'); // Usamos el mismo contenedor
    app.innerHTML = `
    <section>
        <h2>Registro de Estudiante</h2>
        <form id="registro-form">
            <input type="text" name="nombre" placeholder="Nombre" required />
            <input type="email" name="correo" placeholder="Correo" required />
            <input type="password" name="password" placeholder="Contraseña" required />
            <input type="text" name="telefono" placeholder="Teléfono" required />
            <button type="submit">Registrarse</button>
        </form>
        <p id="error" style="color:red;"></p>
        <button id="ir-login">Volver al login</button>
    </section>
    `;

    const form = document.getElementById('registro-form');
    const errorMsg = document.getElementById('error');
    const irLogin = document.getElementById('ir-login');

    // Volver al login
    irLogin.addEventListener('click', () => {
        mostrarLogin();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';

        const nombre = form.nombre.value.trim();
        const correo = form.correo.value.trim();
        const password = form.password.value.trim();
        const telefono = form.telefono.value.trim();

        if (!nombre || !correo || !password || !telefono) {
            errorMsg.textContent = 'Por favor completa todos los campos.';
            return;
        }

        // Crear usuario en auth
        const { data: dataAuth, error: errorAuth } = await supabase.auth.signUp({
            email: correo,
            password: password,
        });

        if (errorAuth) {
            errorMsg.textContent = `Error en autenticación: ${errorAuth.message}`;
            return;
        }

        const uid = dataAuth.user?.id;
        if (!uid) {
            errorMsg.textContent = 'No se pudo obtener el ID del usuario.';
            return;
        }

        // Insertar en estudiantes
        const { error: errorInsert } = await supabase
            .from('estudiantes')
            .insert([{ id: uid, nombre, correo, telefono }]);

        if (errorInsert) {
            errorMsg.textContent = 'Error guardando datos del estudiante: ' + errorInsert.message;
            return;
        }

        alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
        mostrarLogin(); // Volver al login automáticamente
    });
}
