import { UserType } from './types'
import { userTypes } from './constants'

interface UserTypeSelectorProps {
  selectedUserType: UserType;
  onUserTypeSelect: (userType: UserType) => void;
}

export default function UserTypeSelector({ selectedUserType, onUserTypeSelect }: UserTypeSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-gray-700 text-sm font-semibold mb-4">Select Account Type</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {userTypes.map((userType) => {
          const Icon = userType.icon;
          const isSelected = selectedUserType.id === userType.id;
          
          return (
            <button
              key={userType.id}
              type="button"
              onClick={() => onUserTypeSelect(userType)}
              className={`
                relative p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-105
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-lg scale-105' 
                  : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md text-gray-700'
                }
              `}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              <div className="flex flex-col items-center space-y-2">
                <div className={`
                  w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors
                  ${isSelected 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-gradient-to-br from-blue-50 to-green-50'
                  }
                `}>
                  <Icon className={`
                    text-xl sm:text-2xl transition-colors
                    ${isSelected ? 'text-white' : 'text-blue-600'}
                  `} />
                </div>
                
                <div className="text-center">
                  <p className={`
                    font-semibold text-xs sm:text-sm transition-colors
                    ${isSelected ? 'text-white' : 'text-gray-800'}
                  `}>
                    {userType.label}
                  </p>
                  <p className={`
                    text-[10px] sm:text-xs mt-1 line-clamp-2 transition-colors
                    ${isSelected ? 'text-white/90' : 'text-gray-500'}
                  `}>
                    {userType.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  )
}