// src/main.js
import { supabase } from './supabase.js';
import { mostrarRegistro } from './register.js';
import { mostrarLogin } from './login.js';
import { mostrarMVP } from './mvp.js';
import { mostrarUser } from './user.js';
import { mostrarAdmin } from './admin.js';

// Funciones de navegación disponibles
const routes = {
    'registro': mostrarRegistro,
    'login': mostrarLogin,
    'actividades': mostrarMVP,
    'usuarios': mostrarUser,
    'admin': mostrarAdmin
};

// Cerrar sesión
async function CerrarSesion() {
    await supabase.auth.signOut();
    await cargarMenu();
    mostrarRegistro();
}

// Cargar menú según usuario
export async function cargarMenu() {
    const menu = document.getElementById("menu");
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        menu.innerHTML = `
            <div>
                <button data-action="registro">Registrarse</button>
                <button data-action="login">Iniciar sesión</button>
            </div>
        `;
    } else {
        menu.innerHTML = `
            <div>
                <button data-action="actividades">Actividades</button>
                <button data-action="usuarios">Usuarios</button>
                <button data-action="logout">Cerrar sesión</button>
                ${user.email === 'manirojas207' ? '<button data-action="admin">Admin</button>' : ''}
            </div>
        `;
    }

    // Asignar listeners
    menu.querySelectorAll('button').forEach(button => {
        const action = button.getAttribute('data-action');
        if (action === 'logout') {
            button.addEventListener('click', CerrarSesion);
        } else if (routes[action]) {
            button.addEventListener('click', () => routes[action]());
        }
    });
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", cargarMenu);
