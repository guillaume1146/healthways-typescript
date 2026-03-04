'use client'

import { usePatientData } from '../context'
import PostFeed from '@/components/posts/PostFeed'
import ChatContactsSidebar from '@/components/chat/ChatContactsSidebar'

export default function PatientFeedPage() {
  const user = usePatientData()
  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PostFeed currentUserId={user.id} currentUserType="PATIENT" showCreateButton={false} />
      </div>
      <div className="hidden lg:block w-72 flex-shrink-0">
        <ChatContactsSidebar currentUserId={user.id} messagesPath="/patient/chat" />
      </div>
    </div>
  )
}
