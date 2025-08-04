import { supabase } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    const reservaForm = document.getElementById('reservaForm');
    
    // Configurar fecha mínima (hoy)
    const fechaInput = document.getElementById('fecha');
    fechaInput.min = new Date().toISOString().split('T')[0];
    
    // Manejar envío del formulario
    reservaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const reservaData = {
            fecha: fechaInput.value,
            hora: document.getElementById('hora').value,
            invitados: document.getElementById('invitados').value,
            nombre: document.getElementById('nombre').value,
            telefono: document.getElementById('telefono').value,
            comentarios: document.getElementById('comentarios').value,
            estado: 'pendiente',
            creado: new Date().toISOString()
        };
        
        try {
            // Insertar reserva en Supabase
            const { data, error } = await supabase
                .from('reservas')
                .insert([reservaData])
                .select();
            
            if (error) throw error;
            
            alert(`¡Reserva confirmada para ${reservaData.fecha} a las ${reservaData.hora}!`);
            reservaForm.reset();
            
        } catch (error) {
            console.error('Error al crear reserva:', error);
            alert('Error al procesar la reserva. Por favor intente nuevamente.');
        }
    });
    
    // Inicializar calendario (opcional)
    initCalendar();
});

// Función para mostrar calendario de disponibilidad
async function initCalendar() {
    // Obtener reservas existentes
    const { data: reservas, error } = await supabase
        .from('reservas')
        .select('fecha, hora');
    
    if (error) {
        console.error('Error cargando reservas:', error);
        return;
    }
    
    // Aquí puedes implementar un calendario visual
    // mostrando las fechas/horas ocupadas
    console.log('Reservas existentes:', reservas);
}