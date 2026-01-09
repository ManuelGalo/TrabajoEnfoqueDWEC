// Clase Cita
class Cita {
    constructor(id, nombre, apellidos, dni, telefono, fechaNacimiento, fechaCita, horaCita, observaciones) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.dni = dni;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.fechaCita = fechaCita;
        this.horaCita = horaCita;
        this.observaciones = observaciones;
    }
}

// Variables 
let citas = obtenerCitas();
const formulario = document.getElementById('appointmentForm');
const tablaCuerpo = document.getElementById('appointmentsTableBody');
const mensajesError = document.getElementById('errorMessages');

// localStorage
function guardarCitas(citas) {
    localStorage.setItem('citas', JSON.stringify(citas));
}

function obtenerCitas() {
    const guardado = localStorage.getItem('citas');
    if (!guardado) {
        return [];
    }
    
    const listaCitas = JSON.parse(guardado);
    const resultado = [];
    
    for (let i = 0; i < listaCitas.length; i++) {
        const c = listaCitas[i];
        const citaNueva = new Cita(
            c.id,
            c.nombre,
            c.apellidos,
            c.dni,
            c.telefono,
            c.fechaNacimiento,
            c.fechaCita,
            c.horaCita,
            c.observaciones
        );
        resultado.push(citaNueva);
    }
    
    return resultado;
}

function borrarTodasLasCitas() {
    localStorage.removeItem('citas');
}

// validación
function mostrarError(inputElement, mensaje, listaErrores) {
    listaErrores.push(mensaje);
    inputElement.classList.add('error-input');
}

function limpiarErrores() {
    mensajesError.innerHTML = '';
    mensajesError.style.display = 'none';

    const inputs = document.querySelectorAll('.error-input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('error-input');
    }
}

function validarFormulario(datos) {
    let errores = [];
    limpiarErrores();

    const inputTelefono = document.getElementById('telefono');
    const inputDni = document.getElementById('dni');

    if (!/^[0-9]{9}$/.test(datos.telefono)) {
        mostrarError(inputTelefono, "El teléfono debe tener 9 dígitos", errores);
    }

    if (!/^[0-9]{8}[a-zA-Z]$/.test(datos.dni)) {
        mostrarError(inputDni, "El DNI debe tener 8 números y una letra", errores);
    }

    if (errores.length > 0) {
        mensajesError.innerHTML = errores.join('<br>');
        mensajesError.style.display = 'block';
        return false;
    }

    return true;
}

// Tabla de citas
function agregarCitaATabla(cita, indice) {
    const fila = tablaCuerpo.insertRow();
    fila.innerHTML = `
        <td>${indice + 1}</td>
        <td>${cita.nombre}</td>
        <td>${cita.apellidos}</td>
        <td>${cita.dni}</td>
        <td>${cita.telefono}</td>
        <td>${cita.fechaCita}</td>
        <td>${cita.horaCita}</td>
        <td>${cita.observaciones || '-'}</td>
        <td>
            <button class="btn-edit" onclick="editarCita(${cita.id})">Editar</button>
            <button class="btn-delete" onclick="eliminarCita(${cita.id})">Eliminar</button>
        </td>
    `;
}

function mostrarTabla() {
    tablaCuerpo.innerHTML = '';

    if (citas.length === 0) {
        const fila = tablaCuerpo.insertRow();
        fila.id = 'emptyRow';
        fila.innerHTML = '<td colspan="9">No hay citas registradas</td>';
    } else {
        for (let i = 0; i < citas.length; i++) {
            agregarCitaATabla(citas[i], i);
        }
    }
}

// CRUD
function agregarCita(event) {
    event.preventDefault();

    const formData = new FormData(formulario);
    const datos = {
        nombre: formData.get('nombre'),
        apellidos: formData.get('apellidos'),
        dni: formData.get('dni'),
        telefono: formData.get('telefono'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        fechaCita: formData.get('fechaCita'),
        horaCita: formData.get('horaCita'),
        observaciones: formData.get('observaciones')
    };

    if (!validarFormulario(datos)) {
        return;
    }

    // crear la nueva cita
    const id = Date.now();
    const nuevaCita = new Cita(
        id,
        datos.nombre,
        datos.apellidos,
        datos.dni,
        datos.telefono,
        datos.fechaNacimiento,
        datos.fechaCita,
        datos.horaCita,
        datos.observaciones
    );

    citas.push(nuevaCita);
    guardarCitas(citas);
    mostrarTabla();
    formulario.reset();
    limpiarErrores();
}

function editarCita(citaId) {
    
    let citaAEditar = null;
    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id === citaId) {
            citaAEditar = citas[i];
            break;
        }
    }

    if (!citaAEditar) {
        alert('Error: No se encontró la cita');
        return;
    }

    document.getElementById('nombre').value = citaAEditar.nombre;
    document.getElementById('apellidos').value = citaAEditar.apellidos;
    document.getElementById('dni').value = citaAEditar.dni;
    document.getElementById('telefono').value = citaAEditar.telefono;
    document.getElementById('fechaNacimiento').value = citaAEditar.fechaNacimiento;
    document.getElementById('fechaCita').value = citaAEditar.fechaCita;
    document.getElementById('horaCita').value = citaAEditar.horaCita;
    document.getElementById('observaciones').value = citaAEditar.observaciones || '';

 
    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id === citaId) {
            citas.splice(i, 1);
            break;
        }
    }

    guardarCitas(citas);
    mostrarTabla();
}

function eliminarCita(citaId) {
    if (confirm('¿Seguro que quieres eliminar esta cita?')) {
        
        for (let i = 0; i < citas.length; i++) {
            if (citas[i].id === citaId) {
                citas.splice(i, 1);
                break;
            }
        }

        guardarCitas(citas);
        mostrarTabla();
    }
}

// Inicializar la aplicación
formulario.addEventListener('submit', agregarCita);
mostrarTabla();
//consola
console.log('Sistema de citas iniciado');
console.log('Citas cargadas:', citas.length);