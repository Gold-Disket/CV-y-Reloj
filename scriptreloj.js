// Arreglo para almacenar todas las alarmas
let alarms = [];

// Establecer la fecha mínima en el input como el día de hoy o el de mañana
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

    // Verifica si una alarma coincide con la alarma
    let alarmTriggered = false;
    alarms.forEach(alarm => {
        if (!alarm.triggered && alarm.date === currentDate && alarm.time === currentTimeHM) {
            alarm.triggered = true; // Marcar como activada para que no suene cada segundo del mismo minuto
            alarmTriggered = true;
            playAlarmPattern(); // Ejecuta el sonido de varios pitidos seguidos
        }
    });

    // Cambiar el color del reloj si se activa una alarma
    if (alarmTriggered) {
        timeDisplay.style.color = '#e74c3c'; 
        timeDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => {
            timeDisplay.style.color = '#2c3e50';
            timeDisplay.style.transform = 'scale(1)';
        }, 5000);
    }
}

// Para generar unos pitillos
function playAlarmPattern() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Repite un pitillo
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
                
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.1);
            }, i * 250);
        }
    } catch (e) {
        console.error("El navegador no pudo reproducir el sonido automático:", e);
    }
}

// Para renderizar la lista de alarmas en pantalla
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

// Agregar una nueva alarma
document.getElementById('setAlarm').addEventListener('click', () => {
    const date = document.getElementById('alarmDate').value;
    const time = document.getElementById('alarmTime').value;

    if (!date || !time) {
        alert('Por favor selecciona una fecha y una hora válidas.');
        return;
    }

    alarms.push({ date, time, triggered: false });
    renderAlarms();

    // Limpiar el campo hora
    document.getElementById('alarmTime').value = '';
});

// Borra una alarma
window.deleteAlarm = function(index) {
    alarms.splice(index, 1);
    renderAlarms();
};

// Inicializa el reloj y lo actualiza en cada segundo
setInterval(updateClock, 1000);
updateClock();
renderAlarms();