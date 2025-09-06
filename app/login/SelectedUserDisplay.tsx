import { UserType } from './types'

interface SelectedUserDisplayProps {
  selectedUserType: UserType;
}

export default function SelectedUserDisplay({ selectedUserType }: SelectedUserDisplayProps) {
  const SelectedIcon = selectedUserType.icon;
  
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-xl p-[2px] mb-6">
      <div className="bg-white rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-4">

          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
              <SelectedIcon className="text-white text-2xl sm:text-3xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg sm:text-xl text-gray-800">
                {selectedUserType.label} Portal
              </h3>
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs rounded-full font-medium">
                Selected
              </span>
            </div>

            <p className="text-sm sm:text-base text-gray-600">
              {selectedUserType.description}
            </p>

            {selectedUserType.demoEmail && selectedUserType.demoPassword && (
              <div className="mt-2 text-xs sm:text-sm space-y-1">
                <div className="text-blue-600 font-medium">
                  📧 Demo Email: <span className="font-mono">{selectedUserType.demoEmail}</span>
                </div>
                <div className="text-blue-600 font-medium">
                  🔑 Demo Password: <span className="font-mono">{selectedUserType.demoPassword}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}