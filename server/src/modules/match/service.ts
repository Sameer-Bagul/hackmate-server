import { IProfile } from '../../models/index.js';

export interface MatchResult extends IProfile {
    score: number;
    matchReasons: string[];
}

export const calculateMatchScore = (me: IProfile, candidate: IProfile): MatchResult => {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Intent Match (50 points)
    if (me.intent === candidate.intent) {
        score += 50;
        matchReasons.push(`Same intent: ${me.intent}`);
    }

    // 2. Stack Overlap (10 points per match)
    const myStack = new Set(me.stack.map(s => s.toLowerCase()));
    const commonTech = candidate.stack.filter(s => myStack.has(s.toLowerCase()));

    if (commonTech.length > 0) {
        const techScore = Math.min(commonTech.length * 10, 40); // Max 40
        score += techScore;
        matchReasons.push(`Shared tech: ${commonTech.join(', ')}`);
    }

    // 3. Location Fuzzy Match (10 points)
    if (me.location && candidate.location && me.location.toLowerCase() === candidate.location.toLowerCase()) {
        score += 10;
        matchReasons.push(`Same location: ${me.location}`);
    }

    return {
        ...candidate.toObject(),
        score,
        matchReasons,
    } as MatchResult;
};
