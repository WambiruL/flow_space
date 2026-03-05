import { Suspense } from 'react'
import AuthContent from '@/app/auth/authcontent'

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  )
}