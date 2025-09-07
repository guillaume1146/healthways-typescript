import React, { useState, useRef, useEffect } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaRobot, 
  FaUtensils, 
  FaDumbbell, 
  FaPills, 
  FaHeart, 
  FaTint, 
  FaPaperPlane, 
  FaCamera,
  FaUpload,
  FaLeaf,
  FaAppleAlt,
  FaRunning,
  FaClipboardList,
  FaCalendarDay,
  FaChartLine,
  FaUser,
  FaImage,
  FaBrain,
  FaStethoscope,
  FaNutritionix
} from 'react-icons/fa'

interface Props {
  patientData: Patient
}

type ChatMessage =
  | {
      id: string
      sender: 'user' | 'bot'
      message: string
      timestamp: Date
      type: 'text'
      data?: undefined
    }
  | {
      id: string
      sender: 'user' | 'bot'
      message: string
      timestamp: Date
      type: 'image'
      data?: undefined
    }
  | {
      id: string
      sender: 'user' | 'bot'
      message: string
      timestamp: Date
      type: 'nutrition_analysis'
      data: NutritionAnalysis
    }
  | {
      id: string
      sender: 'user' | 'bot'
      message: string
      timestamp: Date
      type: 'recommendation'
      data: RecommendationData
    }

interface NutritionAnalysis {
  foodName: string
  calories: number
  carbs: number
  protein: number
  fat: number
  vitamins: string[]
  healthScore: number
  suggestions: string[]
}

interface RecommendationData {
  currentScore?: number
  bodyAge?: number
  recommendations: string[]
  improvements?: string[]
  reason?: string
}

const BotHealthAssistant: React.FC<Props> = ({ patientData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      sender: 'bot',
      message: `Hello ${patientData.firstName}! I'm your AI Health Assistant. I can help you with nutrition analysis, meal planning, exercise suggestions, and health recommendations. How can I assist you today?`,
      timestamp: new Date(),
      type: 'text'
    }
    setMessages([welcomeMessage])
  }, [patientData.firstName])

  const botResponses = {
    nutrition: [
      "I'd be happy to analyze your food! You can upload a photo of your meal or tell me what you're eating.",
      "Let me analyze the nutritional content of your meal and provide personalized recommendations.",
      "Based on your health profile, I'll suggest the best foods for your goals."
    ],
    exercise: [
      "Based on your health score and goals, here are some exercise recommendations tailored for you.",
      "Let's create a workout plan that fits your lifestyle and health conditions.",
      "I can suggest exercises that align with your current fitness level and medical history."
    ],
    health: [
      "Let me review your health metrics and provide personalized insights.",
      "Based on your recent health data, I have some recommendations for you.",
      "I'll analyze your health trends and suggest areas for improvement."
    ],
    general: [
      "I'm here to help with all your health questions! What would you like to know?",
      "How can I assist you with your health journey today?",
      "Let me know what aspect of your health you'd like to focus on."
    ]
  }

  const analyzeNutrition = (foodDescription: string): NutritionAnalysis => {
    // Mock nutrition analysis - in real app this would call an AI service
    const mockAnalysis: NutritionAnalysis = {
      foodName: foodDescription,
      calories: Math.floor(Math.random() * 500) + 200,
      carbs: Math.floor(Math.random() * 50) + 20,
      protein: Math.floor(Math.random() * 30) + 10,
      fat: Math.floor(Math.random() * 20) + 5,
      vitamins: ['Vitamin C', 'Vitamin A', 'Iron', 'Calcium'],
      healthScore: Math.floor(Math.random() * 40) + 60,
      suggestions: [
        'Add more vegetables for fiber',
        'Consider whole grain alternatives',
        'Include healthy fats like avocado',
        'Stay hydrated with water'
      ]
    }
    return mockAnalysis
  }

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const message = userMessage.toLowerCase()

    if (message.includes('food') || message.includes('eat') || message.includes('nutrition') || message.includes('meal')) {
      // If they mention specific food, analyze it
      if (message.includes('chicken') || message.includes('salad') || message.includes('rice') || message.includes('banana')) {
        const analysis = analyzeNutrition(userMessage)
        return {
          id: Date.now().toString(),
          sender: 'bot',
          message: 'Great choice! Let me analyze that for you.',
          timestamp: new Date(),
          type: 'nutrition_analysis',
          data: analysis
        }
      }
      return {
        id: Date.now().toString(),
        sender: 'bot',
        message: botResponses.nutrition[Math.floor(Math.random() * botResponses.nutrition.length)],
        timestamp: new Date(),
        type: 'text'
      }
    }

    if (message.includes('exercise') || message.includes('workout') || message.includes('fitness')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        message: botResponses.exercise[Math.floor(Math.random() * botResponses.exercise.length)],
        timestamp: new Date(),
        type: 'recommendation',
        data: {
          recommendations: [
            '30 minutes daily walking',
            'Strength training 2-3 times per week',
            'Flexibility and stretching exercises',
            'Low-impact activities like swimming'
          ],
          reason: 'Based on your health profile and current fitness level'
        }
      }
    }

    if (message.includes('health') || message.includes('score') || message.includes('condition')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        message: `Your current health score is ${patientData.healthScore}%. Here are some insights based on your profile.`,
        timestamp: new Date(),
        type: 'recommendation',
        data: {
          currentScore: patientData.healthScore,
          bodyAge: patientData.bodyAge,
          recommendations: [
            'Maintain regular checkups',
            'Continue current medication regimen',
            'Focus on stress management',
            'Ensure adequate sleep'
          ],
          improvements: [
            'Increase water intake',
            'Add more fiber to diet',
            'Regular physical activity',
            'Mindfulness practice'
          ]
        }
      }
    }

    return {
      id: Date.now().toString(),
      sender: 'bot',
      message: botResponses.general[Math.floor(Math.random() * botResponses.general.length)],
      timestamp: new Date(),
      type: 'text'
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return

    // Add user message
    const userMessage: ChatMessage =
      selectedImage
        ? {
            id: Date.now().toString(),
            sender: 'user',
            message: 'Uploaded an image',
            timestamp: new Date(),
            type: 'image'
          }
        : {
            id: Date.now().toString(),
            sender: 'user',
            message: newMessage,
            timestamp: new Date(),
            type: 'text'
          }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setSelectedImage(null)
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.message)
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderMessage = (message: ChatMessage) => {
    return (
      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            }`}>
              {message.sender === 'user' ? <FaUser className="text-sm" /> : <FaRobot className="text-sm" />}
            </div>
          </div>

          {/* Message Content */}
          <div className={`rounded-2xl px-4 py-3 ${
            message.sender === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white border border-gray-200 text-gray-800'
          }`}>
            {message.type === 'text' && (
              <p className="text-sm">{message.message}</p>
            )}

            {message.type === 'nutrition_analysis' && (
              <div className="space-y-3">
                <p className="text-sm">{message.message}</p>
                <div className="bg-green-50 rounded-lg p-3 text-gray-800">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <FaNutritionix className="mr-2" />
                    Nutrition Analysis: {message.data.foodName}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Calories: <strong>{message.data.calories}</strong></div>
                    <div>Protein: <strong>{message.data.protein}g</strong></div>
                    <div>Carbs: <strong>{message.data.carbs}g</strong></div>
                    <div>Fat: <strong>{message.data.fat}g</strong></div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Health Score</span>
                      <span className="font-semibold">{message.data.healthScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${message.data.healthScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-green-700">Suggestions:</p>
                    <ul className="text-xs text-green-600 ml-2">
                      {message.data.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {message.type === 'recommendation' && (
              <div className="space-y-3">
                <p className="text-sm">{message.message}</p>
                <div className="bg-blue-50 rounded-lg p-3 text-gray-800">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <FaBrain className="mr-2" />
                    Personalized Recommendations
                  </h4>
                  {message.data.currentScore !== undefined && (
                    <div className="mb-2 text-xs">
                      <span>Current Health Score: </span>
                      <strong className="text-blue-600">{message.data.currentScore}%</strong>
                    </div>
                  )}
                  <ul className="text-xs space-y-1">
                    {message.data.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <FaStethoscope className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!patientData.botHealthAssistant) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <FaRobot className="text-gray-400 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">AI Health Assistant</h3>
        <p className="text-gray-500">Initializing your personal health assistant...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Assistant Chat Interface */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaRobot className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Health Assistant</h2>
                <p className="text-purple-100">Your personal nutrition & wellness advisor</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">Health Score</p>
              <p className="text-2xl font-bold">{patientData.healthScore}%</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 bg-gray-50">
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t bg-white">
          {selectedImage && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <FaImage className="text-blue-500 mr-2" />
                <span className="text-sm text-blue-700">Image selected: {selectedImage.name}</span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
            >
              <FaCamera className="text-lg" />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about nutrition, exercise, or upload a food photo..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && !selectedImage}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaPaperPlane className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setNewMessage('Help me plan healthy meals')}
          className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-2xl hover:from-green-500 hover:to-green-700 transition-all transform hover:scale-105"
        >
          <FaUtensils className="text-3xl mb-3" />
          <h3 className="font-bold mb-2">Meal Planning</h3>
          <p className="text-sm opacity-90">Get personalized meal suggestions</p>
        </button>

        <button 
          onClick={() => setNewMessage('Create an exercise plan for me')}
          className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-2xl hover:from-blue-500 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <FaDumbbell className="text-3xl mb-3" />
          <h3 className="font-bold mb-2">Exercise Plans</h3>
          <p className="text-sm opacity-90">Custom workouts for your goals</p>
        </button>

        <button 
          onClick={() => setNewMessage('Analyze my health metrics')}
          className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 rounded-2xl hover:from-purple-500 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <FaChartLine className="text-3xl mb-3" />
          <h3 className="font-bold mb-2">Health Insights</h3>
          <p className="text-sm opacity-90">Track your health progress</p>
        </button>
      </div>

      {/* Health Assistant Data */}
      {patientData.botHealthAssistant.sessions && patientData.botHealthAssistant.sessions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaClipboardList className="mr-2 text-purple-500" />
            Previous Health Sessions
          </h3>
          <div className="space-y-4">
            {patientData.botHealthAssistant.sessions.map((session) => (
              <div key={session.id} className="border rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{session.topic}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <h5 className="font-medium text-green-800 mb-2 flex items-center">
                      <FaLeaf className="mr-2" />
                      Diet Recommendations
                    </h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      {session.recommendations.diet.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <FaAppleAlt className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                      <FaRunning className="mr-2" />
                      Exercise Recommendations
                    </h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {session.recommendations.exercise.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <FaDumbbell className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hydration Tracking */}
        {patientData.botHealthAssistant.hydrationTracking && patientData.botHealthAssistant.hydrationTracking.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaTint className="mr-2 text-blue-500" />
              Hydration Tracking
            </h3>
            {patientData.botHealthAssistant.hydrationTracking.slice(0, 1).map((track, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today&apos;s Progress</span>
                  <span className="text-lg font-bold text-blue-600">
                    {track.consumedML}/{track.targetML}ml
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((track.consumedML / track.targetML) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Reminders: {track.reminders.join(', ')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Meal Plan Overview */}
        {patientData.botHealthAssistant.currentMealPlan && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaUtensils className="mr-2 text-green-500" />
              Current Meal Plan
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <p className="text-xs text-blue-700">Calories</p>
                  <p className="text-lg font-bold text-blue-900">{patientData.botHealthAssistant.currentMealPlan.calorieTarget}</p>
                </div>
                <div className="bg-green-50 rounded p-2 text-center">
                  <p className="text-xs text-green-700">Protein</p>
                  <p className="text-lg font-bold text-green-900">{patientData.botHealthAssistant.currentMealPlan.proteinTarget}g</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Plan period: {patientData.botHealthAssistant.currentMealPlan.startDate} to {patientData.botHealthAssistant.currentMealPlan.endDate}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BotHealthAssistant
