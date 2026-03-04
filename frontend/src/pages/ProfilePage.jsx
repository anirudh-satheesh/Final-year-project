import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import {
    COUNTRIES,
    INDIAN_STATES,
    DEGREES,
    FIELDS_OF_STUDY,
    JOB_ROLES,
} from '../utils/profileSuggestions';

// ── Suggestion datasets ──
const SKILL_SUGGESTIONS = [
    'Python', 'Python3', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell', 'Lua',
    'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'SASS', 'GraphQL', 'REST APIs',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins', 'CI/CD',
    'Git', 'GitHub', 'GitLab', 'Linux', 'Bash', 'PowerShell',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch', 'Scikit-learn',
    'Data Analysis', 'Data Visualization', 'Pandas', 'NumPy', 'Tableau', 'Power BI',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design',
    'Agile', 'Scrum', 'JIRA', 'Confluence', 'Project Management',
    'Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Cryptography',
    'Blockchain', 'Solidity', 'Web3', 'Smart Contracts',
    'React Native', 'Flutter', 'Android Development', 'iOS Development',
    'Unity', 'Unreal Engine', 'Game Development', 'Blender', '3D Modeling',
    'Arduino', 'Raspberry Pi', 'IoT', 'Embedded Systems',
    'Communication', 'Leadership', 'Problem Solving', 'Critical Thinking', 'Team Collaboration',
    'Technical Writing', 'Public Speaking', 'Time Management'
];

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

// ── Reusable Tag Input with Dropdown ──
const TagInputWithDropdown = ({ label, suggestions, items, setItems, placeholder, showProficiency = false }) => {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Intermediate');
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const filtered = suggestions.filter(s =>
        s.toLowerCase().includes(query.toLowerCase()) &&
        !items.some(item => (typeof item === 'string' ? item : item.name) === s)
    ).slice(0, 8);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addItem = (name) => {
        if (showProficiency) {
            setItems([...items, { name, level: selectedLevel }]);
        } else {
            setItems([...items, name]);
        }
        setQuery('');
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateLevel = (index, level) => {
        const updated = [...items];
        updated[index] = { ...updated[index], level };
        setItems(updated);
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
            case 'Intermediate': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
            case 'Advanced': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
            case 'Expert': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
            default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>

            {/* Tags Display */}
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => {
                        const name = typeof item === 'string' ? item : item.name;
                        const level = typeof item === 'string' ? null : item.level;
                        return (
                            <div key={idx} className="group flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 animate-in fade-in zoom-in duration-200">
                                <span className="text-xs font-bold text-zinc-200">{name}</span>
                                {showProficiency && level && (
                                    <select
                                        value={level}
                                        onChange={(e) => updateLevel(idx, e.target.value)}
                                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border cursor-pointer appearance-none text-center ${getLevelColor(level)} bg-transparent`}
                                    >
                                        {PROFICIENCY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                )}
                                <button
                                    onClick={() => removeItem(idx)}
                                    className="ml-1 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Input + Dropdown */}
            <div className="relative">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder={placeholder}
                        className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    {showProficiency && (
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-3 text-xs font-bold text-zinc-400 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                        >
                            {PROFICIENCY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    )}
                </div>

                {showDropdown && query.length > 0 && filtered.length > 0 && (
                    <div ref={dropdownRef} className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        {filtered.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => addItem(suggestion)}
                                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl transition-all flex items-center justify-between"
                            >
                                <span>{suggestion}</span>
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Add</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Stable Input Components (defined outside ProfilePage to avoid remount on every keystroke) ──
const InputField = ({ label, field, type = 'text', placeholder, disabled, profile, updateField, isEditing }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
        <input
            type={type}
            value={profile[field] || ''}
            onChange={(e) => updateField(field, e.target.value)}
            disabled={!isEditing || disabled}
            placeholder={placeholder}
            className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all ${!isEditing ? 'opacity-70 cursor-default' : ''}`}
        />
    </div>
);

const TextAreaField = ({ label, field, placeholder, rows = 3, profile, updateField, isEditing }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
        <textarea
            value={profile[field] || ''}
            onChange={(e) => updateField(field, e.target.value)}
            disabled={!isEditing}
            placeholder={placeholder}
            rows={rows}
            className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none ${!isEditing ? 'opacity-70 cursor-default' : ''}`}
        />
    </div>
);

const SelectField = ({ label, field, options, placeholder, profile, updateField, isEditing }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
        <select
            value={profile[field] || ''}
            onChange={(e) => updateField(field, e.target.value)}
            disabled={!isEditing}
            className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer ${!isEditing ? 'opacity-70 cursor-default' : ''} ${!profile[field] ? 'text-zinc-600' : ''}`}
        >
            <option value="" className="text-zinc-600">{placeholder}</option>
            {options.map(o => <option key={o} value={o} className="text-white bg-zinc-900">{o}</option>)}
        </select>
    </div>
);

const DisplayField = ({ label, value, placeholder = 'Not specified' }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{label}</label>
        <p className={`text-sm font-medium ${value ? 'text-zinc-200' : 'text-zinc-700 italic'}`}>
            {value || placeholder}
        </p>
    </div>
);

const AutocompleteField = ({ label, field, suggestions, placeholder, profile, updateField, isEditing }) => {
    const [query, setQuery] = useState(profile[field] || '');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const filtered = suggestions.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    const isValid = suggestions.includes(profile[field]);

    useEffect(() => {
        setQuery(profile[field] || '');
    }, [profile, field]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        updateField(field, val);
        setQuery(val);
        setShowDropdown(false);
    };

    return (
        <div className="space-y-2 relative">
            <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] flex justify-between">
                {label}
                {isEditing && profile[field] && (
                    <span className={`text-[10px] lowercase italic ${isValid ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isValid ? 'valid' : 'invalid selection'}
                    </span>
                )}
            </label>
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    updateField(field, e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => isEditing && setShowDropdown(true)}
                disabled={!isEditing}
                placeholder={placeholder}
                className={`w-full bg-zinc-900/60 border ${isValid ? 'border-zinc-800' : (profile[field] && isEditing ? 'border-rose-500/30' : 'border-zinc-800')} rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all ${!isEditing ? 'opacity-70 cursor-default' : ''}`}
            />
            {isEditing && showDropdown && query.length > 0 && filtered.length > 0 && (
                <div ref={dropdownRef} className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 max-h-64 overflow-y-auto">
                    {filtered.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSelect(s)}
                            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Default Profile Shape ──
const DEFAULT_PROFILE = {
    fullName: '',
    dateOfBirth: '',
    professionalStatus: '',
    state: '',
    country: '',
    degree: '',
    fieldOfStudy: '',
    designation: '',
    yearsOfExperience: '',
    careerGoals: '',
    skills: [],
    githubLink: '',
    portfolioLink: '',
    linkedinLink: '',
    bio: '',
};

// ── Main Component ──
const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, loginWithGoogle, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [saveStatus, setSaveStatus] = useState(null);
    const [activeSection, setActiveSection] = useState('personal');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`strive_profile_${user.uid}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                setProfile({ ...DEFAULT_PROFILE, ...parsed });
                setShowOnboarding(false);

                // Show update popup if profile is incomplete
                setTimeout(() => {
                    if (completionPercent(parsed) < 100) {
                        setShowUpdatePopup(true);
                    }
                }, 1000);
            } else {
                setProfile(prev => ({
                    ...prev,
                    fullName: user.displayName || '',
                }));
                setShowOnboarding(true);
            }
        }
    }, [user]);

    const handleOnboardingComplete = () => {
        if (user) {
            localStorage.setItem(`strive_profile_${user.uid}`, JSON.stringify(profile));
            setShowOnboarding(false);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(null), 2500);
        }
    };

    const handleSave = () => {
        if (user) {
            localStorage.setItem(`strive_profile_${user.uid}`, JSON.stringify(profile));
            setSaveStatus('saved');
            setIsEditing(false);
            setTimeout(() => setSaveStatus(null), 2500);
        }
    };

    const updateField = (field, value) => {
        setProfile(prev => {
            const updated = { ...prev, [field]: value };
            // Auto-select Country if an Indian state is selected
            if (field === 'state' && INDIAN_STATES.includes(value)) {
                updated.country = 'India';
            }
            return updated;
        });
    };

    const sections = [
        { id: 'personal', label: 'Personal', icon: '👤' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'career', label: 'Career', icon: '💼' },
        { id: 'skills', label: 'Skills', icon: '⚡' },
        { id: 'links', label: 'Links', icon: '🔗' },
    ];

    const sectionRefs = {
        personal: useRef(null),
        education: useRef(null),
        career: useRef(null),
        skills: useRef(null),
        links: useRef(null),
    };

    const scrollToSection = (id) => {
        sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(id);
    };

    // Shared props for field components
    const fieldProps = { profile, updateField, isEditing };
    const autocompleteProps = { ...fieldProps };

    // ── Auth Guard ──
    if (!user) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white/10 overflow-x-hidden relative flex flex-col">
                <div className="fixed inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>
                <Navbar />
                <main className="relative z-10 flex-grow flex items-center justify-center px-6">
                    <div className="max-w-md w-full bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/60 p-10 rounded-[2.5rem] text-center space-y-8 shadow-2xl">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center font-black text-black text-4xl mx-auto shadow-[0_0_50px_rgba(255,255,255,0.1)]">s.</div>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold tracking-tight text-white">Set up your profile.</h1>
                            <p className="text-zinc-500 text-lg leading-relaxed">Sign in to create and manage your learning profile.</p>
                        </div>
                        <button onClick={loginWithGoogle} className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.05)]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Continue with Google
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // ── Section Renderers ──
    const renderPersonal = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Full Name" field="fullName" placeholder="John Doe" {...fieldProps} />
                <InputField label="Date of Birth" field="dateOfBirth" type="date" {...fieldProps} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="Professional Status" field="professionalStatus" options={['Student', 'Working Professional', 'Freelancer', 'Career Changer', 'Other']} placeholder="Select status" {...fieldProps} />
                <AutocompleteField label="State / Province" field="state" suggestions={INDIAN_STATES} placeholder="e.g. Maharashtra" {...autocompleteProps} />
            </div>
            <AutocompleteField label="Country" field="country" suggestions={COUNTRIES} placeholder="e.g. India" {...autocompleteProps} />
            <TextAreaField label="Short Bio" field="bio" placeholder="Tell us a bit about yourself..." rows={3} {...fieldProps} />
        </div>
    );

    const renderEducation = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <AutocompleteField label="Degree" field="degree" suggestions={DEGREES} placeholder="e.g. B.Tech" {...autocompleteProps} />
            <AutocompleteField label="Field of Study" field="fieldOfStudy" suggestions={FIELDS_OF_STUDY} placeholder="e.g. Computer Science" {...autocompleteProps} />
        </div>
    );

    const renderCareer = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <AutocompleteField label="Current Designation / Role" field="designation" suggestions={JOB_ROLES} placeholder="e.g. Software Engineer" {...autocompleteProps} />
            <SelectField label="Years of Experience" field="yearsOfExperience" options={['0 (Fresher)', '1-2 years', '3-5 years', '5-8 years', '8-12 years', '12+ years']} placeholder="Select experience" {...fieldProps} />
            <TextAreaField label="Career Goals & Interests" field="careerGoals" placeholder="What do you want to achieve? e.g. Transition to ML engineering, land a FAANG role..." rows={4} {...fieldProps} />
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-8 animate-in fade-in duration-300">
            <TagInputWithDropdown
                label="Skills (Optional)"
                suggestions={SKILL_SUGGESTIONS}
                items={profile.skills}
                setItems={(val) => updateField('skills', val)}
                placeholder="Type a skill, e.g. Python..."
                showProficiency={true}
            />
        </div>
    );


    const renderLinks = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <InputField label="GitHub Profile" field="githubLink" placeholder="https://github.com/username" {...fieldProps} />
            <InputField label="Portfolio / Website" field="portfolioLink" placeholder="https://yourportfolio.com" {...fieldProps} />
            <InputField label="LinkedIn Profile" field="linkedinLink" placeholder="https://linkedin.com/in/username" {...fieldProps} />
        </div>
    );

    // ── View Mode Renderers ──
    const renderPersonalView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <DisplayField label="Full Name" value={profile.fullName} />
            <DisplayField label="Date of Birth" value={profile.dateOfBirth} />
            <DisplayField label="Professional Status" value={profile.professionalStatus} />
            <DisplayField label="Location" value={`${profile.state ? profile.state + ', ' : ''}${profile.country || ''}`} />
            <div className="md:col-span-2">
                <DisplayField label="Short Bio" value={profile.bio} />
            </div>
        </div>
    );

    const renderEducationView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <DisplayField label="Degree" value={profile.degree} />
            <DisplayField label="Field of Study" value={profile.fieldOfStudy} />
            <div className="md:col-span-2">
                <DisplayField label="Institution" value={profile.institution} />
            </div>
        </div>
    );

    const renderCareerView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <DisplayField label="Current Designation" value={profile.designation} />
            <DisplayField label="Experience" value={profile.yearsOfExperience} />
            <DisplayField label="Target Roles" value={profile.targetRoles} />
            <div className="md:col-span-2">
                <DisplayField label="Career Goals & Interests" value={profile.careerGoals} />
            </div>
        </div>
    );

    const renderSkillsView = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-4">Core Skills</label>
                <div className="flex flex-wrap gap-3">
                    {profile.skills.length > 0 ? profile.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl">
                            <span className="text-sm font-bold text-zinc-200">{skill.name}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${skill.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                skill.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                    skill.level === 'Advanced' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                }`}>{skill.level}</span>
                        </div>
                    )) : <p className="text-sm italic text-zinc-700">No skills added yet</p>}
                </div>
            </div>
        </div>
    );


    const renderLinksView = () => (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500">
            {profile.githubLink && (
                <a href={profile.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 p-4 rounded-2xl transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </div>
                    <div>
                        <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">GitHub</p>
                        <p className="text-sm font-bold text-zinc-200">{profile.githubLink.replace('https://', '')}</p>
                    </div>
                </a>
            )}
            {profile.linkedinLink && (
                <a href={profile.linkedinLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 p-4 rounded-2xl transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </div>
                    <div>
                        <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">LinkedIn</p>
                        <p className="text-sm font-bold text-zinc-200">{profile.linkedinLink.replace('https://', '')}</p>
                    </div>
                </a>
            )}
            {profile.portfolioLink && (
                <a href={profile.portfolioLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 p-4 rounded-2xl transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                    <div>
                        <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Portfolio</p>
                        <p className="text-sm font-bold text-zinc-200">{profile.portfolioLink.replace('https://', '')}</p>
                    </div>
                </a>
            )}
            {!profile.githubLink && !profile.linkedinLink && !profile.portfolioLink && (
                <p className="text-sm italic text-zinc-700">No links provided</p>
            )}
        </div>
    );

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'personal': return renderPersonal();
            case 'education': return renderEducation();
            case 'career': return renderCareer();
            case 'skills': return renderSkills();
            case 'links': return renderLinks();
            default: return renderPersonal();
        }
    };

    const completionPercent = (p = profile) => {
        const validatedFields = {
            state: INDIAN_STATES,
            country: COUNTRIES,
            degree: DEGREES,
            fieldOfStudy: FIELDS_OF_STUDY,
            designation: JOB_ROLES,
        };

        const freeFields = ['fullName', 'dateOfBirth', 'professionalStatus', 'careerGoals'];

        let filledCount = 0;
        const totalFields = Object.keys(validatedFields).length + freeFields.length + 1; // +1 for skills

        // Check validated fields
        Object.entries(validatedFields).forEach(([field, suggestions]) => {
            if (p[field] && suggestions.includes(p[field])) {
                filledCount++;
            }
        });

        // Check free fields
        freeFields.forEach(field => {
            if (p[field] && p[field]?.length > 0) {
                filledCount++;
            }
        });

        const hasSkills = p.skills?.length > 0 ? 1 : 0;
        filledCount += hasSkills;

        return Math.round((filledCount / totalFields) * 100);
    };

    const renderUpdateToast = () => (
        <div className="fixed top-24 right-6 z-[100] w-[340px] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right-8 duration-500">
            <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Reminder</span>
                    </div>
                    <button
                        onClick={() => setShowUpdatePopup(false)}
                        className="p-1 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-all text-xs"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">Profile Incomplete</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">Your profile is {completionPercent()}% complete. Please update your details.</p>
                </div>

                <button
                    onClick={() => {
                        setIsEditing(true);
                        setShowUpdatePopup(false);
                    }}
                    className="w-full py-2.5 bg-white text-black font-black uppercase tracking-[0.2em] text-[9px] rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5"
                >
                    Update Now
                </button>
            </div>

            {/* Timer Progress Bar */}
            <div className="h-1 w-full bg-white/5">
                <div
                    className="h-full bg-blue-500 animate-[progress_5s_linear_forwards]"
                    onAnimationEnd={() => setShowUpdatePopup(false)}
                />
            </div>

            <style>{`
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );

    const renderOnboarding = () => (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="space-y-3 text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">🚀</div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Let's build your profile.</h1>
                    <p className="text-zinc-500">Tell us a bit about yourself to personalize your learning journey.</p>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-3">
                    {[1, 2, 3].map(step => (
                        <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${onboardingStep === step ? 'w-8 bg-blue-500' : 'w-2 bg-zinc-800'}`} />
                    ))}
                </div>

                <div className="min-h-[300px]">
                    {onboardingStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <InputField label="Full Name" field="fullName" placeholder="John Doe" profile={profile} updateField={updateField} isEditing={true} />
                            <SelectField label="Professional Status" field="professionalStatus" options={['Student', 'Working Professional', 'Freelancer', 'Career Changer', 'Other']} placeholder="Select status" profile={profile} updateField={updateField} isEditing={true} />
                            <div className="pt-6">
                                <button onClick={() => setOnboardingStep(2)} disabled={!profile.fullName || !profile.professionalStatus} className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none">Continue</button>
                            </div>
                        </div>
                    )}

                    {onboardingStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <AutocompleteField label="Degree" field="degree" suggestions={DEGREES} placeholder="e.g. B.Tech" profile={profile} updateField={updateField} isEditing={true} />
                            <AutocompleteField label="Field of Study" field="fieldOfStudy" suggestions={FIELDS_OF_STUDY} placeholder="e.g. Computer Science" profile={profile} updateField={updateField} isEditing={true} />
                            <div className="pt-6 flex gap-4">
                                <button onClick={() => setOnboardingStep(1)} className="flex-1 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:text-white transition-all">Back</button>
                                <button onClick={() => setOnboardingStep(3)} className="flex-[2] py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-200 transition-all active:scale-95">Next</button>
                            </div>
                        </div>
                    )}

                    {onboardingStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <TagInputWithDropdown
                                label="Core Skills"
                                suggestions={SKILL_SUGGESTIONS}
                                items={profile.skills}
                                setItems={(val) => updateField('skills', val)}
                                placeholder="e.g. Python, React..."
                                showProficiency={true}
                            />
                            <div className="pt-6 flex gap-4">
                                <button onClick={() => setOnboardingStep(2)} className="flex-1 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:text-white transition-all">Back</button>
                                <button onClick={handleOnboardingComplete} className="flex-[2] py-4 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-blue-500 transition-all active:scale-95 shadow-[0_20px_40px_rgba(37,99,235,0.2)]">Complete Setup</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (showOnboarding) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white/10 overflow-x-hidden relative flex flex-col">
                <div className="fixed inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>
                <Navbar />
                <main className="relative z-10 flex-grow flex items-center justify-center px-6">
                    {renderOnboarding()}
                </main>
                <footer className="py-12 border-t border-zinc-900 relative z-10 text-center">
                    <p className="text-xs font-black text-zinc-800 uppercase tracking-[0.4em]">Strive Learning Management System</p>
                </footer>
            </div>
        );
    }

    // ── Row component for view mode ──
    const Row = ({ label, value, href }) => (
        <div className="flex justify-between items-baseline py-3.5 border-b border-zinc-800/50 last:border-0">
            <span className="text-sm text-zinc-500 shrink-0 w-[160px]">{label}</span>
            {href && value ? (
                <a href={href} target="_blank" rel="noreferrer" className="text-sm text-zinc-300 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-400 text-right truncate ml-4">
                    {value}
                </a>
            ) : (
                <span className={`text-sm text-right truncate ml-4 ${value ? 'text-zinc-200' : 'text-zinc-700'}`}>
                    {value || '—'}
                </span>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
            <Navbar />

            <main className="max-w-[680px] mx-auto px-6 pt-16 pb-32">

                {/* ── Identity ── */}
                <header className="flex items-start justify-between gap-6 mb-14">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 shrink-0 ring-1 ring-zinc-800">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg font-medium text-zinc-500">
                                    {(profile.fullName || user.displayName || '?').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold text-white truncate">
                                {profile.fullName || user.displayName || 'Untitled'}
                            </h1>
                            <p className="text-[13px] text-zinc-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 pt-1">
                        {saveStatus === 'saved' && (
                            <span className="text-xs text-emerald-400 mr-1">Saved</span>
                        )}
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => { setIsEditing(false); if (user) { const s = localStorage.getItem(`strive_profile_${user.uid}`); if (s) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(s) }); } }}
                                    className="px-3.5 py-1.5 text-[13px] text-zinc-500 hover:text-white transition-colors rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-3.5 py-1.5 bg-white text-zinc-900 text-[13px] font-medium rounded-md hover:bg-zinc-200 transition-colors"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-3.5 py-1.5 text-[13px] text-zinc-500 border border-zinc-800 rounded-md hover:text-white hover:border-zinc-600 transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-3.5 py-1.5 text-[13px] text-zinc-600 border border-zinc-800 rounded-md hover:text-rose-400 hover:border-rose-500/30 transition-all"
                                >
                                    Log out
                                </button>
                            </>
                        )}
                    </div>
                </header>

                {isEditing ? (
                    /* ──────── EDIT MODE ──────── */
                    <div className="space-y-10">
                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-5">Personal</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Full Name" field="fullName" placeholder="John Doe" {...fieldProps} />
                                    <InputField label="Date of Birth" field="dateOfBirth" type="date" {...fieldProps} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <SelectField label="Status" field="professionalStatus" options={['Student', 'Working Professional', 'Freelancer', 'Career Changer', 'Other']} placeholder="Select" {...fieldProps} />
                                    <AutocompleteField label="Country" field="country" suggestions={COUNTRIES} placeholder="India" {...autocompleteProps} />
                                </div>
                                <AutocompleteField label="State" field="state" suggestions={INDIAN_STATES} placeholder="Maharashtra" {...autocompleteProps} />
                                <TextAreaField label="Bio" field="bio" placeholder="Write something about yourself..." rows={3} {...fieldProps} />
                            </div>
                        </section>

                        <hr className="border-zinc-800/50" />

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-5">Education</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <AutocompleteField label="Degree" field="degree" suggestions={DEGREES} placeholder="B.Tech" {...autocompleteProps} />
                                <AutocompleteField label="Field" field="fieldOfStudy" suggestions={FIELDS_OF_STUDY} placeholder="Computer Science" {...autocompleteProps} />
                            </div>
                        </section>

                        <hr className="border-zinc-800/50" />

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-5">Career</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <AutocompleteField label="Role" field="designation" suggestions={JOB_ROLES} placeholder="Software Engineer" {...autocompleteProps} />
                                    <SelectField label="Experience" field="yearsOfExperience" options={['0 (Fresher)', '1-2 years', '3-5 years', '5-8 years', '8-12 years', '12+ years']} placeholder="Select" {...fieldProps} />
                                </div>
                                <TextAreaField label="Goals" field="careerGoals" placeholder="Your career aspirations..." rows={3} {...fieldProps} />
                            </div>
                        </section>

                        <hr className="border-zinc-800/50" />

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-5">Skills</h2>
                            <TagInputWithDropdown
                                label=""
                                suggestions={SKILL_SUGGESTIONS}
                                items={profile.skills}
                                setItems={(val) => updateField('skills', val)}
                                placeholder="Search and add skills..."
                                showProficiency={true}
                            />
                        </section>

                        <hr className="border-zinc-800/50" />

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-5">Links</h2>
                            <div className="space-y-4">
                                <InputField label="GitHub" field="githubLink" placeholder="https://github.com/you" {...fieldProps} />
                                <InputField label="LinkedIn" field="linkedinLink" placeholder="https://linkedin.com/in/you" {...fieldProps} />
                                <InputField label="Portfolio" field="portfolioLink" placeholder="https://you.dev" {...fieldProps} />
                            </div>
                        </section>
                    </div>
                ) : (
                    /* ──────── VIEW MODE ──────── */
                    <div className="space-y-10">

                        {profile.bio && (
                            <p className="text-[15px] text-zinc-400 leading-relaxed">{profile.bio}</p>
                        )}

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1">Personal</h2>
                            <Row label="Name" value={profile.fullName} />
                            <Row label="Date of Birth" value={profile.dateOfBirth} />
                            <Row label="Status" value={profile.professionalStatus} />
                            <Row label="Location" value={[profile.state, profile.country].filter(Boolean).join(', ')} />
                        </section>

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1">Education</h2>
                            <Row label="Degree" value={profile.degree} />
                            <Row label="Field" value={profile.fieldOfStudy} />
                        </section>

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1">Career</h2>
                            <Row label="Role" value={profile.designation} />
                            <Row label="Experience" value={profile.yearsOfExperience} />
                            <Row label="Goals" value={profile.careerGoals} />
                        </section>

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-3">Skills</h2>
                            {profile.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {profile.skills.map((skill, i) => (
                                        <span key={i} className="inline-flex items-center gap-1.5 text-[13px] text-zinc-300 bg-zinc-800/70 px-2.5 py-1 rounded-md">
                                            {skill.name}
                                            <span className={`text-[10px] ${skill.level === 'Beginner' ? 'text-emerald-500/60' :
                                                skill.level === 'Intermediate' ? 'text-blue-400/60' :
                                                    skill.level === 'Advanced' ? 'text-amber-400/60' : 'text-rose-400/60'
                                                }`}>· {skill.level}</span>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-700">None added</p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1">Links</h2>
                            <Row label="GitHub" value={profile.githubLink ? profile.githubLink.replace('https://', '') : null} href={profile.githubLink} />
                            <Row label="LinkedIn" value={profile.linkedinLink ? profile.linkedinLink.replace('https://', '') : null} href={profile.linkedinLink} />
                            <Row label="Portfolio" value={profile.portfolioLink ? profile.portfolioLink.replace('https://', '') : null} href={profile.portfolioLink} />
                        </section>

                    </div>
                )}
            </main>

            {showUpdatePopup && renderUpdateToast()}
        </div>
    );
};

export default ProfilePage;

