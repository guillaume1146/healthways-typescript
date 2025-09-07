import React, { useState, useRef, useEffect } from 'react'
import { Patient, ChatMessage } from '@/lib/data/patients'
import { 
  FaPaperPlane, 
  FaComments, 
  FaUser, 
  FaUserMd,
  FaUserNurse,
  FaBaby,
  FaAmbulance,
  FaVideo,
  FaPhone,
  FaFile,
  FaImage,
  FaMicrophone,
  FaStop,
  FaPlay,
  FaPause,
  FaDownload,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaCheck,
  FaCheckDouble,
  FaClock,
  FaExclamationTriangle,
  FaHeart,
  FaStar,
  FaCalendarAlt,
  FaPills,
  FaNotesMedical,
  FaStethoscope,
  FaCamera,
  FaSmile,
  FaThumbsUp,
  FaReply,
  FaForward,
  FaTrash,
  FaEdit,
  FaPaperclip,
  FaBell,
  FaTimes
} from 'react-icons/fa'

interface Props {
  patientData: Patient
  chatType: 'doctor' | 'nurse' | 'nanny' | 'emergency'
}

interface ExtendedChatMessage extends ChatMessage {
  reactions?: { emoji: string; count: number; users: string[] }[]
  replyTo?: string
  forwarded?: boolean
  edited?: boolean
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

// Avoid `any` while still allowing dynamic keys like doctorId/doctorName/etc.
interface LooseChat {
  [key: string]: unknown
  specialty?: string
  unreadCount?: number
  lastMessage: string
  lastMessageTime: string
  messages?: ChatMessage[]
}

interface ChatContact {
  id: string
  name: string
  role: string
  avatar?: string
  status: 'online' | 'offline' | 'busy' | 'away'
  lastSeen?: string
  specialty?: string
  unreadCount: number
  lastMessage: string
  lastMessageTime: string
  messages: ExtendedChatMessage[]
  isPinned?: boolean
}

const ChatComponent: React.FC<Props> = ({ patientData, chatType }) => {
  const [selectedChat, setSelectedChat] = useState<number>(0)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<ExtendedChatMessage | null>(null)
  const [showChatInfo, setShowChatInfo] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>(['DOC001', 'NUR001'])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat])

  const getChatData = (): ChatContact[] => {
    if (!patientData.chatHistory) return []
    
    const formatChatData = (chats: LooseChat[], type: 'doctor' | 'nurse' | 'nanny' | 'service'): ChatContact[] => {
      return chats.map(chat => {
        const id = (chat[`${type}Id`] as string) || (chat.serviceId as string)
        const name = (chat[`${type}Name`] as string) || (chat.serviceName as string)
        const isOnline = onlineUsers.includes(id)

        return {
          id,
          name,
          role: type,
          status: isOnline ? 'online' : 'offline',
          lastSeen: isOnline ? undefined : '2 hours ago',
          specialty: chat.specialty,
          unreadCount: chat.unreadCount || 0,
          lastMessage: chat.lastMessage,
          lastMessageTime: chat.lastMessageTime,
          messages: chat.messages?.map((msg: ChatMessage) => ({
            ...msg,
            reactions: [],
            priority: 'normal'
          })) || [],
          isPinned: false
        }
      })
    }

    switch (chatType) {
      case 'doctor':
        return formatChatData((patientData.chatHistory.doctors || []) as LooseChat[], 'doctor')
      case 'nurse':
        return formatChatData((patientData.chatHistory.nurses || []) as LooseChat[], 'nurse')
      case 'nanny':
        return formatChatData((patientData.chatHistory.nannies || []) as LooseChat[], 'nanny')
      case 'emergency':
        return formatChatData((patientData.chatHistory.emergencyServices || []) as LooseChat[], 'service')
      default:
        return []
    }
  }

  const chatData = getChatData()
  const filteredChats = chatData.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (chatData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100">
        <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <FaComments className="text-blue-500 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages</h3>
        <p className="text-gray-500 mb-6">You don&apos;t have any {chatType} messages yet</p>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all">
          Start a Conversation
        </button>
      </div>
    )
  }

  const currentChat = filteredChats[selectedChat]
  
  const getContactIcon = (role: string) => {
    switch (role) {
      case 'doctor': return FaUserMd
      case 'nurse': return FaUserNurse
      case 'nanny': return FaBaby
      case 'service': return FaAmbulance
      default: return FaUser
    }
  }

  const getContactColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'from-blue-500 to-blue-600'
      case 'nurse': return 'from-pink-500 to-pink-600'
      case 'nanny': return 'from-purple-500 to-purple-600'
      case 'service': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'away': return 'bg-yellow-500'
      default: return 'bg-gray-400'
    }
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return

    const message: ExtendedChatMessage = {
      id: Date.now().toString(),
      senderId: patientData.id,
      senderName: `${patientData.firstName} ${patientData.lastName}`,
      senderType: 'patient',
      message: newMessage,
      timestamp: new Date().toISOString(),
      attachments: selectedFile ? [selectedFile.name] : undefined,
      read: true,
      messageType: selectedFile ? (selectedFile.type.startsWith('image/') ? 'image' : 'file') : 'text',
      reactions: [],
      priority: 'normal'
    }

    // In a real app, this would send via WebSocket
    setNewMessage('')
    setSelectedFile(null)
    setReplyingTo(null)
    
    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 2000)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const startVideoCall = () => {
    // In a real app, this would initiate a video call
    alert(`Starting video call with ${currentChat.name}...`)
  }

  const startVoiceCall = () => {
    // In a real app, this would initiate a voice call
    alert(`Starting voice call with ${currentChat.name}...`)
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      setRecordingTime(0)
    } else {
      setIsRecording(true)
      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      setTimeout(() => {
        clearInterval(timer)
        setIsRecording(false)
        setRecordingTime(0)
      }, 60000) // Max 1 minute
    }
  }

  const addReaction = (messageId: string, emoji: string) => {
    // In a real app, this would update the message reactions
    console.log(`Adding reaction ${emoji} to message ${messageId}`)
  }

  const renderMessage = (message: ExtendedChatMessage, index: number) => {
    const isOwnMessage = message.senderType === 'patient'
    const ContactIcon = getContactIcon(currentChat.role)
    
    return (
      <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}>
        <div className={`flex items-start max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          {!isOwnMessage && (
            <div className={`flex-shrink-0 ${isOwnMessage ? 'ml-3' : 'mr-3'}`}>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getContactColor(currentChat.role)} flex items-center justify-center text-white`}>
                <ContactIcon className="text-sm" />
              </div>
              <div className={`w-3 h-3 ${getStatusColor(currentChat.status)} rounded-full border-2 border-white -mt-3 ml-7`}></div>
            </div>
          )}

          {/* Message Content */}
          <div className={`relative group-hover:shadow-md transition-all ${
            isOwnMessage 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-800'
          } rounded-2xl px-4 py-3 max-w-full`}>
            
            {/* Reply indicator */}
            {message.replyTo && (
              <div className={`text-xs mb-2 p-2 rounded-lg ${
                isOwnMessage ? 'bg-blue-400 bg-opacity-50' : 'bg-gray-100'
              }`}>
                <FaReply className="inline mr-1" />
                Replying to message
              </div>
            )}

            {/* Forwarded indicator */}
            {message.forwarded && (
              <div className={`text-xs mb-2 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                <FaForward className="inline mr-1" />
                Forwarded
              </div>
            )}

            {/* Priority indicator */}
            {message.priority === 'urgent' && (
              <div className="flex items-center mb-2">
                <FaExclamationTriangle className="text-red-400 mr-1" />
                <span className="text-xs text-red-400">Urgent</span>
              </div>
            )}

            {/* Message text */}
            {message.messageType === 'text' && (
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            )}

            {/* Image message */}
            {message.messageType === 'image' && (
              <div className="space-y-2">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <FaImage className="text-gray-400 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Image: {message.attachments?.[0]}</p>
                </div>
                {message.message && <p className="text-sm">{message.message}</p>}
              </div>
            )}

            {/* File message */}
            {message.messageType === 'file' && (
              <div className="space-y-2">
                <div className={`p-3 rounded-lg flex items-center gap-3 ${
                  isOwnMessage ? 'bg-blue-400 bg-opacity-50' : 'bg-gray-100'
                }`}>
                  <FaFile className="text-lg" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{message.attachments?.[0]}</p>
                    <p className="text-xs opacity-70">Click to download</p>
                  </div>
                  <FaDownload className="text-sm cursor-pointer hover:scale-110 transition" />
                </div>
                {message.message && <p className="text-sm">{message.message}</p>}
              </div>
            )}

            {/* Voice message */}
            {message.messageType === 'voice' && (
              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                isOwnMessage ? 'bg-blue-400 bg-opacity-50' : 'bg-gray-100'
              }`}>
                <button className="p-2 rounded-full bg-blue-500 text-white">
                  <FaPlay className="text-sm" />
                </button>
                <div className="flex-1">
                  <div className="w-24 h-1 bg-gray-300 rounded-full">
                    <div className="w-1/3 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-xs mt-1">0:15</p>
                </div>
              </div>
            )}

            {/* Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction, idx) => (
                  <button
                    key={idx}
                    onClick={() => addReaction(message.id, reaction.emoji)}
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                      isOwnMessage ? 'bg-blue-400 bg-opacity-50' : 'bg-gray-100'
                    } hover:scale-105 transition`}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Timestamp and status */}
            <div className={`flex items-center justify-between mt-2 text-xs ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {isOwnMessage && (
                <div className="flex items-center gap-1">
                  {message.edited && <FaEdit className="text-xs" />}
                  {message.read ? <FaCheckDouble className="text-blue-200" /> : <FaCheck />}
                </div>
              )}
            </div>

            {/* Message actions (shown on hover) */}
            <div className={`absolute ${isOwnMessage ? 'left-0 -ml-12' : 'right-0 -mr-12'} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col">
                <button
                  onClick={() => setReplyingTo(message)}
                  className="p-2 hover:bg-gray-50 text-gray-600 text-sm"
                >
                  <FaReply />
                </button>
                <button
                  onClick={() => addReaction(message.id, '👍')}
                  className="p-2 hover:bg-gray-50 text-gray-600 text-sm"
                >
                  <FaThumbsUp />
                </button>
                <button className="p-2 hover:bg-gray-50 text-gray-600 text-sm">
                  <FaForward />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-[600px] flex overflow-hidden">
      {/* Chat List Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {getContactIcon(chatType)({ className: 'text-lg' })}
              {chatType.charAt(0).toUpperCase() + chatType.slice(1)} Messages
            </h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <FaEllipsisV className="text-gray-500" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat, index) => {
            const ContactIcon = getContactIcon(chat.role)
            
            return (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(index)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition border-l-4 ${
                  selectedChat === index 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar with status */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getContactColor(chat.role)} flex items-center justify-center text-white`}>
                      <ContactIcon className="text-lg" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(chat.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  
                  {/* Chat info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">{chat.name}</p>
                      <div className="flex items-center gap-1">
                        {chat.isPinned && <FaStar className="text-yellow-500 text-xs" />}
                        <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                      </div>
                    </div>
                    
                    {chat.specialty && (
                      <p className="text-xs text-blue-600 mb-1">{chat.specialty}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {chat.status !== 'online' && chat.lastSeen && (
                      <p className="text-xs text-gray-400 mt-1">Last seen {chat.lastSeen}</p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getContactColor(currentChat.role)} flex items-center justify-center text-white`}>
                  {getContactIcon(currentChat.role)({ className: 'text-lg' })}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(currentChat.status)} rounded-full border-2 border-white`}></div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">{currentChat.name}</h3>
                <div className="flex items-center gap-2">
                  {currentChat.specialty && (
                    <span className="text-sm text-blue-600">{currentChat.specialty}</span>
                  )}
                  <span className="text-sm text-gray-500 capitalize">
                    {currentChat.status === 'online' ? 'Online' : `Last seen ${currentChat.lastSeen}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={startVoiceCall}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
              >
                <FaPhone />
              </button>
              
              <button
                onClick={startVideoCall}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                <FaVideo />
              </button>
              
              <button
                onClick={() => setShowChatInfo(!showChatInfo)}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                <FaEllipsisV />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {currentChat.messages.map((message, index) => renderMessage(message, index))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getContactColor(currentChat.role)} flex items-center justify-center text-white mr-3`}>
                  {getContactIcon(currentChat.role)({ className: 'text-sm' })}
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{currentChat.name} is typing...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800">Replying to {replyingTo.senderName}</p>
              <p className="text-xs text-blue-600 truncate">{replyingTo.message}</p>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* File preview */}
        {selectedFile && (
          <div className="px-4 py-2 bg-gray-50 border-l-4 border-gray-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedFile.type.startsWith('image/') ? (
                <FaImage className="text-blue-500" />
              ) : (
                <FaFile className="text-gray-500" />
              )}
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-3">
            {/* Attachment button */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 transition"
            >
              <FaPaperclip />
            </button>

            {/* Camera button */}
            <button className="p-2 text-gray-500 hover:text-gray-700 transition">
              <FaCamera />
            </button>
            
            {/* Message input */}
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder={`Message ${currentChat.name}...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none max-h-32"
                rows={1}
              />
              
              {/* Emoji button */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                <FaSmile />
              </button>
            </div>

            {/* Voice recording */}
            {isRecording ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg">
                  <FaMicrophone className="animate-pulse" />
                  <span className="text-sm font-medium">
                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <button
                  onClick={toggleRecording}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <FaStop />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleRecording}
                className="p-2 text-gray-500 hover:text-gray-700 transition"
              >
                <FaMicrophone />
              </button>
            )}

            {/* Send button */}
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() && !selectedFile}
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Info Sidebar */}
      {showChatInfo && (
        <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Contact info */}
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getContactColor(currentChat.role)} flex items-center justify-center text-white mx-auto mb-3`}>
                {getContactIcon(currentChat.role)({ className: 'text-2xl' })}
              </div>
              <h3 className="font-semibold text-lg">{currentChat.name}</h3>
              {currentChat.specialty && (
                <p className="text-blue-600 text-sm">{currentChat.specialty}</p>
              )}
              <p className="text-gray-500 text-sm capitalize">{currentChat.status}</p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={startVideoCall}
                className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-center"
              >
                <FaVideo className="text-lg mb-1" />
                <p className="text-sm">Video Call</p>
              </button>
              
              <button
                onClick={startVoiceCall}
                className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-center"
              >
                <FaPhone className="text-lg mb-1" />
                <p className="text-sm">Voice Call</p>
              </button>
            </div>

            {/* Medical quick actions */}
            {currentChat.role === 'doctor' && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Medical Actions</h4>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition text-left flex items-center gap-3">
                    <FaCalendarAlt />
                    <span className="text-sm">Book Appointment</span>
                  </button>
                  <button className="w-full p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-left flex items-center gap-3">
                    <FaPills />
                    <span className="text-sm">Request Prescription</span>
                  </button>
                  <button className="w-full p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-left flex items-center gap-3">
                    <FaNotesMedical />
                    <span className="text-sm">View Medical Records</span>
                  </button>
                </div>
              </div>
            )}

            {/* Chat settings */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Chat Settings</h4>
              <div className="space-y-2">
                <button className="w-full p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded">
                  <FaBell className="inline mr-2" />
                  Mute Notifications
                </button>
                <button className="w-full p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded">
                  <FaStar className="inline mr-2" />
                  Pin Conversation
                </button>
                <button className="w-full p-2 text-left text-sm text-red-600 hover:bg-red-50 rounded">
                  <FaTrash className="inline mr-2" />
                  Delete Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatComponent
