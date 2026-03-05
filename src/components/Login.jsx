import { useState } from 'react'
import { Lock, User, Briefcase, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Login = ({ onLogin }) => {
    const { t, lang, setLang } = useLanguage()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        try {
            const response = await fetch(`${apiUrl}/api/jobs/users/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const data = await response.json()
            if (response.ok) {
                onLogin(data)
            } else {
                setError(data.error || 'Login yoki parol xato!')
            }
        } catch (err) {
            setError('Server bilan bog\'lanishda xatolik!')
        }
    }

    const toggleLang = () => {
        setLang(lang === 'uz' ? 'ru' : 'uz')
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>

            <button
                onClick={toggleLang}
                className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-slate-400 hover:text-white hover:border-yellow-500/50 transition-all font-bold text-xs uppercase"
            >
                <Globe size={14} />
                {lang === 'uz' ? 'UZ' : 'RU'}
            </button>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-yellow-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-yellow-500/20 rotate-12">
                            <Briefcase size={40} className="text-black -rotate-12" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">{t('login_title')}</h1>
                        <p className="text-slate-500 text-sm font-medium">{t('login_subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('username')}</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl outline-none focus:border-yellow-500 transition-all text-white font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('password')}</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-2xl outline-none focus:border-yellow-500 transition-all text-white font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs font-bold text-center animate-bounce">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-yellow-500 text-black font-black p-5 rounded-2xl hover:bg-yellow-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-yellow-500/10 mt-4"
                        >
                            {t('login_btn')}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs mt-8 font-bold tracking-widest">
                    ISH FLOW • ADMIN v1.0
                </p>
            </div>
        </div>
    )
}

export default Login
