
import React, { useContext } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';

interface ThemeSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const colors = [
    { name: 'Gold (Default)', hex: '#C5A47E' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Rose', hex: '#F43F5E' },
    { name: 'Amber', hex: '#F59E0B' },
    { name: 'Violet', hex: '#8B5CF6' },
];

const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({ isOpen, onClose }) => {
    const { userTheme, setUserTheme } = useContext(DataContext);

    const handleModeChange = (mode: 'light' | 'dark') => {
        setUserTheme({ ...userTheme, mode });
    };

    const handleColorChange = (color: string) => {
        setUserTheme({ ...userTheme, primaryColor: color });
    };

    const resetTheme = () => {
        setUserTheme({ mode: 'dark', primaryColor: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-[var(--color-light-text)]">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-display font-bold text-[var(--color-primary)]">Appearance Settings</h2>
                </div>

                {/* Mode Toggle */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-muted-text)] mb-4">Theme Mode</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleModeChange('light')}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 ${
                                userTheme.mode === 'light' 
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' 
                                : 'border-gray-700 hover:border-gray-500 text-gray-400'
                            }`}
                        >
                            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="font-bold">Light</span>
                        </button>
                        <button
                            onClick={() => handleModeChange('dark')}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 ${
                                userTheme.mode === 'dark' 
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' 
                                : 'border-gray-700 hover:border-gray-500 text-gray-400'
                            }`}
                        >
                            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            <span className="font-bold">Dark</span>
                        </button>
                    </div>
                </div>

                {/* Color Palette */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-muted-text)] mb-4">Accent Color</h3>
                    <div className="flex flex-wrap gap-4">
                        {colors.map((c) => (
                            <button
                                key={c.hex}
                                onClick={() => handleColorChange(c.hex)}
                                title={c.name}
                                className={`w-10 h-10 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ring-offset-[var(--color-light-bg)] ${
                                    (userTheme.primaryColor === c.hex || (!userTheme.primaryColor && c.hex === '#C5A47E')) 
                                    ? 'ring-[var(--color-light-text)] scale-110' 
                                    : 'ring-transparent'
                                }`}
                                style={{ backgroundColor: c.hex }}
                            ></button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-700 flex justify-end">
                    <button
                        onClick={resetTheme}
                        className="text-sm text-[var(--color-muted-text)] hover:text-red-400 transition-colors underline"
                    >
                        Reset to Default
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ThemeSettingsModal;
