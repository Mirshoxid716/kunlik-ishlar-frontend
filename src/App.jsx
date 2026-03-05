import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import { LanguageProvider } from './context/LanguageContext'

function App() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('admin_user')
        return saved ? JSON.parse(saved) : null
    })

    const handleLogin = (userData) => {
        localStorage.setItem('admin_user', JSON.stringify(userData))
        setUser(userData)
    }

    const handleLogout = () => {
        localStorage.removeItem('admin_user')
        setUser(null)
    }

    return (
        <LanguageProvider>
            <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-500/30">
                {user ? (
                    <Dashboard onLogout={handleLogout} user={user} />
                ) : (
                    <Login onLogin={handleLogin} />
                )}
            </div>
        </LanguageProvider>
    )
}

export default App
