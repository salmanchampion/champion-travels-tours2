
import React, { useState, useRef, useEffect, useContext } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DataContext } from '../contexts/DataContext';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

const AIChatbot: React.FC = () => {
    const { appData } = useContext(DataContext);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            text: 'আসসালামু আলাইকুম! আমি চ্যাম্পিয়ন ট্রাভেলস-এর এআই অ্যাসিস্ট্যান্ট। হজ্জ, ওমরাহ বা ভিসা সংক্রান্ত যেকোনো তথ্য দিয়ে আমি আপনাকে কিভাবে সাহায্য করতে পারি?',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Generate system instruction based on current app data
    const getSystemInstruction = () => {
        // Collect all data points
        const contactInfo = appData.pages.contact.contactInfo.map(c => `${c.label}: ${c.value}`).join(', ');
        
        const legacyHajj = appData.hajjPackages.filter(p => p.enabled).map(p => `${p.name} (${p.price}, ${p.category})`).join('; ');
        const exclusiveHajj = appData.exclusiveHajj.packages.filter(p => p.enabled).map(p => `${p.title} (${p.price}, ${p.category})`).join('; ');
        
        const legacyUmrah = appData.umrahPackages.filter(p => p.enabled).map(p => `${p.name} (${p.price}, ${p.category})`).join('; ');
        const exclusiveUmrah = appData.exclusiveUmrah.packages.filter(p => p.enabled).map(p => `${p.title} (${p.price}, ${p.category})`).join('; ');

        const teamMembers = [
            appData.pages.team.chairman.enabled ? `${appData.pages.team.chairman.name} (${appData.pages.team.chairman.role})` : '',
            ...appData.pages.team.talentedEmployees.filter(e => e.enabled).map(e => `${e.name} (${e.role})`)
        ].filter(Boolean).join(', ');

        const visaServices = appData.pages.visaProcessing.offerList.filter(o => o.enabled).map(o => o.title).join(', ');

        return `
            You are the helpful AI Assistant for "Champion Travels & Tours", a prestigious travel agency in Bangladesh specializing in Hajj, Umrah, and Visa processing.
            
            Your goal is to answer customer queries politely, concisely, and accurately in Bengali (or English if asked).
            
            **Agency Information:**
            - **Contact:** ${contactInfo}
            - **Key Team Members:** ${teamMembers}
            
            **Services & Packages:**
            - **Hajj Packages:** ${legacyHajj}; ${exclusiveHajj}
            - **Umrah Packages:** ${legacyUmrah}; ${exclusiveUmrah}
            - **Visa Processing:** Available for ${visaServices}, Student Visa, Medical Visa.
            - **Other Services:** Air Ticketing (Domestic & International), Hotel Booking (Makkah/Madinah), Ziyarat Tours.
            
            **Strict Rules:**
            1. Be polite and use Islamic greetings (Assalamu Alaikum) when appropriate.
            2. If you don't know a specific price or detail that isn't listed here, kindly ask them to contact us directly via Phone/WhatsApp.
            3. Keep answers short and easy to read in Bengali.
            
            4. **DEVELOPER CREDIT (Must Follow):**
            If anyone asks "Who created this website?", "Who is the developer?", "Website owner?", "Ke baniyeche?", or anything related to the website's development, YOU MUST REPLY with the following information professionally:
            
            "এই অত্যাধুনিক ওয়েবসাইটটি ডেভেলপ করেছেন:
            👨‍💻 **প্রফেশনাল ওয়েব ডেভেলপার:** মোঃ সালমান শরীফ (Md Salman Sharif)
            📞 **যোগাযোগ:** 01901922368"
            
            (Do not mention any other AI or company for development credit).
        `;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const apiKey = appData.globalConfig?.geminiApiKey;

        if (!apiKey || apiKey.trim() === '') {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: 'দুঃখিত, এআই সেবাটি বর্তমানে কনফিগার করা নেই। অনুগ্রহ করে অ্যাডমিন প্যানেলে API Key যুক্ত করুন।',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            const model = 'gemini-2.5-flash';
            
            // Construct conversation history for context
            const history = messages.slice(-10).map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const chat = ai.chats.create({
                model: model,
                config: {
                    systemInstruction: getSystemInstruction(),
                },
                history: history
            });

            const result = await chat.sendMessage({ message: userMessage.text });
            const responseText = result.text;

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: responseText || 'দুঃখিত, আমি এখন উত্তর দিতে পারছি না।',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Chatbot Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: 'দুঃখিত, যান্ত্রিক ত্রুটির কারণে উত্তর দেওয়া যাচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন বা সরাসরি আমাদের সাথে যোগাযোগ করুন।',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed z-[200] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border-2 border-[#0B0F19] bottom-24 left-4 md:bottom-6 md:left-28 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-[var(--color-primary)] animate-bounce-slow'}`}
                aria-label="AI Chat Assistant"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8c0 4.41-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z"/>
                        <path d="M9 11c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z" opacity="0.3"/> 
                        <path d="M12 15c-1.84 0-3.57-.62-5-1.67V17h10v-3.67C15.57 14.38 13.84 15 12 15z"/>
                    </svg>
                )}
            </button>

            {/* Chat Window */}
            <div 
                className={`fixed z-[201] bottom-24 left-4 md:left-28 md:bottom-24 w-[90vw] md:w-96 bg-[var(--color-light-bg)] rounded-xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 transform origin-bottom-left flex flex-col ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}
                style={{ maxHeight: '600px', height: '60vh' }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] p-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8c0 4.41-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z"/><circle cx="9" cy="10" r="1.5" fill="white"/><circle cx="15" cy="10" r="1.5" fill="white"/><path d="M12 16c-1.48 0-2.75-.81-3.46-2h6.92c-.71 1.19-1.98 2-3.46 2z" fill="white"/></svg>
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-white text-lg leading-none">AI Assistant</h3>
                            <span className="text-xs text-white/80">Always here to help</span>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[var(--color-dark-bg)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                    ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                                    : 'bg-[var(--color-light-bg)] text-[var(--color-light-text)] rounded-tl-none border border-gray-700'
                                }`}
                            >
                                {msg.text.split('\n').map((line, i) => (
                                    <div key={i} className="min-h-[1.2em]">{line}</div>
                                ))}
                                <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-[var(--color-muted-text)]'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[var(--color-light-bg)] p-3 rounded-2xl rounded-tl-none border border-gray-700 flex space-x-1 items-center h-10">
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 bg-[var(--color-light-bg)] border-t border-gray-700 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow bg-[var(--color-dark-bg)] text-white text-sm rounded-full px-4 py-3 border border-gray-600 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className="bg-[var(--color-primary)] text-white p-3 rounded-full hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </>
    );
};

export default AIChatbot;
