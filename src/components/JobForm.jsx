import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const JobForm = ({ onClose, onSave }) => {
    const { t } = useLanguage()
    const [formData, setFormData] = useState({
        title: '',
        wage: '',
        working_hours: '',
        service_fee: '',
        client_phone: '',
        client_tg_username: '',
        location_url: '',
        required_workers: 1,
        transport: '',
        description: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[30px] sm:rounded-[40px] shadow-2xl relative my-8 animate-in fade-in zoom-in duration-300">
                <div className="p-6 sm:p-10">
                    <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tighter">{t('add_job_title')}</h3>
                    <p className="text-slate-500 text-sm mb-6 sm:mb-10">{t('add_job_subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            placeholder={t('job_name_placeholder')}
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                placeholder={t('job_wage')}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder={t('job_time')}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                placeholder={t('client_tg_username')}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, client_tg_username: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder={t('transport')}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder={t('service_fee')}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, service_fee: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder={t('client_phone')}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder={t('location_url_placeholder')}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                                onChange={(e) => setFormData({ ...formData, location_url: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder={t('req_workers')}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                                value={formData.required_workers}
                                min={1}
                                onChange={(e) => setFormData({ ...formData, required_workers: e.target.value })}
                                required
                            />
                        </div>
                        <textarea
                            placeholder={t('description')}
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-yellow-500 outline-none transition"
                            rows="3"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition uppercase tracking-widest text-xs font-bold text-slate-400 hover:text-white"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-yellow-500 text-black font-black p-3 rounded-xl hover:bg-yellow-400 transition uppercase tracking-widest text-xs"
                            >
                                {t('save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default JobForm
