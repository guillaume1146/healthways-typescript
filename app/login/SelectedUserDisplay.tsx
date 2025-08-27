import { UserType } from './types'

interface SelectedUserDisplayProps {
  selectedUserType: UserType;
}

export default function SelectedUserDisplay({ selectedUserType }: SelectedUserDisplayProps) {
  const SelectedIcon = selectedUserType.icon;

  return (
    <div className="bg-gradient-main text-white rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <SelectedIcon className="text-white text-lg" />
        </div>
        <div>
          <div className="font-semibold">{selectedUserType.label} Portal</div>
          <div className="text-sm text-white/90">{selectedUserType.description}</div>
        </div>
      </div>
    </div>
  )
}