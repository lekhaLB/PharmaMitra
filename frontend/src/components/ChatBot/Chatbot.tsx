// src/components/Chatbot/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { SendIcon, RefreshCw } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    loading?: boolean;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        const tempBotMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
            loading: true,
        };

        setMessages(prev => [...prev, userMessage, tempBotMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Start event stream
            const eventSource = new EventSource('/api/chatbot/stream/');

            // Send the message via a separate request
            axios.post('/api/chatbot/stream/', { message: input }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
            });

            let responseContent = '';

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.done) {
                    eventSource.close();
                    setIsLoading(false);
                    return;
                }

                if (data.error) {
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === tempBotMessage.id
                                ? { ...msg, content: 'Sorry, there was an error processing your request.', loading: false }
                                : msg
                        )
                    );
                    eventSource.close();
                    setIsLoading(false);
                    return;
                }

                if (data.chunk) {
                    responseContent += data.chunk;
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === tempBotMessage.id
                                ? { ...msg, content: responseContent }
                                : msg
                        )
                    );
                }
            };

            eventSource.onerror = () => {
                eventSource.close();
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === tempBotMessage.id
                            ? { ...msg, content: 'Sorry, there was an error connecting to the server.', loading: false }
                            : msg
                    )
                );
                setIsLoading(false);
            };
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === tempBotMessage.id
                        ? { ...msg, content: 'Sorry, there was an error processing your request.', loading: false }
                        : msg
                )
            );
            setIsLoading(false);
        }
    };

    const clearChat = async () => {
        try {
            await axios.post('/api/chatbot/clear/', {}, {
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
            });
            setMessages([]);
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Helper function to get CSRF token
    function getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    }

    return (
        <div className="flex flex-col bg-white rounded-lg shadow-lg h-96 max-h-96">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-medium">PharmaMitra Chatbot</h3>
                <button
                    onClick={clearChat}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-gray-500 text-center my-8">
                        Ask me about medications, prescriptions, or general pharmacy questions.
                    </div>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-3/4 p-3 rounded-lg ${message.role === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                {message.loading ? (
                                    <div className="flex space-x-1 justify-center items-center h-6">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t flex">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your question here..."
                    className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={!input.trim() || isLoading}
                >
                    <SendIcon size={18} />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;