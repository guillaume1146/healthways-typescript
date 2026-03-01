'use client'

interface DashboardLoadingStateProps {
  message?: string
}

const DashboardLoadingState: React.FC<DashboardLoadingStateProps> = ({
  message = 'Loading your dashboard...',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto" />
        <p className="mt-6 text-gray-600 font-medium">{message}</p>

        {/* Skeleton preview of the dashboard structure */}
        <div className="mt-8 space-y-3 w-64 mx-auto">
          <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded-full animate-pulse w-5/6" />
          <div className="h-3 bg-gray-200 rounded-full animate-pulse w-4/6" />
        </div>
      </div>
    </div>
  )
}

export default DashboardLoadingState
