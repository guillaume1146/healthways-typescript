import type { EmptyStateProps } from '@/types'

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText,
  onButtonClick 
}) => {
  return (
    <div className="text-center py-16">
      <Icon className="text-6xl text-gray-300 mx-auto mb-6" />
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {buttonText && (
        <button 
          onClick={onButtonClick}
          className="border-2 border-primary-blue text-primary-blue px-6 py-2 rounded-full hover:bg-blue-50 transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default EmptyState