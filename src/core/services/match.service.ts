import { IProfile } from '../../infrastructure/database/models/index.js';
import { GitHubData, calculateGitHubScore } from './github.service.js';

export interface MatchResult extends IProfile {
    score: number;
    matchReasons: string[];
    githubScore?: number;
    compatibilityPercentage: number;
}

export const calculateMatchScore = (
    me: IProfile,
    candidate: IProfile,
    myGitHub?: GitHubData,
    candidateGitHub?: GitHubData
): MatchResult => {
    let score = 0;
    const matchReasons: string[] = [];

    // --- 1. GitHub Compatibility (70 Points) ---
    let githubScoreTotal = 0;

    if (myGitHub && candidateGitHub) {
        // A. Language Overlap (30 points)
        // Calculate Jaccard Similarity for languages
        const myLangs = Object.keys(myGitHub.languages);
        const candLangs = Object.keys(candidateGitHub.languages);
        const myLangsSet = new Set(myLangs);
        const candLangsSet = new Set(candLangs);

        const commonLangs = candLangs.filter(l => myLangsSet.has(l));
        const allLangs = new Set([...myLangs, ...candLangs]);

        if (allLangs.size > 0) {
            const langOverlapRatio = commonLangs.length / allLangs.size;
            const langScore = Math.round(langOverlapRatio * 30);
            githubScoreTotal += langScore;

            if (commonLangs.length > 0) {
                matchReasons.push(`💻 Codes in ${commonLangs.slice(0, 3).join(', ')}`);
            }
        }

        // B. Skill/Topic Overlap (20 points)
        const mySkills = new Set(myGitHub.skills);
        const candSkills = new Set(candidateGitHub.skills);
        const commonSkills = candidateGitHub.skills.filter(s => mySkills.has(s));

        if (commonSkills.length > 0) {
            // Cap at 20 points, 2 points per shared skill
            const skillScore = Math.min(commonSkills.length * 4, 20);
            githubScoreTotal += skillScore;
            matchReasons.push(`⚡ Shared skills: ${commonSkills.slice(0, 3).join(', ')}`);
        }

        // C. Activity/Scale Similarity (20 points)
        // Compare public repos count to gauge experience level similarity
        const myRepos = myGitHub.profile.public_repos;
        const candRepos = candidateGitHub.profile.public_repos;
        const diffRatio = Math.abs(myRepos - candRepos) / Math.max(myRepos, candRepos, 1);

        // Closer repo counts = higher score (find peers)
        // If 0 diff, 20 pts. If 100% diff (one has 0, one has 100), 0 pts.
        const activityScore = Math.round((1 - diffRatio) * 20);
        githubScoreTotal += activityScore;
    } else {
        matchReasons.push(`⚠️ Missing GitHub data for deep analysis`);
    }

    score += githubScoreTotal;


    // --- 2. Social & Personal Compatibility (30 Points) ---
    let socialScoreTotal = 0;

    // A. Location (10 points)
    if (me.city && candidate.city && me.city.toLowerCase() === candidate.city.toLowerCase()) {
        socialScoreTotal += 10;
        matchReasons.push(`📍 Lives in ${me.city}`);
    } else if (me.country && candidate.country && me.country.toLowerCase() === candidate.country.toLowerCase()) {
        socialScoreTotal += 5;
        matchReasons.push(`🌍 Lives in ${me.country}`);
    }

    // B. Hobbies/Interests (10 points)
    if (me.hobbies && candidate.hobbies) {
        const myHobbies = new Set(me.hobbies.map(h => h.toLowerCase()));
        const commonHobbies = candidate.hobbies.filter(h => myHobbies.has(h.toLowerCase()));

        if (commonHobbies.length > 0) {
            const hobbyScore = Math.min(commonHobbies.length * 3, 10);
            socialScoreTotal += hobbyScore;
            matchReasons.push(`🎨 Into ${commonHobbies.slice(0, 2).join(', ')}`);
        }
    }

    // C. Intent & Stack & Bio (10 points)
    // Intent match (5 pts)
    if (me.intent === candidate.intent) {
        socialScoreTotal += 5;
        matchReasons.push(`🎯 Same goal: ${me.intent}`);
    }

    // Stack Manual match (5 pts) - Fallback/Bonus if GitHub data missing or supplementary
    if (!myGitHub || !candidateGitHub) {
        const myStack = new Set(me.stack.map(s => s.toLowerCase()));
        const commonStack = candidate.stack.filter(s => myStack.has(s.toLowerCase()));
        if (commonStack.length > 0) {
            socialScoreTotal += 5;
        }
    } else {
        // If GitHub exists, we already scored mostly on that, but give small bonus
        // for manually declared stack alignment
        const myStack = new Set(me.stack.map(s => s.toLowerCase()));
        const commonStack = candidate.stack.filter(s => myStack.has(s.toLowerCase()));
        if (commonStack.length > 0) {
            socialScoreTotal += 2; // Small bonus
        }
    }

    score += Math.min(socialScoreTotal, 30);


    // Calculate compatibility percentage
    const maxPossibleScore = 100;
    const compatibilityPercentage = Math.round((score / maxPossibleScore) * 100);

    return {
        ...candidate.toObject(),
        score,
        matchReasons,
        githubScore: candidateGitHub ? calculateGitHubScore(candidateGitHub) : undefined,
        compatibilityPercentage
    } as MatchResult;
};
