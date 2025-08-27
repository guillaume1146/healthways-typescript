import { useState } from 'react'
import { FaCopy, FaCheckCircle } from 'react-icons/fa'
import { utmSources } from '../constants'

interface UTMLinkGeneratorProps {
  promoCode: string
}

export default function UTMLinkGenerator({ promoCode }: UTMLinkGeneratorProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  
  const baseUrl = "https://healthwyz.mu/signup"
  
  const generateUTMLink = (platform: string) => {
    const utmParams = new URLSearchParams({
      utm_source: platform,
      utm_medium: platform === 'email' || platform === 'whatsapp' ? 
        (platform === 'email' ? 'direct' : 'messaging') : 'social',
      utm_campaign: `${promoCode.toLowerCase()}_referral_2025`,
      promo: promoCode
    })
    
    return `${baseUrl}?${utmParams.toString()}`
  }
  
  const copyToClipboard = async (link: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiedLink(platform)
      setTimeout(() => setCopiedLink(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">UTM Link Generator</h2>
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          Code: {promoCode}
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 text-sm">
        Generate trackable links for different platforms to monitor your referral performance.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {utmSources.map((source) => {
          const Icon = source.icon
          const utmLink = generateUTMLink(source.platform)
          const isCopied = copiedLink === source.platform
          
          return (
            <div key={source.platform} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${source.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{source.name}</h3>
                  <p className="text-xs text-gray-500">Campaign Link</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-600 font-mono break-all">
                  {utmLink.length > 60 ? `${utmLink.substring(0, 60)}...` : utmLink}
                </p>
              </div>
              
              <button
                onClick={() => copyToClipboard(utmLink, source.platform)}
                className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition ${
                  isCopied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                disabled={isCopied}
              >
                {isCopied ? (
                  <>
                    <FaCheckCircle className="inline mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="inline mr-2" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">How to use these links:</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Use the specific platform link when promoting on that social media</li>
          <li>• Track performance by source in your Lead Generation Dashboard</li>
          <li>• Each conversion through these links will be credited to you</li>
          <li>• Links automatically include your promo code: {promoCode}</li>
        </ul>
      </div>
    </div>
  )
}