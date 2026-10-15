// Arreglo para almacenar todas las alarmas
let alarms = [];

// Establecer la fecha mínima en el input como el día de hoy
const alarmDateInput = document.getElementById('alarmDate');
const today = new Date().toISOString().split('T')[0];
alarmDateInput.value = today;
alarmDateInput.min = today;

// Función para obtener y mostrar la hora actual en tiempo real
function updateClock() {
    const now = new Date();
    
    // Formatear hora, minutos y segundos (HH:MM:SS)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    const timeDisplay = document.getElementById('time');
    timeDisplay.textContent = timeString;

    // Obtener fecha actual y hora en formato HH:MM
    const currentDate = now.toISOString().split('T')[0];
    const currentTimeHM = `${hours}:${minutes}`;

    // Verificar si alguna alarma coincide con el momento actual
    let alarmTriggered = false;
    alarms.forEach(alarm => {
        if (!alarm.triggered && alarm.date === currentDate && alarm.time === currentTimeHM) {
            alarm.triggered = true; // Marcar como activada para que no suene cada segundo del mismo minuto
            alarmTriggered = true;
            playAlarmPattern(); // Ejecutar el sonido de varios pitidos seguidos
        }
    });

    // Cambiar color del reloj si una alarma se activó
    if (alarmTriggered) {
        timeDisplay.style.color = '#e74c3c'; // Rojo alerta
        timeDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => {
            timeDisplay.style.color = '#2c3e50';
            timeDisplay.style.transform = 'scale(1)';
        }, 5000); // Regresa a la normalidad después de 5 segundos
    }
}

// Función para generar un sonido de alarma repetitivo (5 pitidos cortos)
function playAlarmPattern() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Repetir el pitido 5 veces, con una pausa de 250 milisegundos entre cada uno
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Frecuencia de la nota
                
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.1); // Cada pitido dura 100ms
            }, i * 250);
        }
    } catch (e) {
        console.error("El navegador no pudo reproducir el sonido automático:", e);
    }
}

// Función para renderizar la lista de alarmas en pantalla
function renderAlarms() {
    const alarmsContainer = document.getElementById('alarms');
    alarmsContainer.innerHTML = '';

    if (alarms.length === 0) {
        alarmsContainer.innerHTML = '<p>No hay alarmas programadas.</p>';
        return;
    }

    alarms.forEach((alarm, index) => {
        const alarmItem = document.createElement('div');
        alarmItem.className = 'alarm-item';
        alarmItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px;';
        
        alarmItem.innerHTML = `
            <span>📅 <strong>${alarm.date}</strong> - ⏰ <strong>${alarm.time}</strong></span>
            <button onclick="deleteAlarm(${index})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Borrar</button>
        `;
        alarmsContainer.appendChild(alarmItem);
    });
}

// Agregar nueva alarma
document.getElementById('setAlarm').addEventListener('click', () => {
    const date = document.getElementById('alarmDate').value;
    const time = document.getElementById('alarmTime').value;

    if (!date || !time) {
        alert('Por favor selecciona una fecha y una hora válidas.');
        return;
    }

    alarms.push({ date, time, triggered: false });
    renderAlarms();

    // Limpiar campo de hora
    document.getElementById('alarmTime').value = '';
});

// Borrar alarma
window.deleteAlarm = function(index) {
    alarms.splice(index, 1);
    renderAlarms();
};

// Inicializar el reloj (actualizar cada segundo)
setInterval(updateClock, 1000);
updateClock();
renderAlarms();