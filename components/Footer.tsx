import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-cabaret-dark-card border-t border-gold/30 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <p className="text-sm text-cabaret-text-secondary leading-relaxed">
              © 2024 キャバクラキャスト検索
            </p>
          </div>
          <div className="flex items-center">
            <Link
              href="/admin-login"
              className="text-sm text-gold hover:text-gold-bright active:scale-95 transition-all duration-ios font-medium inline-flex items-center gap-2 px-4 py-2 rounded-ios-sm border border-gold/40 hover:border-gold hover:bg-cabaret-dark-section"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>管理者ログイン</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
