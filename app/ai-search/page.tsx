'use client'

import { useState, useRef, useEffect } from 'react'
import {  FaPaperPlane, FaRobot, FaUser, FaCopy, FaThumbsUp, FaThumbsDown, FaUserMd, FaAmbulance, FaShieldAlt, FaBaby, FaUserNurse, FaPills, FaFlask, FaLightbulb, FaExclamationTriangle, FaHeart, FaClipboardList } from 'react-icons/fa'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: `Hello! I'm your AI Medical Support Assistant. I'm here to help you with:

• **Emergency Procedures** - Steps to follow in medical emergencies
• **Booking Guidance** - How to book doctors, tests, or services
• **Insurance Information** - Understanding your coverage and claims
• **Medication Advice** - Information about medicines and prescriptions
• **Healthcare Navigation** - Finding the right services for your needs
• **Administrative Procedures** - Help with healthcare paperwork and processes

How can I assist you today?`,
    timestamp: new Date()
  }
]

const quickPrompts = [
  {
    icon: FaAmbulance,
    text: "Emergency procedure steps",
    prompt: "What are the steps I should follow in a medical emergency?"
  },
  {
    icon: FaUserMd,
    text: "How to book a doctor",
    prompt: "Can you guide me through the process of booking a doctor appointment?"
  },
  {
    icon: FaShieldAlt,
    text: "Insurance claim process",
    prompt: "How do I file a health insurance claim and what documents do I need?"
  },
  {
    icon: FaPills,
    text: "Medication guidance",
    prompt: "I need help understanding my prescription and how to take my medications properly."
  },
  {
    icon: FaFlask,
    text: "Lab test booking",
    prompt: "What's the process for booking lab tests and preparing for them?"
  },
  {
    icon: FaUserNurse,
    text: "When to call a nurse",
    prompt: "What symptoms or situations require calling a nurse for home care?"
  }
]

// Simulated AI responses based on common medical support queries
const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase()
  
  if (message.includes('emergency') || message.includes('urgent') || message.includes('ambulance')) {
    return `**Emergency Procedure Steps:**

🚨 **Immediate Actions:**
1. **Stay Calm** - Take a deep breath and assess the situation
2. **Call Emergency Services** - Dial **114** for ambulance in Mauritius
3. **Provide Clear Information** - Give your exact location, nature of emergency, and patient details

📞 **Emergency Contacts:**
• **Ambulance**: 114
• **Police**: 999
• **Fire Services**: 995
• **SAMU Emergency**: 114

🏥 **While Waiting for Help:**
- Keep the patient comfortable and still
- Do not move someone with potential spinal injuries
- Apply pressure to bleeding wounds with clean cloth
- Monitor breathing and consciousness

**Important**: If someone is unconscious, having chest pain, difficulty breathing, or severe bleeding, this is a medical emergency requiring immediate professional help.

Would you like specific guidance for any particular type of emergency?`
  }
  
  if (message.includes('doctor') && (message.includes('book') || message.includes('appointment'))) {
    return `**How to Book a Doctor Appointment:**

🩺 **Step-by-Step Process:**

1. **Choose Your Method:**
   - Visit our Doctors page on the website
   - Use the AI search to find specialists
   - Call the clinic directly

2. **Find the Right Doctor:**
   - Select your medical concern/specialty
   - Check doctor availability and ratings
   - Consider location and consultation fees

3. **Booking Process:**
   - Select preferred date and time slot
   - Choose consultation type (in-person/video)
   - Provide patient details and contact info
   - Upload insurance card if applicable

4. **Preparation for Appointment:**
   - Prepare list of symptoms and questions
   - Bring medical history and current medications
   - Arrive 15 minutes early for paperwork

📱 **Quick Booking**: Use our website's doctor search feature or call our helpline at **+230 xxx xxxx**

Need help finding a specific type of doctor or have questions about the booking process?`
  }
  
  if (message.includes('insurance') && (message.includes('claim') || message.includes('cover'))) {
    return `**Health Insurance Claim Process:**

📋 **Required Documents:**
- Original bills and receipts
- Discharge summary (for hospitalization)
- Doctor's prescription and reports
- Insurance card and policy documents
- Claim form (filled and signed)

📝 **Step-by-Step Filing:**

1. **Immediate Steps (within 24-48 hours):**
   - Inform your insurance company
   - Get pre-authorization for planned treatments
   - Keep all original documents safe

2. **Document Collection:**
   - Collect all medical bills and reports
   - Get detailed breakdown of charges
   - Obtain doctor's certificate if required

3. **Claim Submission:**
   - Fill claim form completely
   - Attach all required documents
   - Submit within policy time limit (usually 30-90 days)

4. **Follow-up:**
   - Track claim status online or via phone
   - Provide additional documents if requested

💡 **Pro Tips:**
- Keep copies of all documents
- Take photos of bills as backup
- Maintain a claim tracking file

Which specific aspect of insurance claims do you need more help with?`
  }
  
  if (message.includes('medicine') || message.includes('medication') || message.includes('prescription')) {
    return `**Medication Guidance & Safety:**

💊 **Prescription Management:**

**How to Read Prescriptions:**
- Drug name (generic and brand)
- Dosage strength and frequency
- Duration of treatment
- Special instructions (with/without food)

**Taking Medications Safely:**
1. **Follow Exact Dosage** - Never exceed or skip doses
2. **Timing Matters** - Take at prescribed intervals
3. **Food Instructions** - Some need food, others don't
4. **Complete the Course** - Especially for antibiotics

⚠️ **Important Safety Tips:**
- Check expiry dates before taking
- Store medications properly (cool, dry place)
- Never share prescription medicines
- Report side effects to your doctor

🛒 **Ordering Medicines:**
- Upload prescription on our Medicines page
- Choose home delivery or pharmacy pickup
- Check medicine authenticity and expiry
- Keep prescription for future reference

📞 **Pharmacist Consultation**: Available for questions about drug interactions, side effects, or proper usage.

Do you have specific questions about a particular medication or need help with prescription management?`
  }
  
  if (message.includes('lab test') || message.includes('blood test') || message.includes('diagnostic')) {
    return `**Lab Test Booking & Preparation:**

🔬 **Booking Process:**

1. **Choose Tests:**
   - Browse by category or search specific tests
   - Consider health packages for multiple tests
   - Check if doctor's prescription is required

2. **Preparation Instructions:**
   - **Fasting Tests**: No food/drink 8-12 hours before
   - **Regular Tests**: No special preparation needed
   - **Urine Tests**: Mid-stream sample, clean collection
   - **Special Tests**: Follow specific instructions provided

3. **Scheduling:**
   - Select home collection or lab visit
   - Choose convenient time slot
   - Confirm address for home collection

📋 **What to Expect:**
- Sample collection takes 5-15 minutes
- Results available digitally within specified time
- Reports can be shared with your doctor
- Follow-up consultation available if needed

🏠 **Home Collection Benefits:**
- Trained phlebotomists visit your home
- Safe and hygienic sample collection
- No need to travel, especially for elderly/sick patients
- Same day results for most tests

💰 **Cost Savings**: Health packages offer better value than individual tests.

Which specific tests are you interested in, or do you need help understanding test preparation requirements?`
  }
  
  if (message.includes('nurse') || message.includes('nursing') || message.includes('home care')) {
    return `**When to Call a Nurse - Guidelines:**

🏥 **Situations Requiring Nursing Care:**

**Immediate Nursing Needs:**
- Post-surgery wound care and dressing
- IV medication administration
- Catheter care and management
- Injection administration (insulin, vaccines)

**Chronic Condition Management:**
- Diabetes monitoring and insulin administration
- Blood pressure monitoring for hypertension
- Medication management for elderly
- Physical therapy and rehabilitation

⚠️ **Warning Signs to Call a Nurse:**
- Difficulty breathing or chest pain
- High fever that won't reduce
- Severe pain or discomfort
- Signs of infection (redness, swelling, discharge)
- Confusion or disorientation
- Inability to take medications

🔄 **Regular Nursing Services:**
- Daily medication reminders
- Vital signs monitoring
- Mobility assistance
- Personal hygiene support
- Companionship for elderly

📞 **How to Request Nursing Care:**
1. Assess the patient's needs
2. Contact our nursing services
3. Provide medical history and current condition
4. Schedule appropriate care level (hourly/daily/live-in)

**Emergency vs. Routine Care**: For emergencies, call **114** first, then arrange nursing follow-up care.

What specific nursing care situation are you dealing with?`
  }
  
  if (message.includes('childcare') || message.includes('nanny') || message.includes('babysitter')) {
    return `**Childcare Services Guidance:**

👶 **Types of Childcare Available:**

**Professional Options:**
- **Nannies**: Full-time professional childcare in your home
- **Au Pairs**: Live-in childcare with cultural exchange
- **Babysitters**: Flexible evening and weekend care
- **Childminders**: Registered home-based childcare

🔍 **How to Choose the Right Caregiver:**

1. **Assess Your Needs:**
   - Age of children and specific requirements
   - Hours needed (full-time/part-time/occasional)
   - Special needs (newborn care, special education)
   - Budget considerations

2. **Vetting Process:**
   - Check background verification
   - Review references and past experience
   - Verify certifications (CPR, First Aid)
   - Conduct in-person interviews

3. **Safety Considerations:**
   - Ensure caregiver has emergency contacts
   - Verify first aid training
   - Check identification and work permits
   - Establish clear communication protocols

👥 **Booking Process:**
- Use our Childcare search feature
- Filter by location, experience, and specialties
- Read reviews and ratings
- Contact caregivers directly
- Arrange trial sessions before committing

🚨 **Emergency Protocols**: Ensure your childcare provider knows emergency numbers, your child's medical information, and has written authorization for medical decisions if needed.

What specific type of childcare arrangement are you looking for?`
  }
  
  if (message.includes('navigation') || message.includes('website') || message.includes('app') || message.includes('how to use')) {
    return `**Website Navigation Guide:**

🗺️ **Main Service Categories:**

**Healthcare Services:**
- **Doctors**: Find and book consultations with specialists
- **Medicines**: Order prescriptions with home delivery
- **Lab Tests**: Book diagnostic tests with home collection
- **Insurance**: Compare and purchase health insurance plans

**Support Services:**
- **Nursing Care**: Professional home nursing services
- **Childcare**: Nannies, babysitters, and childminders
- **Emergency**: Ambulance and urgent care services

📱 **How to Use Each Section:**

1. **Finding Services:**
   - Use the search bar or browse categories
   - Apply filters (location, price, ratings)
   - Read reviews and compare options

2. **Booking Process:**
   - Select your preferred service provider
   - Choose date and time
   - Provide necessary details
   - Confirm booking and payment

3. **Account Management:**
   - Track your bookings and history
   - Manage insurance and payments
   - Access digital reports and prescriptions

💡 **Quick Tips:**
- Use the AI Assistant (that's me!) for instant help
- Save frequently used services to favorites
- Enable notifications for important updates
- Keep your profile and insurance info updated

🔍 **Search Features**:
- AI-powered search understands natural language
- Voice search available on mobile
- Barcode scanner for medicines
- Symptom checker for doctor recommendations

Which specific feature or service would you like help navigating?`
  }
  
  // Default response for general queries
  return `I understand you're looking for medical support guidance. I can help you with:

🏥 **Emergency & Urgent Care**
- Emergency procedure steps
- When to call an ambulance
- First aid guidance

👩‍⚕️ **Healthcare Services**
- Booking doctors and specialists
- Understanding lab tests and results
- Medication management and safety

💰 **Insurance & Administrative**
- Filing insurance claims
- Understanding coverage
- Required documentation

🏠 **Home Care Services**
- When to request nursing care
- Childcare safety guidelines
- Home health management

Could you please provide more specific details about what you need help with? For example:
- "How do I book a cardiologist?"
- "What should I do if someone is having chest pain?"
- "How do I file an insurance claim?"
- "What documents do I need for lab tests?"

I'm here to provide step-by-step guidance for any healthcare-related procedure or question you have.`
}

export default function AIMedicalChatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-green-800 to-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-400 to-green-400 p-3 rounded-full">
                <FaRobot className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">AI Medical Support Assistant</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Get instant guidance on medical procedures, emergency steps, booking services, and healthcare navigation
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-400" />
            Quick Help Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white hover:bg-white/20 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3">
                  <prompt.icon className="text-blue-400 text-lg" />
                  <span className="text-sm font-medium">{prompt.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <div className="h-96 md:h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-full self-start">
                    <FaRobot className="text-white text-sm" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                    }`}
                  >
                    <div className="prose prose-invert max-w-none">
                      {message.content.split('\n').map((line, i) => {
                        if (line.trim() === '') return <br key={i} />
                        if (line.includes('**')) {
                          const parts = line.split('**')
                          return (
                            <p key={i} className="mb-2">
                              {parts.map((part, j) => 
                                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                              )}
                            </p>
                          )
                        }
                        
                        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                          return (
                            <div key={i} className="flex items-start gap-2 mb-1">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{line.replace(/^[•-]\s*/, '')}</span>
                            </div>
                          )
                        }
                        
                        return <p key={i} className="mb-2">{line}</p>
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-white/60">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.type === 'assistant' && (
                      <div className="flex gap-1">
                        <button className="text-white/60 hover:text-green-400 transition-colors">
                          <FaThumbsUp className="text-xs" />
                        </button>
                        <button className="text-white/60 hover:text-red-400 transition-colors">
                          <FaThumbsDown className="text-xs" />
                        </button>
                        <button className="text-white/60 hover:text-blue-400 transition-colors">
                          <FaCopy className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-2 rounded-full self-start">
                    <FaUser className="text-white text-sm" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-full">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/20 p-4">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about medical procedures, emergency steps, booking guidance, or any healthcare question..."
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200"
              >
                <FaPaperPlane className="text-lg" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-white/60">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>AI Assistant Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-400 text-lg mt-1" />
            <div>
              <h4 className="text-yellow-200 font-semibold mb-1">Medical Disclaimer</h4>
              <p className="text-yellow-100/80 text-sm">
                This AI assistant provides general information and guidance only. For medical emergencies, call 114 immediately. 
                Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}