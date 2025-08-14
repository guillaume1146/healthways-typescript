import { FaExclamationTriangle } from 'react-icons/fa'

const MedicalDisclaimer: React.FC = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-400 rounded-xl p-6 my-8">
      <h5 className="font-semibold mb-3 flex items-center">
        <FaExclamationTriangle className="text-yellow-500 mr-2 text-xl" />
        Important Medical Disclaimer
      </h5>
      <p className="text-gray-700 mb-2">
        All medicine purchases must be made with a valid doctor&apos;s prescription. 
        This platform provides general health information for educational purposes only. 
        Always consult qualified healthcare professionals for proper diagnosis, treatment, and medical advice.
      </p>
      <p className="text-gray-700">
        By purchasing medicines through this platform, you acknowledge that you have a valid 
        prescription and understand the risks associated with self-medication.
      </p>
    </div>
  )
}

export default MedicalDisclaimer