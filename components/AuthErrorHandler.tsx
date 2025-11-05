'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * トップページにリダイレクトされた認証エラーを検出して処理
 * SupabaseのMagic Linkが期限切れやエラーでトップページにリダイレクトされた場合に対応
 */
export default function AuthErrorHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')

    // 認証エラーが検出された場合、管理画面ログインページにリダイレクト
    if (error || errorCode) {
      let errorMessage = '認証エラーが発生しました。'
      
      if (errorCode === 'otp_expired') {
        errorMessage = '認証リンクの有効期限が切れています。再度ログインしてください。'
      } else if (errorDescription) {
        errorMessage = decodeURIComponent(errorDescription)
      } else if (error) {
        errorMessage = decodeURIComponent(error)
      }

      // エラーパラメータを付けてログインページにリダイレクト
      router.replace(`/admin-login?error=${encodeURIComponent(errorMessage)}`)
    }
  }, [searchParams, router])

  return null
}

