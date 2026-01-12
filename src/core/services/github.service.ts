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
}

export interface GitHubData {
    profile: GitHubProfile;
    languages: { [key: string]: number };
    topRepos: GitHubRepo[];
    totalStars: number;
    totalCommits: number;
    skills: string[];
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

    // Analyze languages
    const languages: { [key: string]: number } = {};
    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    // Calculate total stars
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    // Get top repos
    const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10);

    // Extract skills from languages and topics
    const skills = new Set<string>();
    Object.keys(languages).forEach(lang => skills.add(lang));
    repos.forEach(repo => {
        repo.topics?.forEach(topic => skills.add(topic));
    });

    return {
        profile,
        languages,
        topRepos,
        totalStars,
        totalCommits: repos.length, // Approximate
        skills: Array.from(skills)
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
