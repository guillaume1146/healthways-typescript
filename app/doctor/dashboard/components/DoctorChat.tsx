import React, { useState, useRef, useEffect } from 'react'
import type { IconType } from 'react-icons'
import {
  FaComments,
  FaPaperPlane,
  FaSearch,
  FaFilter,
  FaCheckDouble,
  FaCheck,
  FaPaperclip,
  FaImage,
  FaFile,
  FaMicrophone,
  FaVideo,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
  FaBell,
  FaArchive,
  FaStar,
  FaInfoCircle,
  FaSmile,
  FaTimes
} from 'react-icons/fa'

/* ---------------- Types ---------------- */

type PatientStatus = 'online' | 'offline' | 'away'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderType: 'doctor' | 'patient'
  message: string
  timestamp: string
  attachments?: string[]
  read: boolean
  messageType: 'text' | 'image' | 'file' | 'voice'
}

interface PatientChat {
  patientId: string
  patientName: string
  status: PatientStatus
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: Message[]
}

interface DoctorData {
  patientChats: PatientChat[]
  // allow extra fields without widening to any
  [key: string]: unknown
}

interface Props {
  doctorData: DoctorData
}

interface FilterOptions {
  status: 'all' | PatientStatus
  unread: 'all' | 'unread' | 'read'
  dateRange: 'all' | 'today' | 'week' | 'month'
}

/* ---------------- Component ---------------- */

const DoctorChat: React.FC<Props> = ({ doctorData }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived' | 'starred'>('all')
  const [selectedChat, setSelectedChat] = useState<PatientChat | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    unread: 'all',
    dateRange: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string>('all')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [isTyping] = useState(false) // setter removed (was unused)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get chat data
  const patientChats: PatientChat[] = doctorData?.patientChats ?? []

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedChat])

  // Filter chats
  const filterChats = (chatList: PatientChat[]): PatientChat[] => {
    return chatList.filter((chat) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        chat.patientName?.toLowerCase().includes(q) ||
        chat.lastMessage?.toLowerCase().includes(q)

      const matchesStatus = filters.status === 'all' || chat.status === filters.status
      const matchesUnread =
        filters.unread === 'all' ||
        (filters.unread === 'unread' ? chat.unreadCount > 0 : chat.unreadCount === 0)

      return matchesSearch && matchesStatus && matchesUnread
    })
  }

  const sections: {
    id: 'all' | 'unread' | 'archived' | 'starred'
    label: string
    icon: IconType
    color: 'blue' | 'green' | 'purple' | 'yellow'
    count?: number
  }[] = [
    { id: 'all', label: 'All Chats', icon: FaComments, color: 'blue', count: patientChats.length },
    {
      id: 'unread',
      label: 'Unread',
      icon: FaBell,
      color: 'green',
      count: patientChats.filter((c: PatientChat) => c.unreadCount > 0).length
    },
    { id: 'archived', label: 'Archived', icon: FaArchive, color: 'purple', count: 0 },
    { id: 'starred', label: 'Starred', icon: FaStar, color: 'yellow', count: 0 }
  ]

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) setExpandedSection('')
    else {
      setExpandedSection(sectionId)
      setActiveTab(sectionId as typeof activeTab)
    }
  }

  const getStatusColor = (status: PatientStatus | string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-gray-400'
      case 'away':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-400'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim() && selectedChat) {
      // Add message logic here
      // eslint-disable-next-line no-console
      console.log('Sending message:', messageInput)
      setMessageInput('')
    }
  }

  const renderChatCard = (chat: PatientChat) => (
    <div
      key={chat.patientId}
      onClick={() => setSelectedChat(chat)}
      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all ${
        selectedChat?.patientId === chat.patientId
          ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300'
          : 'bg-gradient-to-br from-white/80 to-gray-50/30 hover:from-gray-50 hover:to-blue-50/30 border border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
            {chat.patientName
              ?.split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(chat.status)}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{chat.patientName}</h4>
            <span className="text-xs text-gray-500">{formatTimestamp(chat.lastMessageTime)}</span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
            {chat.unreadCount > 0 && (
              <span className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderMessage = (message: Message) => {
    const isDoctor = message.senderType === 'doctor'
    return (
      <div key={message.id} className={`flex ${isDoctor ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}>
        <div className={`max-w-[70%] ${isDoctor ? 'order-2' : 'order-1'}`}>
          <div className={`flex items-end gap-2 ${isDoctor ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                isDoctor
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }`}
            >
              {message.senderName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div
              className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                isDoctor
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800'
              }`}
            >
              <p className="text-xs sm:text-sm">{message.message}</p>
              <div
                className={`flex items-center gap-1 mt-1 text-xs ${
                  isDoctor ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                <span>
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {isDoctor && (message.read ? <FaCheckDouble className="text-blue-200" /> : <FaCheck className="text-blue-300" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderChatWindow = () => {
    if (!selectedChat) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8">
          <FaComments className="text-6xl text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">Select a conversation to start messaging</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-white/90 to-blue-50/30 rounded-xl sm:rounded-2xl border border-gray-200">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 sm:p-4 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {selectedChat.patientName
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                    selectedChat.status
                  )}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">{selectedChat.patientName}</h3>
                <p className="text-xs text-blue-100">{selectedChat.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/20 rounded-lg transition">
                <FaPhone className="text-sm sm:text-base" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition">
                <FaVideo className="text-sm sm:text-base" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition">
                <FaInfoCircle className="text-sm sm:text-base" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-lg transition lg:hidden" onClick={() => setSelectedChat(null)}>
                <FaTimes className="text-sm sm:text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {selectedChat.messages?.map((message) => renderMessage(message))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Patient is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-b-xl sm:rounded-b-2xl">
          <form onSubmit={sendMessage} className="flex items-end gap-2">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition"
              >
                <FaPaperclip className="text-sm sm:text-base" />
              </button>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition"
              >
                <FaSmile className="text-sm sm:text-base" />
              </button>
            </div>

            <div className="flex-1 relative">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg sm:rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base"
                rows={1}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(e)
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaPaperPlane className="text-sm sm:text-base" />
            </button>
          </form>

          {/* Attachment Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm">
                <FaImage className="text-blue-500" /> Image
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm">
                <FaFile className="text-green-500" /> Document
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2 text-sm">
                <FaMicrophone className="text-red-500" /> Voice Note
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderChatList = () => {
    const base = activeTab === 'unread'
      ? patientChats.filter((c: PatientChat) => c.unreadCount > 0)
      : patientChats

    const items = filterChats(base)

    return (
      <div className="space-y-2 sm:space-y-3">
        {items.map(renderChatCard)}

        {filterChats(patientChats).length === 0 && (
          <div className="text-center py-8">
            <FaComments className="text-gray-400 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">No conversations found</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaComments className="mr-2 sm:mr-3" />
              Patient Messages
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Chat with your patients</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientChats.length}</p>
              <p className="text-xs opacity-90">Total</p>
            </div>
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {patientChats.filter((c: PatientChat) => c.unreadCount > 0).length}
              </p>
              <p className="text-xs opacity-90">Unread</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">
                {patientChats.filter((c: PatientChat) => c.status === 'online').length}
              </p>
              <p className="text-xs opacity-90">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm sm:text-base"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-lg sm:rounded-xl hover:from-gray-200 hover:to-slate-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaFilter />
            <span className="hidden sm:inline">Filters</span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="away">Away</option>
            </select>

            <select
              value={filters.unread}
              onChange={(e) => setFilters({ ...filters, unread: e.target.value as FilterOptions['unread'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterOptions['dateRange'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        )}
      </div>

      {/* Mobile View - Accordion */}
      <div className="lg:hidden">
        {!selectedChat ? (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {sections.map((section) => (
              <div key={section.id} className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-all ${
                    expandedSection === section.id
                      ? `bg-gradient-to-r from-${section.color}-50 to-${section.color}-100/50`
                      : 'bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <section.icon className={`text-${section.color}-500`} />
                    <span
                      className={`font-medium ${
                        expandedSection === section.id ? `text-${section.color}-700` : 'text-gray-700'
                      }`}
                    >
                      {section.label}
                    </span>
                    {typeof section.count === 'number' && section.count > 0 && (
                      <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">{section.count}</span>
                    )}
                  </div>
                  {expandedSection === section.id ? (
                    <FaChevronUp className={`text-${section.color}-500`} />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>
                {expandedSection === section.id && <div className="p-4 bg-white/60">{renderChatList()}</div>}
              </div>
            ))}
          </div>
        ) : (
          renderChatWindow()
        )}
      </div>

      {/* Desktop View - Split Screen */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:h-[600px]">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {sections.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 px-3 py-3 text-center font-medium transition-all flex items-center justify-center gap-1 text-xs xl:text-sm ${
                    activeTab === tab.id
                      ? `text-${tab.color}-600 border-b-2 border-current bg-gradient-to-b from-${tab.color}-50 to-transparent`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="text-sm" />
                  <span className="hidden xl:inline">{tab.label}</span>
                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List Content */}
          <div className="p-4 overflow-y-auto h-[calc(100%-48px)]">{renderChatList()}</div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">{renderChatWindow()}</div>
      </div>
    </div>
  )
}

export default DoctorChat
