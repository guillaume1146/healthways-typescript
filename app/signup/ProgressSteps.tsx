import { FaCheck } from 'react-icons/fa'
import { steps } from './constants'

interface ProgressStepsProps {
  currentStep: number;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                currentStep > step.number ? "bg-green-500 text-white" :
                currentStep === step.number ? "bg-blue-600 text-white" :
                "bg-gray-200 text-gray-600"
              }`}>
                {currentStep > step.number ? <FaCheck /> : <step.icon />}
              </div>
              <span className={`text-sm mt-2 font-medium ${
                currentStep >= step.number ? "text-blue-600" : "text-gray-500"
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-20 h-1 mx-4 ${
                currentStep > step.number ? "bg-green-500" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}