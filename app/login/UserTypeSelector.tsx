import { UserType } from './types'
import { userTypes } from './constants'

interface UserTypeSelectorProps {
  selectedUserType: UserType;
  onUserTypeSelect: (userType: UserType) => void;
  className?: string;
}

export default function UserTypeSelector({ selectedUserType, onUserTypeSelect, className }: UserTypeSelectorProps) {
  return (
    <div className={className || "w-full h-full flex flex-col"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-4 w-full flex-grow">
        {userTypes.map((userType) => {
          const Icon = userType.icon;
          const isSelected = selectedUserType.id === userType.id;
          
          return (
            <button
              key={userType.id}
              type="button"
              onClick={() => onUserTypeSelect(userType)}
              className={`
                relative w-full p-4 sm:p-4 lg:p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02]
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-lg scale-[1.02]' 
                  : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md text-gray-700'
                }
              `}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`
                  w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-colors flex-shrink-0
                  ${isSelected 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-gradient-to-br from-blue-50 to-green-50'
                  }
                `}>
                  <Icon className={`
                    text-2xl sm:text-3xl lg:text-4xl transition-colors
                    ${isSelected ? 'text-white' : 'text-blue-600'}
                  `} />
                </div>
                
                <div className="text-left flex-grow">
                  <p className={`
                    font-semibold text-sm sm:text-base lg:text-lg transition-colors
                    ${isSelected ? 'text-white' : 'text-gray-800'}
                  `}>
                    {userType.label}
                  </p>
                  <p className={`
                    text-xs sm:text-xs lg:text-sm mt-0.5 line-clamp-2 transition-colors
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