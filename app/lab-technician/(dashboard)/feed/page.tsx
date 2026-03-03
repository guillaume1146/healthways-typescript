'use client'

import { useDashboardUser } from '@/hooks/useDashboardUser'
import PostFeed from '@/components/posts/PostFeed'
import ChatContactsSidebar from '@/components/chat/ChatContactsSidebar'

export default function LabTechFeedPage() {
  const user = useDashboardUser()
  if (!user) return <div className="flex items-center justify-center h-full"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <PostFeed currentUserId={user.id} currentUserType={user.userType} showCreateButton={false} />
      </div>
      <div className="hidden lg:block w-72 flex-shrink-0">
        <ChatContactsSidebar currentUserId={user.id} messagesPath="/lab-technician/dashboard/messages" />
      </div>
    </div>
  )
}
