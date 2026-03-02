import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const categories = [
    {
        id: 'web-dev',
        title: 'Web Development',
        icon: '🌐',
        description: 'Master the art of building modern, responsive, and high-performance websites and web applications.',
        subtopics: [
            'HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
            'Tailwind CSS', 'Bootstrap', 'Next.js', 'Gatsby', 'GraphQL', 'RESTful APIs', 'Webpack', 'Babel', 'TypeScript', 'Redux'
        ]
    },
    {
        id: 'cloud-devops',
        title: 'Cloud & DevOps',
        icon: '☁️',
        description: 'Learn to deploy, scale, and manage infrastructure with cutting-edge cloud technologies and automation tools.',
        subtopics: [
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Ansible', 'CI/CD Pipelines', 'Linux Administration',
            'Shell Scripting', 'Nginx', 'Apache', 'Prometheus', 'Grafana', 'ELK Stack', 'Nagios', 'Git / GitHub', 'GitLab', 'CircleCI'
        ]
    },
    {
        id: 'ai',
        title: 'Artificial Intelligence',
        icon: '🧠',
        description: 'Explore the future with neural networks, natural language processing, and advanced AI architectures.',
        subtopics: [
            'Neural Networks', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Generative AI', 'GANs',
            'Transformers', 'BERT', 'GPT Models', 'Robotics', 'Expert Systems', 'Fuzzy Logic', 'Knowledge Representation',
            'Speech Recognition', 'AI Ethics', 'OpenAI API', 'Hugging Face', 'PyTorch', 'TensorFlow', 'Keras'
        ]
    },
    {
        id: 'ml',
        title: 'Machine Learning',
        icon: '🤖',
        description: 'Dive into algorithms that learn from data to make predictions and automated decisions.',
        subtopics: [
            'Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM', 'K-Means Clustering',
            'Principal Component Analysis (PCA)', 'Scikit-learn', 'Feature Engineering', 'Overfitting & Underfitting',
            'Gradient Descent', 'Cross-Validation', 'Bias-Variance Tradeoff', 'Hyperparameter Tuning', 'XGBoost',
            'LightGBM', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'
        ]
    },
    {
        id: 'data-science',
        title: 'Data Science',
        icon: '📊',
        description: 'Transform raw data into meaningful insights using statistical analysis and visualization.',
        subtopics: [
            'Data Visualization', 'Statistical Analysis', 'Hypothesis Testing', 'Big Data Technologies', 'Apache Spark',
            'Hadoop', 'SQL', 'NoSQL', 'Data Cleaning', 'Exploratory Data Analysis (EDA)', 'R Programming', 'Tableau',
            'Power BI', 'Data Wrangling', 'Predictive Modeling', 'Time Series Analysis', 'A/B Testing', 'Plotly',
            'Jupyter Notebooks', 'Data Pipelines'
        ]
    },
    {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        icon: '🛡️',
        description: 'Protect systems and networks from digital attacks with advanced security protocols and ethical hacking.',
        subtopics: [
            'Network Security', 'Ethical Hacking', 'Penetration Testing', 'Cryptography', 'Firewalls', 'SIEM', 'SOC Operations',
            'Malware Analysis', 'Phishing Prevention', 'Identity Access Management (IAM)', 'OWASP Top 10', 'Kali Linux',
            'Metasploit', 'Wireshark', 'Cloud Security', 'Endpoint Protection', 'Zero Trust Architecture', 'Risk Management',
            'Digital Forensics', 'Incident Response'
        ]
    },
    {
        id: 'mobile-dev',
        title: 'Mobile Development',
        icon: '📱',
        description: 'Create powerful applications for iOS and Android using native and cross-platform frameworks.',
        subtopics: [
            'React Native', 'Flutter', 'Swift', 'Kotlin', 'Objective-C', 'Java for Android', 'Xamarin', 'Ionic', 'PhoneGap',
            'App Store Optimization (ASO)', 'SQLite for Mobile', 'Firebase for Mobile', 'Push Notifications',
            'Mobile UI/UX Design', 'Gesture Handling', 'Core Animation', 'Google Play Console', 'App Store Connect',
            'Android Studio', 'Xcode'
        ]
    },
    {
        id: 'blockchain',
        title: 'Blockchain & Web3',
        icon: '⛓️',
        description: 'Build decentralized applications and understand the core principles of ledger technologies.',
        subtopics: [
            'Bitcoin Architecture', 'Ethereum', 'Smart Contracts', 'Solidity', 'Web3.js', 'Ethers.js', 'DeFi Protocols',
            'NFTs', 'IPFS', 'Hyperledger', 'Consensus Algorithms', 'Proof of Work (PoW)', 'Proof of Stake (PoS)',
            'DAO (Decentralized Autonomous Org)', 'Crypto Wallets', 'Metamask Integration', 'Truffle Suite', 'Hardhat',
            'Rust for Solana', 'Layer 2 Scaling'
        ]
    },
    {
        id: 'game-dev',
        title: 'Game Development',
        icon: '🎮',
        description: 'Develop immersive 2D and 3D games with physics, high-end graphics, and multiplayer logic.',
        subtopics: [
            'Unity Engine', 'Unreal Engine', 'C# for Unity', 'C++ for Unreal', 'Game Physics', '3D Modeling', 'Shaders',
            'Character Animation', 'Collision Detection', 'Audio Engineering', 'Multiplayer Logic', 'VR/AR Development',
            'Sprite Kit', 'Godot Engine', 'DirectX', 'OpenGL', 'Ray Tracing', 'Game Design Patterns', 'Level Design',
            'Character Design'
        ]
    },
    {
        id: 'embedded-iot',
        title: 'Embedded & IoT',
        icon: '🔌',
        description: 'Connect the physical world to the digital with microcontrollers, sensors, and hardware integration.',
        subtopics: [
            'Arduino', 'Raspberry Pi', 'Microcontrollers', 'RTOS', 'C/C++ for Embedded', 'Sensors Integration', 'Actuators',
            'MQTT Protocol', 'Zigbee', 'LoRaWAN', 'Bluetooth Low Energy (BLE)', 'Firmware Development', 'PCB Design',
            'ESP32', 'STM32', 'I2C Communication', 'SPI Protocol', 'UART', 'Hardware-Software Co-design', 'Edge Computing'
        ]
    }
];

const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-600/5 rounded-full blur-[100px]" />
    </div>
);

const ExplorePage = ({ setCurrentSubject }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    const handleTopicClick = (topic) => {
        setCurrentSubject(topic);
        navigate('/assessment');
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative font-sans selection:bg-white/10 overflow-x-hidden flex flex-col">
            <Background />
            <Navbar />

            <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto px-6 py-12 lg:py-20 flex flex-col gap-12 lg:gap-20">
                {/* Header Section */}
                <div className="flex flex-col gap-4 max-w-3xl animate-in fade-in slide-in-from-top-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] w-fit">
                        Explore Domains
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                        Choose your <br />
                        <span className="text-zinc-500 italic">architectural path.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Discover dozens of specializations and over 200 technical nodes. Select a topic to calibrate your skills and generate a high-end learning roadmap.
                    </p>
                </div>

                {/* Explorer Interface */}
                <div className="grid lg:grid-cols-[380px_1fr] gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">

                    {/* Sidebar: Categories */}
                    <div className="flex flex-col gap-2 bg-zinc-900/30 backdrop-blur-xl border border-white/5 p-4 rounded-3xl h-fit sticky top-24">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] px-4 py-2">Domains</p>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                                    ${selectedCategory.id === cat.id
                                        ? 'bg-white text-black shadow-2xl shadow-white/5'
                                        : 'text-zinc-500 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
                                    }`}
                            >
                                <span className="text-2xl">{cat.icon}</span>
                                <div className="flex flex-col items-start">
                                    <span className={`text-xs font-black uppercase tracking-widest ${selectedCategory.id === cat.id ? 'text-black' : 'text-zinc-200 group-hover:text-white'}`}>
                                        {cat.title}
                                    </span>
                                    <span className={`text-[9px] font-medium uppercase tracking-wider ${selectedCategory.id === cat.id ? 'text-black/60' : 'text-zinc-600'}`}>
                                        {cat.subtopics.length} Specializations
                                    </span>
                                </div>
                                {selectedCategory.id === cat.id && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black/20" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content: Subtopics Grid */}
                    <div className="flex flex-col gap-8">
                        {/* Selected Category Feature Card */}
                        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 lg:p-12 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">
                                {selectedCategory.icon}
                            </div>
                            <div className="relative z-10 space-y-4 max-w-2xl">
                                <h2 className="text-3xl font-bold text-white tracking-tight">{selectedCategory.title}</h2>
                                <p className="text-zinc-400 leading-relaxed text-lg">
                                    {selectedCategory.description}
                                </p>
                            </div>
                        </div>

                        {/* Specializations Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {selectedCategory.subtopics.map((topic, index) => (
                                <button
                                    key={topic}
                                    onClick={() => handleTopicClick(topic)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className="p-6 bg-zinc-900/20 hover:bg-zinc-900/50 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col items-start gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] group animate-in fade-in slide-in-from-bottom-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-600 uppercase group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors uppercase tracking-wider">{topic}</h3>
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400">Launch Track →</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Overlay */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-20" />
        </div>
    );
};

export default ExplorePage;
