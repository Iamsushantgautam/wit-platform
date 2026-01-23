import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { PromptCard } from '../components/public-profile';

const ProfilePrompts = ({ profile }) => {
    const [copiedId, setCopiedId] = useState(null);
    const mode = profile.publicPromptsDisplay || 'all';

    const customPrompts = (profile?.customItems?.filter(i => i && i.type === 'prompt' && i.visibility !== 'private') || []);
    // Ensure favoritesPrompts is an array of objects and filter out nulls
    const favoritePrompts = (profile?.favoritesPrompts || []).filter(p => p);
    // Ensure activeTools is an array of objects and filter out nulls
    const libraryPrompts = (profile?.activeTools?.filter(t => t && t.type === 'prompt') || []);

    const handleCopy = (text, prompt) => {
        navigator.clipboard.writeText(text);
        setCopiedId(prompt._id || prompt);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleShare = async (prompt) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: prompt.title || prompt.name,
                    text: prompt.prompt || prompt.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            handleCopy(prompt.prompt || prompt.description, prompt);
        }
    };

    // Determine visibility
    const showCustom = ['all', 'custom', 'custom_favorites', 'custom_library'].includes(mode);
    const showFavorites = ['all', 'favorites', 'custom_favorites'].includes(mode);
    const showLibrary = ['all', 'custom_library'].includes(mode);
    // Note: If 'custom_library' implies "Custom and Selected Library", we use activeTools.


    // Check if we have any prompts to show *based on settings*
    const hasVisiblePrompts = (showCustom && customPrompts.length > 0) ||
        (showFavorites && favoritePrompts.length > 0) ||
        (showLibrary && libraryPrompts.length > 0);

    if (!hasVisiblePrompts) {
        return (
            <div className="profile-empty-state">
                <MessageCircle size={48} className="profile-empty-icon" />
                <p className="profile-empty-text">No prompts visible</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* 1. Favorite Prompts Section (Carousel) */}
            {showFavorites && favoritePrompts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white px-1">Favorite Prompts</h3>
                    <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent -mx-2 px-2">
                        {favoritePrompts.map((prompt) => (
                            <div key={prompt._id} className="min-w-[calc((100%-1rem)/2)] w-[calc((100%-1rem)/2)] md:min-w-[320px] md:w-[320px] snap-center flex-shrink-0">
                                <PromptCard
                                    prompt={prompt}
                                    type="public"
                                    onCopy={handleCopy}
                                    onShare={handleShare}
                                    copiedId={copiedId}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Custom Prompts Section (Grid) */}
            {showCustom && customPrompts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white px-1">Created By {profile.name}</h3>
                    <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent -mx-2 px-2">
                        {customPrompts.map((prompt, idx) => (
                            <div key={prompt._id} className="min-w-[calc((100%-1rem)/2)] w-[calc((100%-1rem)/2)] md:min-w-[320px] md:w-[320px] snap-center flex-shrink-0">
                                <PromptCard
                                    key={`custom-${idx}`}
                                    prompt={prompt}
                                    type="public"
                                    onCopy={handleCopy}
                                    onShare={handleShare}
                                    copiedId={copiedId}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Library/Selected Prompts Section (Grid) */}
            {showLibrary && libraryPrompts.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white px-1">Curated Collection</h3>
                    <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent -mx-2 px-2">
                        {libraryPrompts.map((prompt) => (
                            <div key={prompt._id} className="min-w-[calc((100%-1rem)/2)] w-[calc((100%-1rem)/2)] md:min-w-[320px] md:w-[320px] snap-center flex-shrink-0">
                                <PromptCard
                                    key={prompt._id}
                                    prompt={prompt}
                                    type="public"
                                    onCopy={handleCopy}
                                    onShare={handleShare}
                                    copiedId={copiedId}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePrompts;
