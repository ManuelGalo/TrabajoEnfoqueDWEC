// Clase Cita para POO
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

// Gestión de cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (encodeURIComponent(JSON.stringify(value)) || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            const value = c.substring(nameEQ.length, c.length);
            return JSON.parse(decodeURIComponent(value) || '[]');
        }
    }
    return [];
}

function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// variables y elementos DOM 
let appointments = getCookie('appointments');
const form = document.getElementById('appointmentForm');
const tableBody = document.getElementById('appointmentsTableBody');
const emptyRow = document.getElementById('emptyRow');
const errorMessages = document.getElementById('errorMessages');

// validaciones 
function displayError(inputElement, message, errorList) {
    errorList.push(message);
    inputElement.classList.add('error-input');
}

function clearErrors() {
    errorMessages.innerHTML = '';
    errorMessages.style.display = 'none';
    document.querySelectorAll('.error-input').forEach(el => {
        el.classList.remove('error-input');
    });
}

function validateForm(data) {
    let errors = [];
    clearErrors();

    const telefonoInput = document.getElementById('telefono');
    const dniInput = document.getElementById('dni');

    // teléfono
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(data.telefono)) {
        displayError(telefonoInput, "El teléfono debe tener 9 dígitos.", errors);
    }

    // DNI
    const dniRegexFormat = /^[0-9]{8}[a-zA-Z]$/;
    if (!dniRegexFormat.test(data.dni)) {
        displayError(dniInput, "El DNI debe tener 8 dígitos seguidos de una letra.", errors);
    }

    if (errors.length > 0) {
        errorMessages.innerHTML = errors.join('<br>');
        errorMessages.style.display = 'block';
        return false;
    }
    return true;
}

// Manipulacion del DOM y CRUD 
function addAppointmentToTable(appointment, index) {
    const row = tableBody.insertRow();
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${appointment.nombre}</td>
        <td>${appointment.apellidos}</td>
        <td>${appointment.dni}</td>
        <td>${appointment.telefono}</td>
        <td>${appointment.fechaCita}</td>
        <td>${appointment.horaCita}</td>
        <td>${appointment.observaciones || '-'}</td>
        <td>
            <button class="btn-edit" onclick="editAppointment(${appointment.id})">Editar</button>
            <button class="btn-delete" onclick="deleteAppointment(${appointment.id})">Eliminar</button>
        </td>
    `;
}

function renderTable() {
    tableBody.innerHTML = '';

    if (appointments.length === 0) {
        const row = tableBody.insertRow();
        row.id = 'emptyRow';
        row.innerHTML = '<td colspan="9">No hay citas registradas</td>';
    } else {
        appointments.forEach((appointment, index) => {
            addAppointmentToTable(appointment, index);
        });
    }
}

function saveAppointments() {
    setCookie('appointments', appointments, 365);
}

// CRUD 
function addAppointment(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
        nombre: formData.get('nombre'),
        apellidos: formData.get('apellidos'),
        dni: formData.get('dni'),
        telefono: formData.get('telefono'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        fechaCita: formData.get('fechaCita'),
        horaCita: formData.get('horaCita'),
        observaciones: formData.get('observaciones')
    };

    if (!validateForm(data)) {
        return;
    }

    const id = Date.now();
    const newAppointment = new Cita(
        id,
        data.nombre,
        data.apellidos,
        data.dni,
        data.telefono,
        data.fechaNacimiento,
        data.fechaCita,
        data.horaCita,
        data.observaciones
    );

    appointments.push(newAppointment);
    saveAppointments();
    renderTable();
    form.reset();
    clearErrors();
}

// editar 
function editAppointment(citaId) {
    const appointmentsFromCookie = getCookie('appointments');
    const appointment = appointmentsFromCookie.find(cita => cita.id === citaId);

    if (!appointment) {
        alert('Error: No se encontró la cita en el almacenamiento.');
        return;
    }

    // Cargar datos en el formulario
    document.getElementById('nombre').value = appointment.nombre;
    document.getElementById('apellidos').value = appointment.apellidos;
    document.getElementById('dni').value = appointment.dni;
    document.getElementById('telefono').value = appointment.telefono;
    document.getElementById('fechaNacimiento').value = appointment.fechaNacimiento;
    document.getElementById('fechaCita').value = appointment.fechaCita;
    document.getElementById('horaCita').value = appointment.horaCita;
    document.getElementById('observaciones').value = appointment.observaciones || '';

    // Eliminar la cita del array SIN pedir confirmación (es parte del proceso de edición)
    const index = appointments.findIndex(cita => cita.id === citaId);
    if (index !== -1) {
        appointments.splice(index, 1);
        saveAppointments();
        renderTable();
    }
}

function deleteAppointment(citaId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
        // Buscar índice de la cita por ID
        const index = appointments.findIndex(cita => cita.id === citaId);
        if (index !== -1) {
            appointments.splice(index, 1);
            saveAppointments();
            renderTable();
        }
    }
}

form.addEventListener('submit', addAppointment);
renderTable();

console.log('Script cargado correctamente - DavanteDent');