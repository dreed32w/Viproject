const MAP = {
    pending: ['En attente', 'badge-warning'],
    repairing: ['En réparation', 'badge-info'],
    solved: ['Résolu', 'badge-success'],
    rejected: ['Rejetée', 'badge-danger'],
    reci: ['Reçue', 'badge-success'],
    received: ['Reçue', 'badge-success'],
    Disponible: ['Disponible', 'badge-success'],
    Attribue: ['Attribué', 'badge-info'],
    En_reparation: ['En réparation', 'badge-warning'],
    Hors_service: ['Hors service', 'badge-danger'],
}

export default function StatusBadge({ status }) {
    const [label, cls] = MAP[status] ?? [status, 'badge-neutral']
    return <span className={`badge ${cls}`}>{label}</span>
}
