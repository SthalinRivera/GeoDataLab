// types/incident.ts
export interface IncidentReport {
    id: number;
    title: string;
    description: string;
    type: 'VANDALISM' | 'THEFT' | 'ASSAULT' | 'OTHER';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
    latitude: number;
    longitude: number;
    address: string;
    districtId: number;
    locationId: number | null;
    userId: number;
    link: string | null;
    createdAt: string;
    updatedAt: string;
}