// plugins/leaflet.client.ts
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default defineNuxtPlugin(() => {
    // Configurar íconos con rutas locales
    const iconDefault = L.icon({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = iconDefault;

    return {
        provide: {
            leaflet: L
        }
    };
});