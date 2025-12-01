// interfaces/garbage-report.ts
export interface GarbageReport {
    id: number;
    title: string;
    description: string;
    type: GarbageType;
    severity: SeverityLevel;
    status: ReportStatus;
    latitude?: number;
    longitude?: number;
    address?: string;
    districtId: number;
    locationId?: number;
    userId: number;
    district: {
        name: string;
    };
    location?: {
        name: string;
        latitude: number;
        longitude: number;
    };
    user: {
        name: string;
        email: string;
    };
    photos: Photo[];
    statusHistory: ReportStatusHistory[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateGarbageReport {
    title: string;
    description: string;
    type: GarbageType;
    severity?: SeverityLevel;
    status?: ReportStatus;
    latitude?: number;
    longitude?: number;
    address?: string;
    districtId: number;
    locationId?: number;
    userId: number;
    photos?: string[]; // URLs de las fotos
}

export interface Photo {
    id: number;
    url: string;
    caption?: string;
    type: PhotoType;
    createdAt: string;
}

export interface ReportStatusHistory {
    id: number;
    status: ReportStatus;
    notes?: string;
    createdAt: string;
    user: {
        name: string;
    };
}

// Enums (pueden ir en un archivo separado)
export enum GarbageType {
    ORGANIC = 'ORGANIC',
    PLASTIC = 'PLASTIC',
    PAPER = 'PAPER',
    GLASS = 'GLASS',
    METAL = 'METAL',
    ELECTRONIC = 'ELECTRONIC',
    CONSTRUCTION = 'CONSTRUCTION',
    HAZARDOUS = 'HAZARDOUS',
    OTHER = 'OTHER'
}

export enum SeverityLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum ReportStatus {
    PENDING = 'PENDING',
    IN_REVIEW = 'IN_REVIEW',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED',
    CLOSED = 'CLOSED'
}

export enum PhotoType {
    EVIDENCE = 'EVIDENCE',
    BEFORE = 'BEFORE',
    AFTER = 'AFTER',
    DOCUMENT = 'DOCUMENT',
    OTHER = 'OTHER'
}