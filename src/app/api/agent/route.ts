import { mistral } from '@ai-sdk/mistral';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { location, university, major, skills } = await req.json();

        // Check availability of API Key
        const apiKey = process.env.MISTRAL_API_KEY;

        console.log("🛠️ ENV DEBUG:", {
            hasMistralKey: !!apiKey,
            keyLength: apiKey?.length,
            availableKeys: Object.keys(process.env).filter(k => k.toLowerCase().includes('mistral') || k.toLowerCase().includes('api'))
        });

        if (!apiKey || apiKey === 'your_mistral_api_key_here') {
            console.warn("⚠️ Mistral API Key is missing or default placeholder.");
            throw new Error("Missing API Key"); // Trigger fallback
        }

        const result = await generateObject({
            model: mistral('devstral-small-latest'),
            system: `You are an expert Hackathon Finder Agent. Your goal is to find or generate 3-5 realistic hackathon opportunities based on the user's profile.
      
      If you know of real upcoming hackathons in Jordan or Global/Online, use them.
      If not, generate highly realistic examples that fit the user's location and skills.
      
      User Profile:
      - Location: ${location}
      - University: ${university}
      - Major: ${(major || []).join(', ')}
      - Skills: ${(skills || []).join(', ')}
      
      Focus on events that would be relevant to a student with these specific skills.
      Returns valid JSON only.`,
            prompt: "Find hackathons matching the user profile.",
            schema: z.object({
                hackathons: z.array(z.object({
                    id: z.string(),
                    name: z.string().describe("Name of the hackathon"),
                    date: z.string().describe("Date range, e.g., 'Oct 15 - Oct 17, 2024'"),
                    location: z.string(),
                    type: z.enum(['Online', 'In-Person', 'Hybrid']),
                    participation: z.enum(['Solo', 'Team', 'Both']),
                    matchScore: z.number().min(0).max(100),
                    tags: z.array(z.string()).describe("3-4 keywords relevant to the user's profile and the event"),
                    description: z.string().describe("Brief description of the event and why it matches the user")
                }))
            })
        });

        return Response.json(result.object.hackathons);
    } catch (error) {
        console.error("❌ AI Agent Failed. Logic Error:", error);

        // Fallback Mock Data
        const mockFallback = [
            {
                id: "mock-1",
                name: "JudoHack 2026 (Offline Mode)",
                date: "Oct 15 - Oct 17, 2026",
                location: "Amman, Jordan",
                type: "In-Person",
                participation: "Team",
                matchScore: 99,
                tags: ["AI", "Mock Data", "Fallback"],
                description: "The AI agent could not be reached, so you are seeing this cached result. Please check your API Key."
            },
            {
                id: "mock-2",
                name: "Offline Coder Cup",
                date: "Nov 05 - Nov 07, 2026",
                location: "Online",
                type: "Online",
                participation: "Solo",
                matchScore: 85,
                tags: ["System", "Debug", "Offline"],
                description: "This event appears when the system is offline."
            }
        ];

        return Response.json(mockFallback);
    }
}
