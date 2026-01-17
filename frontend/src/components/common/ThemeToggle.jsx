import { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import ThemeContext from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover-bg-transition focus-outline-none"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <Moon size={20} className="text-secondary" />
            ) : (
                <Sun size={20} className="text-yellow-400" />
            )}
        </button>
    );
};

export default ThemeToggle;
