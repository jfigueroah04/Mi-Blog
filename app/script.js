const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    // Ocultar preloader después de 2 segundos
    setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
    }, 2000);

    // Verificar conexión con la API
    verificarConexion();

    // Configurar event listeners para los botones
    document.getElementById('btn-listar').addEventListener('click', listarArticulos);
    document.getElementById('btn-crear').addEventListener('click', () => mostrarDiv('div-crear'));
    document.getElementById('btn-obtener').addEventListener('click', () => mostrarDiv('div-obtener'));
    document.getElementById('btn-actualizar').addEventListener('click', () => mostrarDiv('div-actualizar'));
    document.getElementById('btn-borrar').addEventListener('click', () => mostrarDiv('div-borrar'));
    document.getElementById('btn-rutas').addEventListener('click', () => {
        mostrarDiv('div-rutas');
        mostrarRutas();
    });

    // Configurar event listeners para los formularios
    document.getElementById('btn-obtener-submit').addEventListener('click', obtenerArticulo);
    document.getElementById('btn-actualizar-submit').addEventListener('click', actualizarArticulo);
    document.getElementById('btn-borrar-submit').addEventListener('click', borrarArticulo);
    document.getElementById('form-crear').addEventListener('submit', crearArticulo);

    // Agregar elementos flotantes
    agregarSnoopysFlotantes();

    // Cargar artículos al iniciar
    listarArticulos();
});

// Función para verificar la conexión con la API
async function verificarConexion() {
    try {
        console.log('Intentando conectar a:', API_BASE);
        const response = await fetch(`${API_BASE}/listar`);
        console.log('Respuesta recibida:', response.status);
        if (response.ok) {
            document.getElementById('conexion-status').textContent = '✅ Conectado a la BD';
            document.getElementById('conexion-status').style.color = 'green';
        } else {
            throw new Error('Respuesta no ok: ' + response.status);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        document.getElementById('conexion-status').textContent = '❌ Error de conexión';
        document.getElementById('conexion-status').style.color = 'red';
    }
}

function mostrarDiv(divId) {
    const divs = ['div-crear', 'div-obtener', 'div-actualizar', 'div-borrar', 'div-rutas'];
    divs.forEach(d => {
        document.getElementById(d).style.display = d === divId ? 'block' : 'none';
    });
    
    if (divId !== 'div-rutas') {
        document.getElementById(divId).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Función para volver al inicio
function volverInicio() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Ocultar todos los formularios
    const divs = ['div-crear', 'div-obtener', 'div-actualizar', 'div-borrar', 'div-rutas'];
    divs.forEach(d => {
        document.getElementById(d).style.display = 'none';
    });
}

// Función para desplazarse a una sección
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    alert(mensaje);
}

// Función para listar artículos
async function listarArticulos() {
    try {
        const response = await fetch(`${API_BASE}/listar`);
        const data = await response.json();
        
        if (data.status === 'success') {
            mostrarArticulos(data.consulta);
            mostrarNotificacion('Artículos cargados correctamente');
        } else {
            mostrarNotificacion('Error al cargar artículos', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión con el servidor', 'error');
    }
}

// Función para mostrar artículos en la tabla y en el grid
function mostrarArticulos(articulos) {
    const tbody = document.getElementById('tbody-articulos');
    tbody.innerHTML = '';
    
    const grid = document.getElementById('articulos-grid');
    grid.innerHTML = '';
    
    articulos.forEach(articulo => {
        // Fila en tabla
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${articulo._id}</td>
            <td>${articulo.titulo}</td>
            <td>${articulo.contenido.substring(0, 100)}${articulo.contenido.length > 100 ? '...' : ''}</td>
            <td>${new Date(articulo.fecha).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);

        // Card en grid
        const card = document.createElement('div');
        card.className = 'articulo-card';
        card.innerHTML = `
            <div class="articulo-header">
                <img src="/snoopy.gif" alt="Snoopy" class="articulo-icon">
                <h3>${articulo.titulo}</h3>
            </div>
            <div class="articulo-description">
                ${articulo.contenido.substring(0, 150)}${articulo.contenido.length > 150 ? '...' : ''}
            </div>
            <div class="articulo-footer">
                <div class="articulo-fecha">${new Date(articulo.fecha).toLocaleDateString()}</div>
                <div class="articulo-actions">
                    <button class="btn-action" onclick="editarArticuloFromCard('${articulo._id}', '${articulo.titulo.replace(/'/g, "\\'")}', '${articulo.contenido.replace(/'/g, "\\'")}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action" onclick="borrarArticuloFromCard('${articulo._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Función para editar artículo desde la card
function editarArticuloFromCard(id, titulo, contenido) {
    document.getElementById('id-actualizar').value = id;
    document.getElementById('titulo-actualizar').value = titulo;
    document.getElementById('contenido-actualizar').value = contenido;
    mostrarDiv('div-actualizar');
}

// Función para borrar artículo desde la card
function borrarArticuloFromCard(id) {
    document.getElementById('id-borrar').value = id;
    mostrarDiv('div-borrar');
}

// Función para crear un artículo
async function crearArticulo(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const contenido = document.getElementById('contenido').value;

    if (!titulo || !contenido) {
        mostrarNotificacion('Por favor, completa todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/crear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, contenido })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            mostrarNotificacion('Artículo creado correctamente');
            document.getElementById('form-crear').reset();
            document.getElementById('div-crear').style.display = 'none';
            listarArticulos();
        } else {
            mostrarNotificacion('Error al crear artículo', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

// Función para obtener un artículo específico
async function obtenerArticulo() {
    const id = document.getElementById('id-obtener').value;
    
    if (!id) {
        mostrarNotificacion('Por favor, ingresa un ID', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/articulo/${id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            document.getElementById('resultado-obtener').innerHTML = `
                <h4>${data.articulo.titulo}</h4>
                <p>${data.articulo.contenido}</p>
                <div class="articulo-fecha">Fecha: ${new Date(data.articulo.fecha).toLocaleDateString()}</div>
            `;
            mostrarNotificacion('Artículo obtenido correctamente');
        } else {
            mostrarNotificacion('Artículo no encontrado', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

// Función para actualizar un artículo
async function actualizarArticulo() {
    const id = document.getElementById('id-actualizar').value;
    const titulo = document.getElementById('titulo-actualizar').value;
    const contenido = document.getElementById('contenido-actualizar').value;
    
    if (!id || !titulo || !contenido) {
        mostrarNotificacion('Por favor, completa todos los campos', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/actualizar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, contenido })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            mostrarNotificacion('Artículo actualizado correctamente');
            document.getElementById('div-actualizar').style.display = 'none';
            listarArticulos();
        } else {
            mostrarNotificacion('Error al actualizar artículo', 'error');
        }
    } catch (error) {
        mostrarNotificacion('Error de conexión', 'error');
    }
}

// Función para borrar un artículo
async function borrarArticulo() {
    const id = document.getElementById('id-borrar').value;
    
    if (!id) {
        mostrarNotificacion('Por favor, ingresa un ID válido', 'error');
        return;
    }

    try {
        // Primero verificamos si el artículo existe
        const checkResponse = await fetch(`${API_BASE}/articulo/${id}`);
        const checkData = await checkResponse.json();
        
        if (checkData.status === 'error') {
            mostrarNotificacion('No se encontró el artículo', 'error');
            return;
        }

        // Pedimos confirmación al usuario
        if (!confirm('¿Estás seguro de que quieres borrar este artículo?\nTítulo: ' + checkData.articulo.titulo + '\nEsta acción no se puede deshacer.')) {
            return;
        }

        // Procedemos a borrar
        const response = await fetch(`${API_BASE}/borrar/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            mostrarNotificacion('Artículo borrado correctamente');
            document.getElementById('div-borrar').style.display = 'none';
            document.getElementById('id-borrar').value = '';
            await listarArticulos();
        } else {
            mostrarNotificacion(data.mensaje || 'Error al borrar artículo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error de conexión con el servidor', 'error');
    }
}

// Función para mostrar las rutas disponibles
function mostrarRutas() {
    const rutasDiv = document.getElementById('lista-rutas');
    rutasDiv.innerHTML = `
        <ul>
            <li><strong>GET</strong> /api/listar - Listar todos los artículos</li>
            <li><strong>POST</strong> /api/crear - Crear un nuevo artículo</li>
            <li><strong>GET</strong> /api/articulo/:id - Obtener un artículo específico</li>
            <li><strong>PUT</strong> /api/actualizar/:id - Actualizar un artículo</li>
            <li><strong>DELETE</strong> /api/borrar/:id - Borrar un artículo</li>
        </ul>
    `;
}