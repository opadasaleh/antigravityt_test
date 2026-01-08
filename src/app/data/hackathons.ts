import { Hackathon } from "../types";

export const ALL_HACKATHONS: Hackathon[] = [
    // --- JORDANIAN EVENTS ---
    {
        id: "jo-1",
        name: "Hijjawi Tech Jam",
        date: "March 10 - March 12, 2026",
        location: "Irbid, Jordan",
        type: "In-Person",
        participation: "Team",
        matchScore: 0,
        tags: ["Embedded Systems", "IoT", "Engineering"],
        description: "Annual engineering hackathon hosted at Yarmouk University. Focus on hardware and smart systems."
    },
    {
        id: "jo-2",
        name: "Amman AI Summit",
        date: "April 05 - April 07, 2026",
        location: "Amman, Jordan",
        type: "Hybrid",
        participation: "Both",
        matchScore: 0,
        tags: ["AI", "Python", "Data Science"],
        description: "The biggest AI gathering in the capital. Build models to solve local logistics and traffic problems."
    },
    {
        id: "jo-3",
        name: "Aqaba BlueTech Challenge",
        date: "May 20 - May 22, 2026",
        location: "Aqaba, Jordan",
        type: "In-Person",
        participation: "Team",
        matchScore: 0,
        tags: ["Sustainability", "Marine Tech", "Smart City"],
        description: "Innovation by the sea. Develop solutions for port management and marine conservation."
    },
    {
        id: "jo-4",
        name: "PSUT CyberDefense",
        date: "Feb 15 - Feb 16, 2026",
        location: "Amman, Jordan",
        type: "In-Person",
        participation: "Team",
        matchScore: 0,
        tags: ["Cybersecurity", "Network", "Red Team"],
        description: "An intense 24-hour CTF and defense simulation at Princess Sumaya University."
    },
    {
        id: "jo-5",
        name: "Dead Sea Saltathon",
        date: "Nov 10 - Nov 12, 2026",
        location: "Dead Sea, Jordan",
        type: "In-Person",
        participation: "Team",
        matchScore: 0,
        tags: ["HealthTech", "Wellness", "Chemical Eng"],
        description: "Unique hackathon focused on health and mineral innovations, hosted at the lowest point on Earth."
    },
    {
        id: "jo-6",
        name: "Zarqa Industry 4.0",
        date: "June 01 - June 03, 2026",
        location: "Zarqa, Jordan",
        type: "In-Person",
        participation: "Team",
        matchScore: 0,
        tags: ["Industrial Automation", "Robotics", "Java"],
        description: "Solving real-world manufacturing challenges in Jordan's industrial hub."
    },

    // --- ONLINE / GLOBAL EVENTS ---
    {
        id: "gl-1",
        name: "Global Game Jam Online",
        date: "Jan 25 - Jan 27, 2026",
        location: "Online",
        type: "Online",
        participation: "Both",
        matchScore: 0,
        tags: ["Game Dev", "C#", "Unity", "Design"],
        description: "The world's largest game creation event. Collaborate with devs from 100+ countries."
    },
    {
        id: "gl-2",
        name: "NASA Space Apps Challenge",
        date: "Oct 01 - Oct 03, 2026",
        location: "Online",
        type: "Online",
        participation: "Team",
        matchScore: 0,
        tags: ["Space", "Open Data", "Python", "Science"],
        description: "Use NASA's open data to build innovative solutions for Earth and space exploration."
    },
    {
        id: "gl-3",
        name: "ETHGlobal Super Hack",
        date: "July 12 - July 25, 2026",
        location: "Online",
        type: "Online",
        participation: "Solo",
        matchScore: 0,
        tags: ["Blockchain", "Smart Contracts", "Solidity", "Web3"],
        description: "The premier event for building on Ethereum. Massive prizes and global mentorship."
    },
    {
        id: "gl-4",
        name: "React Nexus Sprint",
        date: "Aug 15 - Aug 17, 2026",
        location: "Online",
        type: "Online",
        participation: "Solo",
        matchScore: 0,
        tags: ["React", "TypeScript", "Frontend", "UI/UX"],
        description: "A weekend sprint to build the most beautiful and performant React components."
    },
    {
        id: "gl-5",
        name: "FinTech World Cup",
        date: "Sep 10 - Sep 14, 2026",
        location: "Online",
        type: "Online",
        participation: "Team",
        matchScore: 0,
        tags: ["Finance", "Security", "Go", "Backend"],
        description: "Revolutionize the future of payments and banking in this high-stakes global contest."
    }
];
