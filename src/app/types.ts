export interface Hackathon {
    id: string;
    name: string;
    date: string;
    location: string;
    type: 'Online' | 'In-Person' | 'Hybrid';
    participation: 'Solo' | 'Team' | 'Both';
    matchScore: number; // 0-100
    tags: string[];
    description: string;
}

export interface UserProfile {
    location: string;
    university: string;
    major: string[];
    skills: string[];
}
