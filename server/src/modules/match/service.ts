import { IProfile } from '../../models/index.js';
import { GitHubData, calculateGitHubScore } from '../../services/githubService.js';

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

    // 1. Intent Match (20 points)
    if (me.intent === candidate.intent) {
        score += 20;
        matchReasons.push(`🎯 Same intent: ${me.intent}`);
    }

    // 2. Stack Overlap (15 points)
    const myStack = new Set(me.stack.map(s => s.toLowerCase()));
    const commonTech = candidate.stack.filter(s => myStack.has(s.toLowerCase()));

    if (commonTech.length > 0) {
        const techScore = Math.min(commonTech.length * 3, 15);
        score += techScore;
        matchReasons.push(`💻 Shared tech (${commonTech.length}): ${commonTech.slice(0, 5).join(', ')}`);
    }

    // 3. Location Match (10 points)
    if (me.city && candidate.city) {
        const myCity = me.city.toLowerCase();
        const candCity = candidate.city.toLowerCase();
        
        if (myCity === candCity) {
            score += 10;
            matchReasons.push(`📍 Same city: ${me.city}`);
        } else if (me.country && candidate.country && me.country.toLowerCase() === candidate.country.toLowerCase()) {
            score += 5;
            matchReasons.push(`🌍 Same country: ${me.country}`);
        }
    } else if (me.location && candidate.location) {
        const myLoc = me.location.toLowerCase();
        const candLoc = candidate.location.toLowerCase();
        
        if (myLoc === candLoc) {
            score += 10;
            matchReasons.push(`📍 Same location: ${me.location}`);
        } else if (myLoc.includes(candLoc) || candLoc.includes(myLoc)) {
            score += 5;
            matchReasons.push(`📍 Nearby location: ${candidate.location}`);
        }
    }

    // 4. Age Compatibility (10 points) - for dating intent
    if (me.intent === 'dating' && candidate.intent === 'dating' && me.age && candidate.age) {
        // Check if candidate is within my age range
        const inMyRange = (!me.ageRangeMin || candidate.age >= me.ageRangeMin) && 
                         (!me.ageRangeMax || candidate.age <= me.ageRangeMax);
        
        // Check if I'm within candidate's age range
        const inCandRange = (!candidate.ageRangeMin || me.age >= candidate.ageRangeMin) && 
                           (!candidate.ageRangeMax || me.age <= candidate.ageRangeMax);
        
        if (inMyRange && inCandRange) {
            score += 10;
            matchReasons.push(`💘 Perfect age match (${candidate.age})`);
        } else if (inMyRange || inCandRange) {
            score += 5;
            matchReasons.push(`💘 Age compatible (${candidate.age})`);
        }
    }

    // 5. Dating Preferences (15 points) - orientation & gender match
    if (me.intent === 'dating' && candidate.intent === 'dating') {
        let datingScore = 0;
        
        // Check if orientation and gender are compatible
        if (me.interestedIn && candidate.gender && candidate.gender !== 'prefer-not-to-say') {
            if (me.interestedIn.includes(candidate.gender as 'male' | 'female' | 'other')) {
                datingScore += 8;
                matchReasons.push(`❤️ Gender preference match`);
            }
        }
        
        // Check if candidate is interested in my gender
        if (candidate.interestedIn && me.gender && me.gender !== 'prefer-not-to-say') {
            if (candidate.interestedIn.includes(me.gender as 'male' | 'female' | 'other')) {
                datingScore += 7;
            }
        }
        
        score += Math.min(datingScore, 15);
    }

    // 6. Hobbies & Interests Overlap (10 points)
    if (me.hobbies && candidate.hobbies && me.hobbies.length > 0 && candidate.hobbies.length > 0) {
        const myHobbies = new Set(me.hobbies.map(h => h.toLowerCase()));
        const commonHobbies = candidate.hobbies.filter(h => myHobbies.has(h.toLowerCase()));
        
        if (commonHobbies.length > 0) {
            const hobbyScore = Math.min(commonHobbies.length * 2, 10);
            score += hobbyScore;
            matchReasons.push(`🎨 Shared hobbies (${commonHobbies.length}): ${commonHobbies.slice(0, 3).join(', ')}`);
        }
    }

    // 7. GitHub Analysis (20 points)
    if (myGitHub && candidateGitHub) {
        // Language similarity
        const myLangs = new Set(Object.keys(myGitHub.languages));
        const candLangs = Object.keys(candidateGitHub.languages);
        const commonLangs = candLangs.filter(lang => myLangs.has(lang));
        
        if (commonLangs.length > 0) {
            const langScore = Math.min(commonLangs.length * 3, 10);
            score += langScore;
            matchReasons.push(`🔧 Common languages (${commonLangs.length}): ${commonLangs.slice(0, 3).join(', ')}`);
        }

        // Skill/Topic similarity
        const mySkills = new Set(myGitHub.skills);
        const commonSkills = candidateGitHub.skills.filter(skill => mySkills.has(skill));
        
        if (commonSkills.length > 0) {
            const skillScore = Math.min(commonSkills.length * 2, 10);
            score += skillScore;
            matchReasons.push(`⚡ Common skills (${commonSkills.length}): ${commonSkills.slice(0, 4).join(', ')}`);
        }
    }

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
