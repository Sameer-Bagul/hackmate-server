import { connectDB, UserModel, ProfileModel } from '../src/models/index.js';
import argon2 from 'argon2';
import dotenv from 'dotenv';

dotenv.config();

const indianCities = [
    { city: 'Mumbai', country: 'India' },
    { city: 'Bangalore', country: 'India' },
    { city: 'Delhi', country: 'India' },
    { city: 'Hyderabad', country: 'India' },
    { city: 'Pune', country: 'India' },
    { city: 'Chennai', country: 'India' },
    { city: 'Kolkata', country: 'India' },
    { city: 'Ahmedabad', country: 'India' },
    { city: 'Gurgaon', country: 'India' },
    { city: 'Noida', country: 'India' },
];

const techStacks = [
    ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    ['Angular', 'Java', 'Spring Boot', 'MySQL'],
    ['Vue.js', 'Python', 'Django', 'PostgreSQL'],
    ['React Native', 'Firebase', 'JavaScript'],
    ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma'],
    ['Flutter', 'Dart', 'Firebase'],
    ['Python', 'FastAPI', 'Redis', 'Docker'],
    ['Go', 'Kubernetes', 'PostgreSQL'],
    ['Rust', 'WebAssembly', 'Actix'],
    ['PHP', 'Laravel', 'MySQL', 'Redis'],
];

const hobbies = [
    ['cricket', 'photography', 'traveling'],
    ['cooking', 'reading', 'music'],
    ['gaming', 'coding', 'anime'],
    ['hiking', 'yoga', 'meditation'],
    ['dancing', 'painting', 'blogging'],
    ['cricket', 'movies', 'cooking'],
    ['photography', 'trekking', 'music'],
    ['reading', 'writing', 'tea-tasting'],
    ['fitness', 'cycling', 'cooking'],
    ['gaming', 'cricket', 'traveling'],
];

const interests = [
    ['AI', 'Machine Learning', 'Open Source'],
    ['Web3', 'Blockchain', 'DeFi'],
    ['Mobile Development', 'UI/UX', 'Design'],
    ['DevOps', 'Cloud Computing', 'AWS'],
    ['Startups', 'Entrepreneurship', 'SaaS'],
    ['Data Science', 'Analytics', 'Python'],
    ['Cybersecurity', 'Ethical Hacking', 'Privacy'],
    ['IoT', 'Robotics', 'Hardware'],
    ['Game Development', 'Unity', '3D Modeling'],
    ['Open Source', 'Linux', 'Automation'],
];

const companies = [
    'Google India', 'Microsoft India', 'Amazon India', 'Flipkart',
    'Paytm', 'Zomato', 'Swiggy', 'PhonePe', 'CRED', 'Razorpay',
    'Freshworks', 'Zoho', 'InfoEdge', 'MakeMyTrip', 'OYO',
];

const jobTitles = [
    'Software Engineer', 'Senior Software Engineer', 'Full Stack Developer',
    'Backend Developer', 'Frontend Developer', 'DevOps Engineer',
    'Data Scientist', 'Product Manager', 'Engineering Manager',
    'Tech Lead', 'Mobile Developer', 'QA Engineer',
];

// 14 dating profiles + 16 other intents
const profiles = [
    // Dating Profiles (14)
    {
        username: 'priya_dev',
        email: 'priya.sharma@example.com',
        fullName: 'Priya Sharma',
        age: 26,
        gender: 'female',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'straight',
        interestedIn: ['male'],
        ageRangeMin: 25,
        ageRangeMax: 32,
        bio: 'Full-stack developer who loves chai and code. Looking for someone who appreciates both tech and Bollywood!',
        github: 'Sameer-Bagul',
    },
    {
        username: 'rahul_coder',
        email: 'rahul.verma@example.com',
        fullName: 'Rahul Verma',
        age: 28,
        gender: 'male',
        intent: 'dating',
        lookingFor: 'dating',
        orientation: 'straight',
        interestedIn: ['female'],
        ageRangeMin: 24,
        ageRangeMax: 30,
        bio: 'Software engineer at a startup. Cricket enthusiast and coffee lover. Let\'s debug life together!',
    },
    {
        username: 'aisha_tech',
        email: 'aisha.khan@example.com',
        fullName: 'Aisha Khan',
        age: 25,
        gender: 'female',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'bisexual',
        interestedIn: ['male', 'female'],
        ageRangeMin: 23,
        ageRangeMax: 29,
        bio: 'Backend engineer obsessed with microservices. Love traveling and trying new cuisines!',
    },
    {
        username: 'arjun_dev',
        email: 'arjun.patel@example.com',
        fullName: 'Arjun Patel',
        age: 30,
        gender: 'male',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'straight',
        interestedIn: ['female'],
        ageRangeMin: 26,
        ageRangeMax: 33,
        bio: 'Tech lead who believes in clean code and good food. Gujarati roots, global mindset.',
    },
    {
        username: 'sneha_codes',
        email: 'sneha.reddy@example.com',
        fullName: 'Sneha Reddy',
        age: 27,
        gender: 'female',
        intent: 'dating',
        lookingFor: 'dating',
        orientation: 'straight',
        interestedIn: ['male'],
        ageRangeMin: 26,
        ageRangeMax: 35,
        bio: 'React developer by day, biryani enthusiast by night. Hyderabad-based techie!',
        github: 'gaearon', // Dan Abramov
    },
    {
        username: 'vikram_bytes',
        email: 'vikram.singh@example.com',
        fullName: 'Vikram Singh',
        age: 29,
        gender: 'male',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'straight',
        interestedIn: ['female'],
        ageRangeMin: 25,
        ageRangeMax: 32,
        bio: 'DevOps engineer who automates everything except feelings. Love trekking in Himalayas!',
        github: 'torvalds', // Linus Torvalds
    },
    {
        username: 'kavya_dev',
        email: 'kavya.iyer@example.com',
        fullName: 'Kavya Iyer',
        age: 24,
        gender: 'female',
        intent: 'dating',
        lookingFor: 'friendship',
        orientation: 'straight',
        interestedIn: ['male'],
        ageRangeMin: 23,
        ageRangeMax: 28,
        bio: 'Frontend developer from Chennai. Classical dancer and code writer. Best of both worlds!',
    },
    {
        username: 'rohan_tech',
        email: 'rohan.mehta@example.com',
        fullName: 'Rohan Mehta',
        age: 31,
        gender: 'male',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'straight',
        interestedIn: ['female'],
        ageRangeMin: 27,
        ageRangeMax: 34,
        bio: 'Engineering manager with a passion for mentoring. Love photography and street food!',
    },
    {
        username: 'ananya_dev',
        email: 'ananya.gupta@example.com',
        fullName: 'Ananya Gupta',
        age: 26,
        gender: 'female',
        intent: 'dating',
        lookingFor: 'dating',
        orientation: 'lesbian',
        interestedIn: ['female'],
        ageRangeMin: 24,
        ageRanageMax: 30,
        bio: 'Mobile developer building the future. Delhi girl with big dreams and bigger heart!',
    },
    {
        username: 'karthik_coder',
        email: 'karthik.raj@example.com',
        fullName: 'Karthik Raj',
        age: 28,
        gender: 'male',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'straight',
        interestedIn: ['female'],
        ageRangeMin: 24,
        ageRangeMax: 30,
        bio: 'Backend wizard from Bangalore. Coffee addict and weekend hacker. Let\'s build something together!',
        github: 'sindresorhus', // Sindre Sorhus
    },
    {
        username: 'meera_tech',
        email: 'meera.nair@example.com',
        fullName: 'Meera Nair',
        age: 25,
        gender: 'female',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'straight',
        interestedIn: ['male'],
        ageRangeMin: 25,
        ageRangeMax: 31,
        bio: 'Data scientist who finds patterns in everything. Kerala beauty with a tech mind!',
    },
    {
        username: 'amit_dev',
        email: 'amit.joshi@example.com',
        fullName: 'Amit Joshi',
        age: 32,
        gender: 'male',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'straight',
        interestedIn: ['female'],
        ageRangeMin: 28,
        ageRangeMax: 35,
        bio: 'Senior engineer building scalable systems. Love mountains, music, and meaningful conversations.',
    },
    {
        username: 'riya_codes',
        email: 'riya.das@example.com',
        fullName: 'Riya Das',
        age: 27,
        gender: 'female',
        intent: 'dating',
        lookingFor: 'dating',
        orientation: 'bisexual',
        interestedIn: ['male', 'female'],
        ageRangeMin: 25,
        ageRangeMax: 32,
        bio: 'Full-stack developer from Kolkata. Rossogolla lover and tech explorer. Swipe right for Bengali cuisine!',
    },
    {
        username: 'siddharth_dev',
        email: 'siddharth.bose@example.com',
        fullName: 'Siddharth Bose',
        age: 29,
        gender: 'male',
        intent: 'dating',
        lookingFor: 'relationship',
        orientation: 'straight',
        interestedIn: ['female'],
        ageRangeMin: 26,
        ageRangeMax: 32,
        bio: 'Cloud architect who dreams in Kubernetes. Fitness freak and tech geek looking for a partner in crime!',
    },

    // Other Intents (16)
    {
        username: 'harsh_startup',
        email: 'harsh.agarwal@example.com',
        fullName: 'Harsh Agarwal',
        age: 30,
        gender: 'male',
        intent: 'startup',
        bio: 'Building the next big thing in fintech. Looking for co-founders and early team members!',
    },
    {
        username: 'pooja_collab',
        email: 'pooja.mishra@example.com',
        fullName: 'Pooja Mishra',
        age: 28,
        gender: 'female',
        intent: 'collab',
        bio: 'Open source enthusiast. Let\'s collaborate on meaningful projects that make a difference!',
    },
    {
        username: 'nikhil_mentor',
        email: 'nikhil.saxena@example.com',
        fullName: 'Nikhil Saxena',
        age: 35,
        gender: 'male',
        intent: 'mentorship',
        bio: 'Senior architect with 12 years experience. Happy to mentor aspiring developers!',
    },
    {
        username: 'ishita_friend',
        email: 'ishita.kapoor@example.com',
        fullName: 'Ishita Kapoor',
        age: 24,
        gender: 'female',
        intent: 'friends',
        bio: 'New to Pune, looking to make developer friends and explore the city together!',
    },
    {
        username: 'varun_startup',
        email: 'varun.malhotra@example.com',
        fullName: 'Varun Malhotra',
        age: 29,
        gender: 'male',
        intent: 'startup',
        bio: 'Ex-Flipkart engineer building an AI-powered EdTech platform. Seeking technical co-founder!',
    },
    {
        username: 'divya_collab',
        email: 'divya.pillai@example.com',
        fullName: 'Divya Pillai',
        age: 26,
        gender: 'female',
        intent: 'collab',
        bio: 'UI/UX designer who codes. Let\'s build beautiful and functional products together!',
    },
    {
        username: 'aman_mentor',
        email: 'aman.chawla@example.com',
        fullName: 'Aman Chawla',
        age: 33,
        gender: 'male',
        intent: 'mentorship',
        bio: 'Engineering manager at Google. Passionate about helping juniors grow their careers.',
    },
    {
        username: 'nidhi_friend',
        email: 'nidhi.rao@example.com',
        fullName: 'Nidhi Rao',
        age: 25,
        gender: 'female',
        intent: 'friends',
        bio: 'Backend developer who loves hackathons. Looking for coding buddies in Bangalore!',
    },
    {
        username: 'gaurav_startup',
        email: 'gaurav.kumar@example.com',
        fullName: 'Gaurav Kumar',
        age: 31,
        gender: 'male',
        intent: 'startup',
        bio: 'Serial entrepreneur in B2B SaaS space. Always looking for talented builders!',
    },
    {
        username: 'shruti_collab',
        email: 'shruti.bajaj@example.com',
        fullName: 'Shruti Bajaj',
        age: 27,
        gender: 'female',
        intent: 'collab',
        bio: 'DevOps engineer interested in sustainability tech. Let\'s build green solutions!',
    },
    {
        username: 'rajat_mentor',
        email: 'rajat.bhatt@example.com',
        fullName: 'Rajat Bhatt',
        age: 36,
        gender: 'male',
        intent: 'mentorship',
        bio: 'CTO with startup experience. Mentoring next-gen tech leaders and founders.',
    },
    {
        username: 'tanvi_friend',
        email: 'tanvi.singh@example.com',
        fullName: 'Tanvi Singh',
        age: 23,
        gender: 'female',
        intent: 'friends',
        bio: 'Fresh grad at Microsoft. Looking to expand my developer network in Hyderabad!',
    },
    {
        username: 'aditya_startup',
        email: 'aditya.gupta@example.com',
        fullName: 'Aditya Gupta',
        age: 28,
        gender: 'male',
        intent: 'startup',
        bio: 'Building India\'s first decentralized social network. Join the revolution!',
    },
    {
        username: 'preeti_collab',
        email: 'preeti.menon@example.com',
        fullName: 'Preeti Menon',
        age: 29,
        gender: 'female',
        intent: 'collab',
        bio: 'ML engineer working on healthcare AI. Looking for collaborators on impactful projects!',
    },
    {
        username: 'vishal_mentor',
        email: 'vishal.pandey@example.com',
        fullName: 'Vishal Pandey',
        age: 34,
        gender: 'male',
        intent: 'mentorship',
        bio: 'Principal engineer specializing in distributed systems. Love teaching and mentoring!',
    },
    {
        username: 'sakshi_friend',
        email: 'sakshi.jain@example.com',
        fullName: 'Sakshi Jain',
        age: 26,
        gender: 'female',
        intent: 'friends',
        bio: 'Frontend developer and tech blogger. Always up for coffee and code discussions!',
    },
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function seedProfiles() {
    try {
        console.log('🔌 Connecting to database...');
        const mongoUrl = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/hackmate';
        await connectDB(mongoUrl);

        console.log('🧹 Cleaning up existing test users...');
        const testUsernames = profiles.map(p => p.username);
        await UserModel.deleteMany({ username: { $in: testUsernames } });
        await ProfileModel.deleteMany({
            userId: {
                $in: await UserModel.find({ username: { $in: testUsernames } }).distinct('_id')
            }
        });

        console.log(`\n👥 Creating 30 fake Indian profiles...\n`);

        const password = 'Password123'; // Same password for all test users
        const passwordHash = await argon2.hash(password);

        for (let i = 0; i < profiles.length; i++) {
            const profile = profiles[i];
            const location = getRandomItem(indianCities);
            const stack = getRandomItem(techStacks);
            const hobby = getRandomItem(hobbies);
            const interest = getRandomItem(interests);
            const company = getRandomItem(companies);
            const jobTitle = getRandomItem(jobTitles);

            // Create user
            const user = await UserModel.create({
                username: profile.username,
                email: profile.email,
                passwordHash,
                isVerified: true, // Auto-verify for testing
            });

            // Create profile
            const profileData: any = {
                userId: user._id,
                fullName: profile.fullName,
                bio: profile.bio,
                intent: profile.intent,
                stack,
                city: location.city,
                country: location.country,
                location: `${location.city}, ${location.country}`,
                hobbies: hobby,
                interests: interest,
                company,
                jobTitle,
                yearsOfExperience: Math.floor(Math.random() * 10) + 1,
                github: (profile as any).github || `${profile.username.replace('_', '')}${Math.floor(Math.random() * 999)}`,
            };

            // Add age and gender if available
            if (profile.age) {
                profileData.age = profile.age;
                profileData.gender = profile.gender;
            } else {
                // Random age and gender for non-dating profiles
                profileData.age = Math.floor(Math.random() * 15) + 22; // 22-37
                profileData.gender = Math.random() > 0.5 ? 'male' : 'female';
            }

            // Add dating-specific fields
            if (profile.intent === 'dating') {
                profileData.lookingFor = profile.lookingFor;
                profileData.orientation = profile.orientation;
                profileData.interestedIn = profile.interestedIn;
                profileData.ageRangeMin = profile.ageRangeMin;
                profileData.ageRangeMax = profile.ageRangeMax || profile.ageRangeMax;
            }

            await ProfileModel.create(profileData);

            const icon = profile.intent === 'dating' ? '💘' :
                profile.intent === 'startup' ? '🚀' :
                    profile.intent === 'collab' ? '🤝' :
                        profile.intent === 'mentorship' ? '🎓' : '👥';

            console.log(`${icon} Created: ${profile.fullName} (@${profile.username}) - ${profile.intent} - ${location.city}`);
        }

        console.log(`\n✅ Successfully created 30 profiles!`);
        console.log(`\n📊 Breakdown:`);
        console.log(`   💘 Dating: 14 profiles`);
        console.log(`   🚀 Startup: 4 profiles`);
        console.log(`   🤝 Collab: 4 profiles`);
        console.log(`   🎓 Mentorship: 4 profiles`);
        console.log(`   👥 Friends: 4 profiles`);
        console.log(`\n🔑 All accounts use password: "${password}"`);
        console.log(`\n💡 Try logging in with any username, e.g.:`);
        console.log(`   Username: priya_dev`);
        console.log(`   Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding profiles:', error);
        process.exit(1);
    }
}

seedProfiles();
