import React, { createContext, useState, useContext, useEffect } from 'react';

// Dictionary of translations
const translations = {
    uz: {
        // General
        jobs: 'Ishlar',
        applications: 'Arizalar',
        bot_users: 'Bot Userlar',
        admins: 'Adminlar',
        logout: 'Chiqish',
        save: 'Saqlash',
        cancel: 'Bekor qilish',
        close: 'Yopish',
        open_status: 'OCHIQ',
        closed_status: 'YOPIQ',
        today: 'Bugun',
        yesterday: 'Kecha',
        time: 'Vaqti',
        search_placeholder: 'Qidirish...',
        next: 'Keyingisi',
        prev: 'Oldingisi',
        page: 'Sahifa',
        showing: 'Ko\'rsatkich',
        of: 'dan',
        results: 'natijalar',
        client_tg_username: 'Mijoz Telegram Usernamesi (@)',
        status_waiting_payment: 'To\'lov kutilmoqda',
        status_pending: 'Tasdiq kutilmoqda',
        status_approved: 'Tasdiqlangan',
        status_rejected: 'Rad etilgan',
        notify_client_btn: 'Mijozga ma\'lumotlarni yuborish',
        sent_success: 'Ma\'lumotlar yuborildi',
        sent_error: 'Yuborishda xatolik',

        // Login
        login_title: 'Tizimga Kirish',
        login_subtitle: 'Boshqaruv paneliga xush kelibsiz',
        username: 'Foydalanuvchi nomi',
        password: 'Parol',
        login_btn: 'KIRISH',

        // Dashboard
        monitor_manage: 'Tizim holatini kuzating va boshqaring',
        add_new_job: '+ Yangi ish qo\'shish',
        add_new_admin: 'Yangi admin qo\'shish',
        no_jobs: 'Hozircha ishlar yo\'q. Yangi ish qo\'shishingiz mumkun.',

        // Table Headers
        worker_info: 'Ishchi Ma\'lumotlari',
        job_id: 'Ish ID',
        status: 'Holat',
        receipt: 'To\'lov Cheki',
        location: 'Lokatsiya',
        actions: 'Amallar',
        full_name: 'Ism Familiya',
        phone: 'Tel Raqam',
        age: 'Yosh',
        passport: 'Pasport Rasm',
        telegram_id: 'Telegram ID',
        role: 'Roli',

        // Applications
        no_applications: 'Hozircha arizalar kelib tushmagan.',
        unknown_worker: 'Noma\'lum Ishchi',
        no_number: 'Raqam mavjud emas',
        view_receipt: 'CHEKNI KO\'RISH',
        waiting: 'Kutilmoqda...',
        completed: 'Yakunlangan',
        approve: 'Tasdiqlash',
        reject: 'Bekor qilish',

        // Workers & Admins
        no_workers: 'Hozircha botdan ro\'yxatdan o\'tganlar yo\'q.',
        super_admin: 'Super Admin',
        admin: 'Admin',
        delete: 'O\'chirish',

        // Form & Modals
        job_wage: 'Ish haqqi',
        job_time: 'Ish vaqti',
        service_fee: 'Xarid xizmat haqi',
        req_workers: 'Kerakli xodimlar',
        client_phone: 'Mijoz raqami',
        address: 'Manzil',
        transport: 'Transport',
        description: 'Qo\'shimcha izoh / Tavsif',
        open_in_map: 'Xaritada ochish',
        no_comment: 'Izoh yo\'q',

        // Add Job specific
        add_job_title: 'Yangi Ish Qo\'shish',
        add_job_subtitle: 'Tizimga yangi ish o\'rnini qo\'shish uchun quyidagi ma\'lumotlarni to\'ldiring.',
        job_name_placeholder: 'Ish nomi',
        location_url_placeholder: 'Lokatatsiya silkalisi (masalan Yandex map link)',
        not_entered: 'Kiritilmagan'
    },
    ru: {
        // General
        jobs: 'Вакансии',
        applications: 'Заявки',
        bot_users: 'Пользователи Бота',
        admins: 'Администраторы',
        logout: 'Выйти',
        save: 'Сохранить',
        cancel: 'Отмена',
        close: 'Закрыть',
        open_status: 'ОТКРЫТО',
        closed_status: 'ЗАКРЫТО',
        today: 'Сегодня',
        yesterday: 'Вчера',
        time: 'Время',
        search_placeholder: 'Поиск...',
        next: 'Следующий',
        prev: 'Предыдущий',
        page: 'Страница',
        showing: 'Показано',
        of: 'из',
        results: 'результатов',
        client_tg_username: 'Telegram Username клиента (@)',
        status_waiting_payment: 'Ожидание оплаты',
        status_pending: 'Ожидание проверки',
        status_approved: 'Одобрено',
        status_rejected: 'Отклонено',
        notify_client_btn: 'Отправить данные клиенту',
        sent_success: 'Данные отправлены',
        sent_error: 'Ошибка при отправке',

        // Login
        login_title: 'Авторизация',
        login_subtitle: 'Добро пожаловать в панель управления',
        username: 'Имя пользователя',
        password: 'Пароль',
        login_btn: 'ВОЙТИ',

        // Dashboard
        monitor_manage: 'Мониторинг и управление системой',
        add_new_job: '+ Добавить вакансию',
        add_new_admin: 'Добавить админа',
        no_jobs: 'Пока нет вакансий. Вы можете добавить новую.',

        // Table Headers
        worker_info: 'Данные работника',
        job_id: 'ID Вакансии',
        status: 'Статус',
        receipt: 'Чек об оплате',
        location: 'Локация',
        actions: 'Действия',
        full_name: 'ФИО',
        phone: 'Телефон',
        age: 'Возраст',
        passport: 'Паспорт. фото',
        telegram_id: 'Telegram ID',
        role: 'Роль',

        // Applications
        no_applications: 'Пока нет новых заявок.',
        unknown_worker: 'Неизвестный работник',
        no_number: 'Нет номера',
        view_receipt: 'СМОТРЕТЬ ЧЕК',
        waiting: 'Ожидается...',
        completed: 'Завершено',
        approve: 'Одобрить',
        reject: 'Отклонить',

        // Workers & Admins
        no_workers: 'Пока нет зарегистрированных пользователей.',
        super_admin: 'Супер Админ',
        admin: 'Админ',
        delete: 'Удалить',

        // Form & Modals
        job_wage: 'Зарплата',
        job_time: 'Время работы',
        service_fee: 'Стоимость услуг',
        req_workers: 'Требуется работников',
        client_phone: 'Номер клиента',
        address: 'Адрес',
        transport: 'Транспорт',
        description: 'Доп. комментарий / Описание',
        open_in_map: 'Открыть на карте',
        no_comment: 'Нет комментариев',

        // Add Job specific
        add_job_title: 'Новая Вакансия',
        add_job_subtitle: 'Заполните следующие данные для добавления новой вакансии.',
        job_name_placeholder: 'Название вакансии',
        location_url_placeholder: 'Ссылка на локацию (например, Yandex Map)',
        not_entered: 'Не указан'
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Check localStorage for saved lang, fallback to 'uz'
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('admin_lang') || 'uz';
    });

    useEffect(() => {
        localStorage.setItem('admin_lang', lang);
    }, [lang]);

    // Translate function
    const t = (key) => {
        return translations[lang]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
