// Validación de campos
function validarCampos() {
    try {
        const nombre = document.getElementById('nombre').value;
        const fecha = document.getElementById('fecha').value;
        const genero = document.querySelector('input[name="genero"]:checked');
        const peso = parseFloat(document.getElementById('peso').value);
        const talla = parseFloat(document.getElementById('talla').value);
        const edad = parseFloat(document.getElementById('edad').value);

        let mensaje = '';

        if (!nombre.trim()) {
            mensaje = 'Por favor, ingrese el nombre del paciente';
        } else if (!fecha) {
            mensaje = 'Por favor, seleccione una fecha';
        } else if (!genero) {
            mensaje = 'Por favor, seleccione un género';
        } else if (isNaN(peso) || peso <= 0 || peso > 300) {
            mensaje = 'Por favor, ingrese un peso válido entre 1 y 300 kg';
        } else if (isNaN(talla) || talla <= 0 || talla > 300) {
            mensaje = 'Por favor, ingrese una talla válida entre 1 y 300 cm';
        } else if (isNaN(edad) || edad <= 0 || edad > 120) {
            mensaje = 'Por favor, ingrese una edad válida entre 1 y 120 años';
        }

        if (mensaje) {
            alert(mensaje);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error en validación:', error);
        return false;
    }
}

// Función para limpiar formulario
function limpiarFormulario() {
    try {
        document.getElementById('nombre').value = '';
        document.getElementById('fecha').value = '';
        document.getElementById('expediente').value = '';
        document.getElementById('peso').value = '';
        document.getElementById('talla').value = '';
        document.getElementById('edad').value = '';
        
        const radioButtons = document.querySelectorAll('input[name="genero"]');
        radioButtons.forEach(button => button.checked = false);
        
        document.getElementById('resultados').classList.add('hidden');
        
        const elementos = ['harris-benedict', 'oms', 'valencia', 'iom', 'rapida', 'mifflin'];
        elementos.forEach(id => {
            document.getElementById(id).textContent = '-';
        });
    } catch (error) {
        console.error('Error al limpiar formulario:', error);
    }
}

// Formatear fecha
function formatearFecha(fecha) {
    try {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-MX', opciones);
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return fecha;
    }
}

// Función principal de cálculo
function calcular() {
    try {
        if (!validarCampos()) {
            return;
        }

        const genero = document.querySelector('input[name="genero"]:checked').value;
        const peso = parseFloat(document.getElementById('peso').value);
        const talla = parseFloat(document.getElementById('talla').value);
        const edad = parseFloat(document.getElementById('edad').value);

        if (!genero || isNaN(peso) || isNaN(talla) || isNaN(edad)) {
            alert('Por favor, verifique que todos los campos estén completos correctamente');
            return;
        }

        const resultados = {
            'harris-benedict': calcularHarrisBenedict(genero, peso, talla, edad),
            'oms': calcularOMS(genero, peso, edad),
            'valencia': calcularValencia(genero, peso, edad),
            'iom': calcularIOM(edad, talla, peso),
            'rapida': calcularEstimacionRapida(peso),
            'mifflin': calcularMifflin(genero, peso, talla, edad)
        };

        // Verificar que todos los resultados sean números válidos
        for (const [key, value] of Object.entries(resultados)) {
            if (isNaN(value) || !isFinite(value)) {
                throw new Error(`Cálculo inválido para ${key}`);
            }
            document.getElementById(key).textContent = value.toFixed(2);
        }

        // Mostrar resultados
        document.getElementById('resultados').classList.remove('hidden');

        // Desplazarse hacia abajo
        window.scrollTo({
            top: document.getElementById('resultados').offsetTop,
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('Error en el cálculo:', error);
        alert('Por favor, verifique que todos los datos ingresados sean correctos.');
    }
}

// Funciones de cálculo específicas
function calcularHarrisBenedict(genero, peso, talla, edad) {
    if (genero === 'masculino') {
        return 66.47 + (13.75 * peso) + (5 * talla) - (6.75 * edad);
    }
    return 655.09 + (9.563 * peso) + (1.84 * talla) - (4.676 * edad);
}

function calcularOMS(genero, peso, edad) {
    if (genero === 'masculino') {
        if (edad >= 18 && edad <= 30) return 15.3 * peso + 679;
        if (edad <= 60) return 11.6 * peso + 879;
        return 13.5 * peso + 487;
    } else {
        if (edad >= 18 && edad <= 30) return 14.7 * peso + 496;
        if (edad <= 60) return 8.7 * peso + 829;
        return 10.5 * peso + 596;
    }
}

function calcularValencia(genero, peso, edad) {
    if (genero === 'masculino') {
        if (edad >= 18 && edad <= 30) return 13.37 * peso + 747;
        if (edad <= 60) return 13.08 * peso + 693;
        return 14.21 * peso + 429;
    } else {
        if (edad >= 18 && edad <= 30) return 11.02 * peso + 679;
        if (edad <= 60) return 10.92 * peso + 677;
        return 10.98 * peso + 520;
    }
}

function calcularIOM(edad, talla, peso) {
    const tallaMt = talla / 100;
    return 247 - (2.637 * edad) + (401.5 * tallaMt) + (8.6 * peso);
}

function calcularEstimacionRapida(peso) {
    return 16.2 * peso;
}

function calcularMifflin(genero, peso, talla, edad) {
    if (genero === 'masculino') {
        return (9.99 * peso) + (6.25 * talla) - (4.92 * edad) + 5;
    }
    return (9.99 * peso) + (6.25 * talla) - (4.92 * edad) - 161;
}

// Función para imprimir resultados
function imprimirResultados() {
    try {
        // Llenar datos del paciente
        const campos = {
            'nombre': 'print-nombre',
            'fecha': 'print-fecha',
            'expediente': 'print-expediente',
            'peso': 'print-peso',
            'talla': 'print-talla',
            'edad': 'print-edad'
        };

        for (const [input, print] of Object.entries(campos)) {
            const valor = document.getElementById(input).value;
            document.getElementById(print).textContent = valor || 'N/A';
        }

        // Formatear fecha
        if (document.getElementById('fecha').value) {
            document.getElementById('print-fecha').textContent = 
                formatearFecha(document.getElementById('fecha').value);
        }

        // Género
        document.getElementById('print-genero').textContent = 
            document.querySelector('input[name="genero"]:checked').value === 'masculino' 
                ? 'Masculino' 
                : 'Femenino';

        // Llenar resultados
        const resultados = {
            'Harris Benedict': 'harris-benedict',
            'OMS': 'oms',
            'Valencia': 'valencia',
            'IOM': 'iom',
            'Estimación Rápida': 'rapida',
            'Mifflin St. Jeor': 'mifflin'
        };

        const resultsGrid = document.querySelector('.print-results-grid');
        resultsGrid.innerHTML = '';
        
        for (const [nombre, id] of Object.entries(resultados)) {
            const valor = document.getElementById(id).textContent;
            resultsGrid.innerHTML += `
                <div class="print-result-item">
                    <strong>${nombre}:</strong>
                    <span>${valor} kcal/día</span>
                </div>
            `;
        }

        window.print();
    } catch (error) {
        console.error('Error al preparar impresión:', error);
        alert('Error al preparar la impresión. Por favor, verifique los datos.');
    }
}