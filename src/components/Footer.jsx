import React from 'react'
import { Link } from 'react-router-dom'

const SOCIALS = [
    {
        name: 'TikTok',
        href: 'https://tiktok.com/@azkafatkhunnuha',
        label: '@azkafatkhunnuha',
        color: 'hover:text-pink-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M16.5 3a5.4 5.4 0 0 0 4.6 4.5v3.1a8.5 8.5 0 0 1-4.6-1.4v6.8a6.3 6.3 0 1 1-6.3-6.3c.3 0 .6 0 .9.1v3.2a3.2 3.2 0 1 0 2.2 3.1V3h3.2Z" />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        href: 'https://instagram.com/abcdazkaaa',
        label: '@abcdazkaaa',
        color: 'hover:text-fuchsia-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'Website',
        href: 'https://azkafatkhunnuha.my.id',
        label: 'azkafatkhunnuha.my.id',
        color: 'hover:text-indigo-400',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>
        ),
    },
    {
        name: 'Support',
        href: 'https://sociabuzz.com/abcdazka/tribe',
        label: 'Saweria / SociaBuzz',
        color: 'hover:text-amber-400',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 21s-7.5-4.5-9.5-9.5A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5.5C19.5 16.5 12 21 12 21Z" />
            </svg>
        ),
    },
]

const QUICK_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'Terbaru', path: '/terbaru' },
    { name: 'Trending', path: '/trending' },
    { name: 'Pustaka', path: '/pustaka' },
    { name: 'All Comic', path: '/unlimited' },
    { name: 'History', path: '/history' },
]

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer className="relative mt-16 border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-3">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                AFZN STUDIO
                            </h2>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                                Comic Reader
                            </p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        Baca komik, manhwa, dan manhua bahasa Indonesia secara gratis.
                        Update harian, koleksi lengkap, tampilan modern.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                        Navigasi
                    </h3>
                    <ul className="grid grid-cols-2 gap-y-2 text-sm">
                        {QUICK_LINKS.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Creator + socials */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                        Creator
                    </h3>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        Azka Fatkhunnuha
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Founder · AFZN Studio
                    </p>
                    <ul className="space-y-2 text-sm">
                        {SOCIALS.map((s) => (
                            <li key={s.name}>
                                <a
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors ${s.color}`}
                                >
                                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
                                        {s.icon}
                                    </span>
                                    <span className="flex flex-col leading-tight">
                                        <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            {s.name}
                                        </span>
                                        <span>{s.label}</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <p>© {year} AFZN STUDIO · Created with ❤️ by Azka Fatkhunnuha</p>
                    <p className="opacity-70">
                        Comic data © respective publishers · Not affiliated with original authors.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
