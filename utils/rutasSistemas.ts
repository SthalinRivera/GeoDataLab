interface Rutas {
    name: string;
    path: string;
    permiso?: string;
}

export default () => {
    const rutas: Rutas[] = [
        { name: 'Inicio', path: '/' },
        { name: 'Exp. Urbana', path: '/product' },
        { name: 'Cont. Ambiental', path: '/maps' },
        { name: 'Inseguridad Ciudadana', path: '/report-incident' },
        { name: 'Runner', path: '/task-runner' },
    ];
    return rutas;
}