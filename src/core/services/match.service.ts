import { IProfile } from '../../infrastructure/database/models/index.js';
import { GitHubData, calculateGitHubScore } from './github.service.js';

export interface MatchResult extends IProfile {
    score: number;
    matchReasons: string[];
    githubScore?: number;
    compatibilityPercentage: number;
    breakdown: {
        github: {
            languageProficiency: number;
            frameworkExpertise: number;
            projectQuality: number;
            activityConsistency: number;
            openSourceImpact: number;
            codeDiversity: number;
        };
        social: {
            location: number;
            careerStage: number;
            hobbies: number;
            communityEngagement: number;
        };
        profile: {
            completeness: number;
            intentAlignment: number;
            techStack: number;
        };
    };
}

export const calculateMatchScore = (
    me: IProfile,
    candidate: IProfile,
    myGitHub?: GitHubData,
    candidateGitHub?: GitHubData
): MatchResult => {
    let score = 0;
    const matchReasons: string[] = [];

    // Initialize breakdown
    const breakdown = {
        github: {
            languageProficiency: 0,
            frameworkExpertise: 0,
            projectQuality: 0,
            activityConsistency: 0,
            openSourceImpact: 0,
            codeDiversity: 0,
        },
        social: {
            location: 0,
            careerStage: 0,
            hobbies: 0,
            communityEngagement: 0,
        },
        profile: {
            completeness: 0,
            intentAlignment: 0,
            techStack: 0,
        },
    };

    // ===== SECTION 1: GITHUB TECHNICAL ANALYSIS (60 POINTS) =====
    
    if (myGitHub && candidateGitHub) {
        // 1A. Language Proficiency (15 points) - Weighted by usage depth
        const myLangs = Object.entries(myGitHub.languages);
        const candLangs = Object.entries(candidateGitHub.languages);
        
        // Calculate weighted overlap
        let langOverlapScore = 0;
        const myLangMap = new Map(myLangs);
        const candLangMap = new Map(candLangs);
        
        const allLangs = new Set([...myLangMap.keys(), ...candLangMap.keys()]);
        const commonLangs: string[] = [];
        
        allLangs.forEach(lang => {
            const myWeight = myLangMap.get(lang) || 0;
            const candWeight = candLangMap.get(lang) || 0;
            
            if (myWeight > 0 && candWeight > 0) {
                commonLangs.push(lang);
                // Higher overlap if both have similar proficiency
                const similarity = 1 - Math.abs(myWeight - candWeight) / Math.max(myWeight, candWeight);
                langOverlapScore += similarity;
            }
        });
        
        breakdown.github.languageProficiency = Math.round(Math.min((langOverlapScore / allLangs.size) * 15, 15));
        score += breakdown.github.languageProficiency;
        
        if (commonLangs.length > 0) {
            matchReasons.push(`💻 Proficient in ${commonLangs.slice(0, 3).join(', ')}`);
        }

        // 1B. Framework/Library Expertise (12 points)
        const myFrameworks = new Set(myGitHub.frameworks);
        const candFrameworks = new Set(candidateGitHub.frameworks);
        const commonFrameworks = candidateGitHub.frameworks.filter(f => myFrameworks.has(f));
        
        if (commonFrameworks.length > 0) {
            breakdown.github.frameworkExpertise = Math.min(commonFrameworks.length * 3, 12);
            score += breakdown.github.frameworkExpertise;
            matchReasons.push(`🛠️ Uses ${commonFrameworks.slice(0, 2).join(', ')}`);
        }

        // 1C. Project Quality Score (10 points) - Stars, Forks, Impact
        const myQuality = myGitHub.totalStars + (myGitHub.totalForks * 2);
        const candQuality = candidateGitHub.totalStars + (candidateGitHub.totalForks * 2);
        
        // Similar quality = better match (find equals)
        const qualityDiff = Math.abs(myQuality - candQuality) / Math.max(myQuality, candQuality, 1);
        breakdown.github.projectQuality = Math.round((1 - qualityDiff) * 10);
        score += breakdown.github.projectQuality;
        
        if (candidateGitHub.totalStars > 50) {
            matchReasons.push(`⭐ ${candidateGitHub.totalStars} stars earned`);
        }

        // 1D. Activity Consistency (8 points) - Recent engagement
        const myActivity = myGitHub.recentActivity / myGitHub.profile.public_repos;
        const candActivity = candidateGitHub.recentActivity / candidateGitHub.profile.public_repos;
        
        const activitySimilarity = 1 - Math.abs(myActivity - candActivity);
        breakdown.github.activityConsistency = Math.round(Math.max(activitySimilarity * 8, 0));
        score += breakdown.github.activityConsistency;
        
        if (candidateGitHub.recentActivity >= candidateGitHub.profile.public_repos * 0.3) {
            matchReasons.push(`🔥 Active coder (${candidateGitHub.recentActivity} recent projects)`);
        }

        // 1E. Open Source Impact (8 points) - Contribution score
        const myContribution = Math.log10(myGitHub.contributionScore + 1);
        const candContribution = Math.log10(candidateGitHub.contributionScore + 1);
        
        const contributionDiff = Math.abs(myContribution - candContribution) / Math.max(myContribution, candContribution, 1);
        breakdown.github.openSourceImpact = Math.round((1 - contributionDiff) * 8);
        score += breakdown.github.openSourceImpact;

        // 1F. Code Diversity (7 points) - Variety of skills
        const myDiversity = myGitHub.diversityScore;
        const candDiversity = candidateGitHub.diversityScore;
        
        const diversityDiff = Math.abs(myDiversity - candDiversity) / Math.max(myDiversity, candDiversity, 1);
        breakdown.github.codeDiversity = Math.round((1 - diversityDiff) * 7);
        score += breakdown.github.codeDiversity;
        
        if (candidateGitHub.diversityScore > 15) {
            matchReasons.push(`🎨 Polyglot (${Object.keys(candidateGitHub.languages).length} languages)`);
        }
    } else {
        matchReasons.push(`⚠️ Missing GitHub data for deep technical analysis`);
    }

    // ===== SECTION 2: SOCIAL & PROFESSIONAL COMPATIBILITY (25 POINTS) =====

    // 2A. Location Match (8 points)
    if (me.city && candidate.city && me.city.toLowerCase() === candidate.city.toLowerCase()) {
        breakdown.social.location = 8;
        score += 8;
        matchReasons.push(`📍 Lives in ${me.city}`);
    } else if (me.country && candidate.country && me.country.toLowerCase() === candidate.country.toLowerCase()) {
        breakdown.social.location = 4;
        score += 4;
        matchReasons.push(`🌍 Same country: ${me.country}`);
    }

    // 2B. Career Stage Alignment (7 points) - Experience level
    if (myGitHub && candidateGitHub) {
        // Compare account age and repo count
        const myExperience = (myGitHub.accountAge * 2) + (myGitHub.profile.public_repos / 10);
        const candExperience = (candidateGitHub.accountAge * 2) + (candidateGitHub.profile.public_repos / 10);
        
        const expDiff = Math.abs(myExperience - candExperience) / Math.max(myExperience, candExperience, 1);
        breakdown.social.careerStage = Math.round((1 - expDiff) * 7);
        score += breakdown.social.careerStage;
        
        if (breakdown.social.careerStage >= 5) {
            matchReasons.push(`👔 Similar experience level`);
        }
    }

    // 2C. Hobbies/Interests (5 points)
    if (me.hobbies && candidate.hobbies && me.hobbies.length > 0 && candidate.hobbies.length > 0) {
        const myHobbies = new Set(me.hobbies.map(h => h.toLowerCase()));
        const commonHobbies = candidate.hobbies.filter(h => myHobbies.has(h.toLowerCase()));

        if (commonHobbies.length > 0) {
            breakdown.social.hobbies = Math.min(commonHobbies.length * 2, 5);
            score += breakdown.social.hobbies;
            matchReasons.push(`🎮 Into ${commonHobbies.slice(0, 2).join(', ')}`);
        }
    }

    // 2D. Community Engagement (5 points) - GitHub social presence
    if (myGitHub && candidateGitHub) {
        const myEngagement = myGitHub.profile.followers + myGitHub.profile.following;
        const candEngagement = candidateGitHub.profile.followers + candidateGitHub.profile.following;
        
        const engagementDiff = Math.abs(myEngagement - candEngagement) / Math.max(myEngagement, candEngagement, 1);
        breakdown.social.communityEngagement = Math.round((1 - engagementDiff) * 5);
        score += breakdown.social.communityEngagement;
        
        if (candidateGitHub.profile.followers > 20) {
            matchReasons.push(`👥 ${candidateGitHub.profile.followers} followers`);
        }
    }

    // ===== SECTION 3: PROFILE QUALITY & ALIGNMENT (15 POINTS) =====

    // 3A. Profile Completeness (5 points)
    let completenessScore = 0;
    if (candidate.bio) completenessScore += 1;
    if (candidate.city) completenessScore += 1;
    if (candidate.github) completenessScore += 1;
    if (candidate.linkedin) completenessScore += 1;
    if (candidate.hobbies && candidate.hobbies.length > 0) completenessScore += 1;
    
    breakdown.profile.completeness = completenessScore;
    score += completenessScore;

    // 3B. Intent Alignment (5 points)
    if (me.intent === candidate.intent) {
        breakdown.profile.intentAlignment = 5;
        score += 5;
        matchReasons.push(`🎯 Same goal: ${me.intent}`);
    }

    // 3C. Tech Stack Manual Match (5 points)
    if (me.stack && candidate.stack && me.stack.length > 0 && candidate.stack.length > 0) {
        const myStack = new Set(me.stack.map(s => s.toLowerCase()));
        const commonStack = candidate.stack.filter(s => myStack.has(s.toLowerCase()));
        
        if (commonStack.length > 0) {
            breakdown.profile.techStack = Math.min(commonStack.length, 5);
            score += breakdown.profile.techStack;
            
            // Only show if not already covered by GitHub languages
            if (!myGitHub || !candidateGitHub) {
                matchReasons.push(`🔧 Tech stack: ${commonStack.slice(0, 2).join(', ')}`);
            }
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
        compatibilityPercentage,
        breakdown
    } as MatchResult;
};
