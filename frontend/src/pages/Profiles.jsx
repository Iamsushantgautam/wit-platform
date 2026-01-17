import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, ArrowRight } from 'lucide-react';

const Profiles = () => {
    const { API_URL } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/profiles`);
                setProfiles(data);
            } catch (error) {
                console.error('Error fetching profiles', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, [API_URL]);

    return (
        <div className="min-h-screen pb-20">
            <div className="bg-secondary pt-20 pb-12 text-center">
                <div className="container">
                    <h1 className="hero-title text-4xl mb-4">Meet the <span className="hero-highlight">Community</span></h1>
                    <p className="text-secondary text-lg max-w-2xl mx-auto">
                        Connect with talented creators, developers, and innovators building the future with AI.
                    </p>
                </div>
            </div>

            <div className="container mt-12">
                {loading ? (
                    <div className="text-center py-20 text-secondary">Loading community...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {profiles.map((profile) => (
                            <Link to={`/u/${profile.user.username}`} key={profile._id} className="card p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                                <div className="w-24 h-24 rounded-full border-4 border-bg-secondary overflow-hidden mb-4 shadow-md">
                                    {profile.image ? (
                                        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <User size={40} />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-primary-text mb-1">{profile.name}</h3>
                                <p className="text-primary text-sm font-medium mb-3">@{profile.user.username}</p>
                                <p className="text-secondary text-sm line-clamp-2 mb-4 h-10 w-full">
                                    {profile.bio || 'No bio available.'}
                                </p>
                                <span className="btn btn-sm btn-outline rounded-full text-xs mt-auto w-full flex justify-center">
                                    View Profile
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && profiles.length === 0 && (
                    <div className="text-center py-20 bg-secondary rounded-xl">
                        <p className="text-secondary text-lg">No active community members found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profiles;
