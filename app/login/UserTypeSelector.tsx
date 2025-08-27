import { UserType } from './types'
import { userTypes } from './constants'

interface UserTypeSelectorProps {
  selectedUserType: UserType;
  onUserTypeSelect: (userType: UserType) => void;
}

export default function UserTypeSelector({ selectedUserType, onUserTypeSelect }: UserTypeSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-medium mb-3">I am a:</label>
      <div className="grid grid-cols-2 gap-3">
        {userTypes.map((userType) => {
          const Icon = userType.icon;
          return (
            <button
              key={userType.id}
              type="button"
              onClick={() => onUserTypeSelect(userType)}
              className={`p-3 border-2 rounded-lg text-left transition ${
                selectedUserType.id === userType.id
                  ? 'border-primary-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className={`text-lg ${
                    selectedUserType.id === userType.id ? 'text-primary-blue' : 'text-gray-600'
                  }`}
                />
                <span
                  className={`font-medium text-sm ${
                    selectedUserType.id === userType.id ? 'text-primary-blue' : 'text-gray-900'
                  }`}
                >
                  {userType.label}
                </span>
              </div>
              <p className="text-xs text-gray-600">{userType.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  )
}