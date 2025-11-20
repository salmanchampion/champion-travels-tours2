
import React, { useState, ChangeEvent } from 'react';

interface AdminInputProps {
    label: string;
    name: string;
    value: any;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    className?: string;
}

export const AdminInput: React.FC<AdminInputProps> = ({ label, name, value, onChange, placeholder = '', type = 'text', className }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
    </div>
);

interface AdminTextareaProps {
    label: string;
    name: string;
    value: any;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    className?: string;
}

export const AdminTextarea: React.FC<AdminTextareaProps> = ({ label, name, value, onChange, rows = 3, className }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-[var(--color-muted-text)] mb-1">{label}</label>
        <textarea id={name} name={name} value={value || ''} onChange={onChange} rows={rows} className="w-full bg-[var(--color-dark-bg)] border border-gray-600 rounded-md py-2 px-3 text-[var(--color-light-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
    </div>
);

export const ToggleSwitch: React.FC<{
    label: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-light-text)]">{label}</span>
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`${enabled ? 'bg-[var(--color-primary)]' : 'bg-gray-500'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-light-bg)] focus:ring-[var(--color-primary)]`}
        >
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
        </button>
    </div>
);


export const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-[var(--color-light-bg)] rounded-lg shadow-lg mb-8">
            <button
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-2xl font-display text-[var(--color-primary)]">{title}</h3>
                 <svg className={`w-6 h-6 text-[var(--color-primary)] transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[20000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
};
