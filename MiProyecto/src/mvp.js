// src/mvp.js
import { supabase } from './supabase.js';

export function mostrarMVP() {
    const app = document.getElementById('root'); // Contenedor correcto
    app.innerHTML = `
    <section>
        <h2>Subir Actividad (MVP)</h2>
        <form id="actividad-form">
            <input type="text" name="titulo" placeholder="Título" required />
            <textarea name="descripcion" placeholder="Descripción"></textarea>
            <select name="tipo">
                <option value="tarea">Tarea</option>
                <option value="examen">Examen</option>
                <option value="proyecto">Proyecto</option>
                <option value="participacion">Participación</option>
                <option value="otro">Otro</option>
            </select>
            <select name="curso" required id="select-curso">
                <option value="">Cargando cursos...</option>
            </select>
            <input type="text" name="imagen" placeholder="URL de imagen (opcional)" />
            <button type="submit">Subir Actividad</button>
        </form>
        <p id="mensaje" style="text-align:center;"></p>
        <h3>Mis Actividades</h3>
        <div id="lista-actividades"></div>
    </section>
    `;

    const form = document.getElementById('actividad-form');
    const mensaje = document.getElementById('mensaje');
    const lista = document.getElementById('lista-actividades');
    const selectCurso = document.getElementById('select-curso');

    const ESTUDIANTE_ID = "4e4d611a-522d-44e5-be6b-4006f96a1ccd"; // ID fijo para pruebas

    // 🔹 Cargar cursos
    async function cargarCursos() {
        const { data, error } = await supabase
            .from('cursos')
            .select('id, nombre')
            .order('nombre', { ascending: true });

        if (error) {
            selectCurso.innerHTML = `<option>Error al cargar cursos</option>`;
            return;
        }

        selectCurso.innerHTML = `<option value="">Selecciona un curso</option>`;
        data.forEach(curso => {
            const opt = document.createElement('option');
            opt.value = curso.id;
            opt.textContent = curso.nombre;
            selectCurso.appendChild(opt);
        });
    }

    // 🔹 Cargar actividades del estudiante fijo
    async function cargarActividades() {
        lista.innerHTML = 'Cargando actividades...';

        const { data, error } = await supabase
            .from('actividades')
            .select('id, titulo, descripcion, tipo, imagen')
            .eq('estudiante_id', ESTUDIANTE_ID)
            .order('id', { ascending: false });

        if (error) {
            lista.innerHTML = 'Error al cargar actividades.';
            return;
        }

        if (!data || data.length === 0) {
            lista.innerHTML = '<p>No has subido actividades aún.</p>';
            return;
        }

        lista.innerHTML = '';
        data.forEach(act => {
            const div = document.createElement('div');
            div.innerHTML = `
                <hr>
                <h4>${act.titulo}</h4>
                <p>${act.descripcion || ''}</p>
                <p><b>Tipo:</b> ${act.tipo.toUpperCase()}</p>
                ${act.imagen ? `<img src="${act.imagen}" alt="${act.titulo}" width="200">` : ''}
            `;
            lista.appendChild(div);
        });
    }

    // 🔹 Subir nueva actividad usando el ID fijo
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensaje.textContent = '';

        const titulo = form.titulo.value.trim();
        const descripcion = form.descripcion.value.trim();
        const tipo = form.tipo.value;
        const curso_id = form.curso.value;
        const imagen = form.imagen.value.trim();

        if (!titulo || !tipo || !curso_id) {
            mensaje.textContent = '⚠️ Completa los campos obligatorios.';
            return;
        }

        const { error } = await supabase.from('actividades').insert([
            {
                titulo,
                descripcion,
                tipo,
                imagen,
                curso_id,
                estudiante_id: ESTUDIANTE_ID, // usamos ID fijo
            },
        ]);

        if (error) {
            mensaje.textContent = '❌ Error al subir actividad: ' + error.message;
        } else {
            mensaje.textContent = '✅ Actividad subida correctamente';
            form.reset();
            cargarActividades();
        }
    });

    // Inicialización
    cargarCursos();
    cargarActividades();
}
