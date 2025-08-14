import type { ProfessionalBannerProps } from '@/types'

const ProfessionalBanner: React.FC<ProfessionalBannerProps> = ({ 
  title, 
  description, 
  primaryButton, 
  secondaryButton,
  onPrimaryClick,
  onSecondaryClick 
}) => {
  return (
    <div className="bg-gradient-main text-white rounded-3xl p-12 text-center my-12">
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-lg mb-8 max-w-2xl mx-auto">{description}</p>
      <div className="flex justify-center gap-4">
        {primaryButton && (
          <button 
            onClick={onPrimaryClick}
            className="bg-white text-primary-blue px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            {primaryButton}
          </button>
        )}
        {secondaryButton && (
          <button 
            onClick={onSecondaryClick}
            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
          >
            {secondaryButton}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfessionalBanner