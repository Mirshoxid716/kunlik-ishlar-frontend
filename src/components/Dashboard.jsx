import { useState, useEffect } from 'react'
import axios from 'axios'
import { Briefcase, Users, Layout, PlusCircle, CheckCircle, XCircle, Clock, Save, Shield, UserPlus, LogOut, MapPin, DollarSign, Phone, FileText, Menu, Globe, Trash2, Search, ChevronLeft, ChevronRight } from 'react-feather'
import JobForm from './JobForm'
import JobDetailsModal from './JobDetailsModal'
import { useLanguage } from '../context/LanguageContext'

import API_URL from '../config'

const BASE_API_URL = `${API_URL}/api/jobs`

const Dashboard = ({ onLogout, user }) => {
    const { t, lang, setLang } = useLanguage()
    const [activeTab, setActiveTab] = useState('jobs')
    const [showJobForm, setShowJobForm] = useState(false)
    const [showAdminForm, setShowAdminForm] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [jobs, setJobs] = useState([])
    const [applications, setApplications] = useState([])
    const [workers, setWorkers] = useState([])
    const [admins, setAdmins] = useState([])

    // Search and Pagination states
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [showRejectionModal, setShowRejectionModal] = useState(false)
    const [rejectionAppId, setRejectionAppId] = useState(null)
    const itemsPerPage = 40

    useEffect(() => {
        setCurrentPage(1) // Reset page on tab change
    }, [activeTab])

    useEffect(() => {
        fetchJobs()
        fetchApplications()
        fetchWorkers()
        if (user?.is_superuser) {
            fetchAdmins()
        }

        // Set up real-time polling every 15 seconds
        const pollInterval = setInterval(() => {
            fetchJobs()
            fetchApplications()
            fetchWorkers()
        }, 15000)

        return () => clearInterval(pollInterval)
    }, [user])

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${BASE_API_URL}/jobs/`)
            setJobs(res.data)
        } catch (err) {
            console.error("Error fetching jobs:", err)
        }
    }

    const fetchApplications = async () => {
        try {
            const res = await axios.get(`${BASE_API_URL}/applications/`)
            setApplications(res.data)
        } catch (err) {
            console.error("Error fetching applications:", err)
        }
    }

    const fetchWorkers = async () => {
        try {
            const res = await axios.get(`${BASE_API_URL}/workers/`)
            setWorkers(res.data)
        } catch (err) {
            console.error("Error fetching workers:", err)
        }
    }

    const handleSaveJob = async (data) => {
        try {
            // Auto-format location URL
            let formattedData = { ...data };
            if (formattedData.location_url && !formattedData.location_url.startsWith('http')) {
                formattedData.location_url = 'https://' + formattedData.location_url;
            }

            await axios.post(`${BASE_API_URL}/jobs/`, {
                ...formattedData,
                service_fee: Number(formattedData.service_fee),
                unical_id: String(Math.floor(1000 + Math.random() * 9000))
            })
            setShowJobForm(false)
            fetchJobs()
        } catch (err) {
            console.error("Job creation failed:", err);
            try {
                if (err.response && err.response.data) {
                    if (typeof err.response.data === 'string') {
                        alert(`Server xatosi (500/404):\n\n${err.response.data.substring(0, 500)}`);
                    } else {
                        const errorMessages = Object.entries(err.response.data)
                            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                            .join('\n');
                        alert(`Ma'lumotlarni saqlashda xatolik:\n\n${errorMessages}`);
                    }
                } else {
                    alert(`Xatolik yuz berdi: ${err.message}\nIltimos qayta urinib ko'ring.`);
                }
            } catch (e) {
                alert(`Kutilmagan xatolik: ${e.message}\n\nXato detali: ${JSON.stringify(err.response?.data || err.message)}`);
            }
        }
    }

    const handleApprove = async (id) => {
        try {
            await axios.post(`${BASE_API_URL}/applications/${id}/approve/`)
            fetchApplications()
        } catch (err) {
            alert('Tasdiqlashda xatolik')
        }
    }

    const handleReject = async (id, reason) => {
        try {
            await axios.post(`${BASE_API_URL}/applications/${id}/reject/`, {
                rejection_reason: reason
            })
            setShowRejectionModal(false)
            setRejectionAppId(null)
            fetchApplications()
        } catch (err) {
            alert('Bekor qilishda xatolik')
        }
    }

    const openRejectionModal = (id) => {
        setRejectionAppId(id)
        setShowRejectionModal(true)
    }

    const handleNotifyClient = async (jobId) => {
        try {
            const res = await axios.post(`${BASE_API_URL}/jobs/${jobId}/notify_client/`)
            if (res.data.status === 'sent_to_client') {
                alert(t('sent_success'))
            } else if (res.data.status === 'sent_to_admin_as_alert') {
                alert(res.data.message)
            } else {
                alert(t('sent_success'))
            }
        } catch (err) {
            alert(err.response?.data?.error || t('sent_error'))
        }
    }

    const fetchAdmins = async () => {
        try {
            const res = await axios.get(`${BASE_API_URL}/users/`)
            setAdmins(res.data)
        } catch (err) {
            console.error("Error fetching admins:", err)
        }
    }

    const handleSaveAdmin = async (data) => {
        try {
            await axios.post(`${BASE_API_URL}/users/`, data)
            setShowAdminForm(false)
            fetchAdmins()
        } catch (err) {
            console.error("Admin creation failed:", err.response?.data || err.message)
            alert('Admin qo\'shishda xatolik')
        }
    }

    const handleDeleteAdmin = async (id) => {
        if (!window.confirm('Haqiqatan ham ushbu adminni o\'chirmoqchimisiz?')) return
        try {
            await axios.delete(`${BASE_API_URL}/users/${id}/`)
            fetchAdmins()
        } catch (err) {
            console.error("Admin deletion failed:", err.response?.data || err.message)
            alert('Adminni o\'chirishda xatolik')
        }
    }

    // Filter and Pagination Logic
    const getFilteredData = (data, fields) => {
        if (!searchTerm) return data;
        return data.filter(item =>
            fields.some(field => {
                const val = field.split('.').reduce((obj, key) => obj?.[key], item);
                return String(val || '').toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    };

    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const tabDataMap = {
        jobs: { data: jobs, fields: ['title', 'description', 'unical_id', 'address'] },
        applications: { data: applications.filter(app => app.status !== 'rejected'), fields: ['worker_details.full_name', 'job_details.unical_id', 'status'] },
        workers: { data: workers, fields: ['full_name', 'phone_number', 'passport_number', 'telegram_id'] },
        admins: { data: admins, fields: ['username', 'id'] }
    };

    const currentTabData = tabDataMap[activeTab];
    const filteredResults = getFilteredData(currentTabData.data, currentTabData.fields);
    const paginatedResults = getPaginatedData(filteredResults);
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:static inset-y-0 left-0 z-[60] w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transform transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full'} md:translate-x-0`}>
                <div>
                    <h1 className="text-2xl font-bold text-yellow-500 mb-8 items-center flex gap-2">
                        <Briefcase className="text-yellow-500" />
                        Ish Flow
                    </h1>
                    <nav className="space-y-4">
                        <button
                            onClick={() => { setActiveTab('jobs'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${activeTab === 'jobs' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <Briefcase size={20} />
                            <span>{t('jobs')}</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('applications'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${activeTab === 'applications' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <Users size={20} />
                            <span>{t('applications')}</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('workers'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${activeTab === 'workers' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <Users size={20} />
                            <span>{t('bot_users')}</span>
                        </button>
                        {user?.is_superuser && (
                            <button
                                onClick={() => { setActiveTab('admins'); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${activeTab === 'admins' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                            >
                                <Shield size={20} />
                                <span>{t('admins')}</span>
                            </button>
                        )}
                    </nav>
                </div>
                <div className="space-y-4">
                    <button
                        onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
                        className="w-full flex justify-between items-center p-3 rounded-xl hover:bg-slate-800 text-slate-400 transition-all font-bold text-xs uppercase border border-slate-800"
                    >
                        <div className="flex items-center gap-3">
                            <Globe size={18} />
                            <span>{lang === 'uz' ? 'O\'zbek (UZ)' : 'Русский (RU)'}</span>
                        </div>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all font-bold group"
                    >
                        <div className="bg-red-500/10 p-2 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-all">
                            <LogOut size={18} />
                        </div>
                        <span>{t('logout')}</span>
                    </button>
                    <div className="text-slate-600 text-[10px] text-center border-t border-slate-800 pt-4 uppercase tracking-[0.2em] font-black">
                        Ish Flow v1.0
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 text-slate-100 w-full">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10 w-full">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 bg-slate-900 rounded-lg md:hidden border border-slate-800 text-yellow-500"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl md:text-4xl font-black capitalize tracking-tight">
                                {activeTab === 'jobs' ? t('jobs') : activeTab === 'applications' ? t('applications') : activeTab === 'workers' ? t('bot_users') : t('admins')}
                            </h2>
                            <p className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base">{t('monitor_manage')}</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl w-full">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 pl-12 pr-6 py-3.5 rounded-2xl outline-none focus:border-yellow-500/50 focus:bg-slate-800/50 transition-all text-sm shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        {activeTab === 'jobs' && (
                            <button
                                onClick={() => setShowJobForm(true)}
                                className="flex-1 md:flex-none bg-yellow-500 text-black px-6 md:px-8 py-3.5 rounded-2xl font-bold hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-500/10"
                            >
                                {t('add_new_job')}
                            </button>
                        )}
                        {activeTab === 'admins' && (
                            <button
                                onClick={() => setShowAdminForm(true)}
                                className="flex-1 md:flex-none bg-yellow-500 text-black px-6 md:px-8 py-3.5 rounded-2xl font-bold hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-500/10"
                            >
                                <UserPlus size={20} className="inline mr-2" />
                                {t('add_new_admin')}
                            </button>
                        )}
                    </div>
                </header>

                {activeTab === 'jobs' ? (
                    <JobsList jobs={paginatedResults} onJobClick={setSelectedJob} />
                ) : activeTab === 'applications' ? (
                    <ApplicationsList
                        applications={paginatedResults}
                        onApprove={handleApprove}
                        onReject={openRejectionModal}
                        onJobClick={setSelectedJob}
                    />
                ) : activeTab === 'workers' ? (
                    <WorkersList workers={paginatedResults} />
                ) : (
                    <AdminsList admins={paginatedResults} onDelete={handleDeleteAdmin} />
                )}

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6 pb-10">
                        <div className="text-slate-500 text-sm font-medium">
                            {t('showing')} <span className="text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-200">{Math.min(currentPage * itemsPerPage, filteredResults.length)}</span> {t('of')} <span className="text-slate-200 font-bold">{filteredResults.length}</span> {t('results')}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="px-6 py-2 bg-slate-900/50 border border-slate-800 rounded-xl font-black text-yellow-500">
                                {currentPage}
                            </div>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {showJobForm && (
                    <JobForm onClose={() => setShowJobForm(false)} onSave={handleSaveJob} />
                )}

                {selectedJob && (
                    <JobDetailsModal
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                        onNotify={(data) => {
                            if (data.type === 'notify_client') handleNotifyClient(data.id)
                        }}
                    />
                )}

                {showAdminForm && (
                    <AdminForm onClose={() => setShowAdminForm(false)} onSave={handleSaveAdmin} />
                )}

                {showRejectionModal && (
                    <RejectionModal
                        onClose={() => setShowRejectionModal(false)}
                        onConfirm={(reason) => handleReject(rejectionAppId, reason)}
                    />
                )}
            </main>
        </div>
    )
}

const JobsList = ({ jobs, onJobClick }) => {
    const { t } = useLanguage()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500">
                    {t('no_jobs')}
                </div>
            ) : jobs.map(job => (
                <div
                    key={job.id}
                    onClick={() => onJobClick(job)}
                    className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-yellow-500/50 transition-all group relative overflow-hidden cursor-pointer"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-yellow-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${job.status === 'open' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                            {job.status === 'open' ? `• ${t('open_status')}` : `• ${t('closed_status')}`}
                        </span>
                        <button
                            onClick={() => onJobClick(job)}
                            className="text-slate-400 hover:text-yellow-500 font-mono text-xs font-bold border border-slate-800 hover:border-yellow-500/50 bg-slate-950 px-3 py-1.5 rounded inline-flex items-center transition-all shadow-sm shadow-black focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                            title="Ish ma'lumotlarini ko'rish"
                        >
                            #{job.unical_id}
                        </button>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-500 transition-colors">{job.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{job.description}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-800/50 font-bold">
                        <span className="text-2xl text-yellow-500 tracking-tighter">{Number(job.service_fee).toLocaleString()} <span className="text-xs uppercase opacity-60">SO'M</span></span>
                        <div className="text-slate-500 flex items-center space-x-2 text-xs">
                            <Clock size={16} className="text-yellow-500/50" />
                            <span>{job.working_hours}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ApplicationsList = ({ applications, onApprove, onReject, onJobClick }) => {
    const { t, lang } = useLanguage()

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = d.toDateString() === yesterday.toDateString();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        const dayStr = isToday ? t('today') : isYesterday ? t('yesterday') : d.toLocaleDateString('ru-RU');

        if (lang === 'uz') return `${dayStr} soat ${timeStr} da`;
        return `${dayStr} в ${timeStr}`;
    };

    if (applications.length === 0) {
        return (
            <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 italic">
                {t('no_applications')}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map(app => (
                <div key={app.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-yellow-500/50 transition-all group relative flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-yellow-500/10 transition-colors"></div>

                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-flex items-center ${app.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                            app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                app.status === 'waiting_payment' ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-yellow-500/10 text-yellow-500'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${app.status === 'approved' ? 'bg-green-500' :
                                app.status === 'rejected' ? 'bg-red-500' :
                                    app.status === 'waiting_payment' ? 'bg-blue-500 animate-pulse' :
                                        'bg-yellow-500 animate-pulse'
                                }`}></span>
                            {t(`status_${app.status}`)}
                        </span>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter self-center">
                            {formatTime(app.applied_at)}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="text-xl font-bold text-slate-100 group-hover:text-yellow-500 transition-colors mb-1">
                            {app.worker_details?.full_name || t('unknown_worker')}
                        </div>
                        <div className="text-sm text-slate-500 font-mono flex items-center gap-2">
                            <Phone size={14} className="text-yellow-500/50" />
                            {app.worker_details?.phone_number || t('no_number')}
                        </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50 mb-6 space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <span>{t('job_id')}</span>
                            <button
                                onClick={() => app.job_details && onJobClick(app.job_details)}
                                className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1 transition-all"
                            >
                                <FileText size={14} />
                                #{app.job_details?.unical_id || 'N/A'}
                            </button>
                        </div>
                        {app.payment_receipt && (
                            <div className="pt-3 border-t border-slate-800/50 flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 uppercase font-black">{t('receipt')}</span>
                                <a
                                    href={app.payment_receipt.startsWith('http') ? app.payment_receipt : `${API_URL}${app.payment_receipt}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-yellow-500 hover:text-yellow-400 text-xs font-bold tracking-tight bg-yellow-500/5 px-3 py-1 rounded-lg border border-yellow-500/20"
                                >
                                    VIEW
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {(app.status === 'pending' || app.status === 'waiting_payment') ? (
                            <>
                                <button
                                    onClick={() => onApprove(app.id)}
                                    className="flex-1 bg-green-500 text-white font-black py-3 rounded-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                    <span>{app.status === 'waiting_payment' ? 'FORCE APPROVE' : 'APPROVE'}</span>
                                </button>
                                <button
                                    onClick={() => onReject(app.id)}
                                    className="bg-red-500/10 text-red-500 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <XCircle size={22} />
                                </button>
                            </>
                        ) : (
                            <div className="w-full text-center py-3 bg-slate-950/50 rounded-2xl border border-slate-800 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                COMPLETED
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

const WorkersList = ({ workers }) => {
    const { t } = useLanguage()
    return (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-800/30 text-slate-500 uppercase text-[10px] tracking-widest font-black border-b border-slate-800">
                            <th className="px-8 py-6">{t('full_name')}</th>
                            <th className="px-8 py-6">{t('phone')}</th>
                            <th className="px-8 py-6">{t('age')}</th>
                            <th className="px-8 py-6">{t('passport')}</th>
                            <th className="px-8 py-6">{t('telegram_id')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {workers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center text-slate-500 italic">
                                    {t('no_workers')}
                                </td>
                            </tr>
                        ) : workers.map(worker => (
                            <tr key={worker.id} className="hover:bg-slate-800/20 transition group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-100 group-hover:text-yellow-500 transition-colors">{worker.full_name}</div>
                                </td>
                                <td className="px-8 py-6 font-mono text-slate-400 italic">
                                    {worker.phone_number}
                                </td>
                                <td className="px-8 py-6">
                                    <span className="bg-slate-950 px-3 py-1 rounded-lg text-xs font-bold text-slate-400 border border-slate-800">
                                        {worker.age} yosh
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    {worker.passport_photo ? (
                                        <a
                                            href={worker.passport_photo.startsWith('http') ? worker.passport_photo : `${API_URL}${worker.passport_photo}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-yellow-500 hover:text-yellow-400 text-xs font-bold border-b border-yellow-500/30 pb-0.5 transition-all"
                                        >
                                            📄 KO'RISH
                                        </a>
                                    ) : (
                                        <span className="text-slate-600 text-xs italic">Rasm yo'q</span>
                                    )}
                                </td>
                                <td className="px-8 py-6 font-mono text-xs text-slate-500">
                                    {worker.telegram_id}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const AdminsList = ({ admins, onDelete }) => {
    const { t } = useLanguage()
    return (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="bg-slate-800/30 text-slate-500 uppercase text-[10px] tracking-widest font-black border-b border-slate-800">
                            <th className="px-8 py-6">{t('username')}</th>
                            <th className="px-8 py-6">{t('role')}</th>
                            <th className="px-8 py-6">ID</th>
                            <th className="px-8 py-6 text-right">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {admins.map(admin => (
                            <tr key={admin.id} className="hover:bg-slate-800/20 transition group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-100 group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{admin.username}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-flex items-center ${admin.is_superuser ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        <Shield size={12} className="mr-2" />
                                        {admin.is_superuser ? 'Super Admin' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-mono text-xs text-slate-500">
                                    #{admin.id}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    {!admin.is_superuser && (
                                        <button
                                            onClick={() => onDelete(admin.id)}
                                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all active:scale-90"
                                            title="O'chirish"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const AdminForm = ({ onClose, onSave }) => {
    const { t } = useLanguage()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSuperuser, setIsSuperuser] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({ username, password, is_superuser: isSuperuser, is_staff: true })
    }

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[30px] sm:rounded-[40px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 sm:p-10">
                    <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tighter">{t('add_new_admin')}</h3>
                    <p className="text-slate-500 text-sm mb-6 sm:mb-10">Tizimga yangi administrator qo'shish</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('username')}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-all font-mono"
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                            <input
                                type="checkbox"
                                id="is_superuser"
                                checked={isSuperuser}
                                onChange={(e) => setIsSuperuser(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-800 text-yellow-500 focus:ring-yellow-500 bg-slate-900"
                            />
                            <label htmlFor="is_superuser" className="text-sm font-bold text-slate-300">Super Admin (Barcha huquqlar)</label>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-slate-800 text-slate-300 font-bold p-5 rounded-2xl hover:bg-slate-700 transition-all uppercase tracking-widest"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-yellow-500 text-black font-black p-5 rounded-2xl hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/10 uppercase tracking-widest"
                            >
                                SAQLASH
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

const RejectionModal = ({ onClose, onConfirm }) => {
    const { t } = useLanguage()
    const [reason, setReason] = useState('')

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[30px] shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <XCircle size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-center tracking-tight">ARIZANI RAD ETISH</h3>
                    <p className="text-slate-500 text-sm mb-8 text-center">Iltimos, rad etish sababini ko'rsating. Bu sabab ishchiga yuboriladi.</p>

                    <textarea
                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-red-500 transition-all text-slate-100 min-h-[120px] mb-8"
                        placeholder="Masalan: To'lov cheki yaroqsiz..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        autoFocus
                    />

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-slate-800 text-slate-300 font-bold py-4 rounded-2xl hover:bg-slate-700 transition-all uppercase tracking-widest text-xs"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            disabled={!reason.trim()}
                            onClick={() => onConfirm(reason)}
                            className="flex-1 bg-red-500 text-white font-black py-4 rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            RAD ETISH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
