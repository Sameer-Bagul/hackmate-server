import axios from 'axios';

interface GitHubProfile {
    login: string;
    name: string;
    bio: string;
    location: string;
    company: string;
    blog: string;
    twitter_username: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

interface GitHubRepo {
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
    updated_at?: string;
    created_at: string;
}

export interface GitHubData {
    profile: GitHubProfile;
    languages: { [key: string]: number };
    topRepos: GitHubRepo[];
    totalStars: number;
    totalCommits: number;
    totalForks: number;
    skills: string[];
    frameworks: string[];
    recentActivity: number; // commits in last 6 months
    accountAge: number; // years
    contributionScore: number; // based on repos + stars + forks
    diversityScore: number; // variety of languages/topics
}

const GITHUB_API = 'https://api.github.com';

export const fetchGitHubProfile = async (username: string): Promise<GitHubProfile | null> => {
    try {
        const response = await axios.get(`${GITHUB_API}/users/${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'HackMate-App'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch GitHub profile for ${username}:`, error);
        return null;
    }
};

export const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
    try {
        const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
            params: {
                sort: 'updated',
                per_page: 100
            },
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'HackMate-App'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch GitHub repos for ${username}:`, error);
        return [];
    }
};

export const analyzeGitHubData = async (username: string): Promise<GitHubData | null> => {
    // Real implementation
    const profile = await fetchGitHubProfile(username);
    if (!profile) return null;

    const repos = await fetchGitHubRepos(username);

    // Analyze languages with weighted count (more repos = higher proficiency)
    const languages: { [key: string]: number } = {};
    repos.forEach(repo => {
        if (repo.language) {
            // Weight by stars + 1 (so non-starred repos still count)
            const weight = repo.stargazers_count + 1;
            languages[repo.language] = (languages[repo.language] || 0) + weight;
        }
    });

    // Calculate total stars and forks
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    // Get top repos
    const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10);

    // Extract skills and frameworks from languages and topics
    const skills = new Set<string>();
    const frameworks = new Set<string>();
    const frameworkKeywords = ['react', 'vue', 'angular', 'express', 'django', 'flask', 'spring', 'rails', 'laravel', 'next', 'nuxt', 'svelte', 'fastify', 'nest'];
    
    Object.keys(languages).forEach(lang => skills.add(lang));
    repos.forEach(repo => {
        repo.topics?.forEach(topic => {
            skills.add(topic);
            // Identify frameworks
            if (frameworkKeywords.some(fw => topic.toLowerCase().includes(fw))) {
                frameworks.add(topic);
            }
        });
        // Check repo name/description for frameworks
        const repoText = `${repo.name} ${repo.description || ''}`.toLowerCase();
        frameworkKeywords.forEach(fw => {
            if (repoText.includes(fw)) {
                frameworks.add(fw);
            }
        });
    });

    // Calculate recent activity (repos updated in last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentActivity = repos.filter(repo => {
        const updatedAt = new Date(repo.updated_at || repo.created_at);
        return updatedAt > sixMonthsAgo;
    }).length;

    // Calculate account age in years
    const accountCreated = new Date(profile.created_at);
    const accountAge = (Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // Contribution score (weighted metric)
    const contributionScore = (repos.length * 1) + (totalStars * 5) + (totalForks * 3) + (profile.followers * 2);

    // Diversity score (variety of languages and topics)
    const diversityScore = Object.keys(languages).length + (Array.from(skills).length / 2);

    return {
        profile,
        languages,
        topRepos,
        totalStars,
        totalForks,
        totalCommits: repos.length, // Approximate
        skills: Array.from(skills),
        frameworks: Array.from(frameworks),
        recentActivity,
        accountAge: Math.round(accountAge * 10) / 10,
        contributionScore,
        diversityScore
    };
};

export const calculateGitHubScore = (data: GitHubData): number => {
    let score = 0;

    // Activity score (max 25)
    score += Math.min(data.profile.public_repos / 10, 10);
    score += Math.min(data.totalStars / 100, 10);
    score += Math.min(data.profile.followers / 50, 5);

    // Diversity score (max 15)
    const languageCount = Object.keys(data.languages).length;
    score += Math.min(languageCount * 2, 15);

    // Profile completeness (max 10)
    if (data.profile.bio) score += 3;
    if (data.profile.location) score += 2;
    if (data.profile.company) score += 2;
    if (data.profile.blog) score += 3;

    return Math.min(score, 50); // Max 50 points from GitHub
};
