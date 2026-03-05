import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Users, Phone, FileText, Link as LinkIcon, AlertCircle } from 'react-feather';
import { useLanguage } from '../context/LanguageContext';

const JobDetailsModal = ({ job, onClose }) => {
    const { t } = useLanguage()
    if (!job) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[30px] sm:rounded-3xl p-6 sm:p-8 relative shadow-2xl mt-10 mb-10 animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pr-0 sm:pr-12">
                    <h2 className="text-2xl sm:text-3xl font-black text-yellow-500 uppercase tracking-tight">{job.title}</h2>
                    <span className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase self-start sm:self-auto ${job.status === 'open' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {job.status === 'open' ? `• ${t('open_status')}` : `• ${t('closed_status')}`}
                    </span>
                </div>

                <div className="mb-8 border-b border-slate-800 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{t('job_id')}:</p>
                        <p className="text-slate-100 font-mono text-lg font-bold bg-slate-950 px-3 py-1 rounded inline-block border border-slate-800">#{job.unical_id}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center"><DollarSign size={14} className="mr-1" />{t('job_wage')}:</p>
                        <p className="text-slate-100 font-bold text-lg">{job.wage}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center"><Clock size={14} className="mr-1" />{t('job_time')}:</p>
                        <p className="text-slate-100 font-bold text-lg">{job.working_hours}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center"><DollarSign size={14} className="mr-1 text-yellow-500" />{t('service_fee')}:</p>
                        <p className="text-yellow-500 font-black text-xl">{Number(job.service_fee).toLocaleString()} <span className="text-xs uppercase opacity-80">uzs</span></p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center"><Users size={14} className="mr-1" />{t('req_workers')}:</p>
                        <p className="text-slate-100 font-bold text-lg">{job.required_workers}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center"><Phone size={14} className="mr-1" />{t('client_phone')}:</p>
                        <p className="text-slate-100 font-mono text-lg">{job.client_phone || t('not_entered')}</p>
                    </div>
                    {job.client_tg_username && (
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center"><Users size={14} className="mr-1" />{t('client_tg_username')}:</p>
                            <p className="text-yellow-500 font-bold text-lg">{job.client_tg_username.startsWith('@') ? job.client_tg_username : `@${job.client_tg_username}`}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {job.location_url && (
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center"><MapPin size={14} className="mr-1" />LOKATSIYA:</p>
                            <a href={job.location_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 text-sm font-bold bg-yellow-500/10 px-4 py-2.5 rounded-xl border border-yellow-500/20 transition-all hover:scale-105">
                                <LinkIcon size={14} className="mr-2" /> {t('open_in_map')}
                            </a>
                        </div>
                    )}

                    {job.transport && (
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center"><Briefcase size={14} className="mr-1" />{t('transport')}:</p>
                            <p className="text-slate-300 text-base">{job.transport}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center"><FileText size={14} className="mr-1" />{t('description')}:</p>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap min-h-[80px]">
                            {job.description || <span className="text-slate-600 italic">{t('no_comment')}</span>}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    {job.status === 'closed' && (
                        <button
                            onClick={() => onNotify({ id: job.id, type: 'notify_client' })}
                            className="w-full sm:w-auto bg-green-500/10 text-green-500 border border-green-500/20 px-6 py-3 rounded-xl font-black hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            <Phone size={16} />
                            {t('notify_client_btn')}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-yellow-500 text-black px-8 py-3 rounded-xl font-black hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20 uppercase tracking-widest text-xs"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
