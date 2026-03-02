'use client'

import { useState, useEffect } from 'react'
import { FaVideo, FaCalendarAlt, FaClock, FaUser, FaSpinner, FaArrowLeft, FaHistory } from 'react-icons/fa'
import VideoConsultation from './VideoConsultation'

interface VideoRoom {
  id: string
  roomId: string
  scheduledAt: string
  endedAt?: string
  status: string
  reason: string
  duration: number
  participantName: string
  participantImage: string | null
  type: string
}

interface VideoCallRoomsListProps {
  currentUser: {
    id: string
    firstName: string
    lastName: string
    userType: string
  }
}

export default function VideoCallRoomsList({ currentUser }: VideoCallRoomsListProps) {
  const [rooms, setRooms] = useState<VideoRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/video/rooms')
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setRooms(json.data || [])
          }
        }
      } catch (error) {
        console.error('Failed to fetch video rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [currentUser.id])

  // If a room is selected, show the VideoConsultation component
  if (selectedRoom) {
    return (
      <div>
        <button
          onClick={() => setSelectedRoom(null)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft /> Back to Rooms List
        </button>
        <VideoConsultation
          currentUser={{
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            userType: currentUser.userType,
            upcomingAppointments: rooms
              .filter(r => isUpcoming(r) || isActive(r))
              .map(r => ({
                id: r.id,
                type: 'video' as const,
                participantName: r.participantName,
                date: r.scheduledAt,
                time: new Date(r.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                reason: r.reason,
                roomId: r.roomId,
              })),
          }}
        />
      </div>
    )
  }

  const now = new Date()

  const filteredRooms = rooms.filter(room => {
    if (filter === 'upcoming') return isUpcoming(room) || isActive(room)
    if (filter === 'past') return !isUpcoming(room) && !isActive(room)
    return true
  })

  const upcomingRooms = rooms.filter(r => isUpcoming(r) || isActive(r))
  const pastRooms = rooms.filter(r => !isUpcoming(r) && !isActive(r))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaVideo className="text-green-500" />
            Video Consultations
          </h1>
          <p className="text-gray-500 mt-1">Manage your video call rooms and join consultations</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All ({rooms.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Upcoming ({upcomingRooms.length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'past' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Past ({pastRooms.length})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <FaSpinner className="animate-spin text-3xl text-green-500" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRooms.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <FaVideo className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {filter === 'upcoming' ? 'No Upcoming Video Calls' : filter === 'past' ? 'No Past Video Calls' : 'No Video Calls Yet'}
          </h3>
          <p className="text-gray-500">
            {filter === 'upcoming'
              ? 'When you book a video consultation, it will appear here with a Join button.'
              : 'Your video consultation history will appear here.'}
          </p>
        </div>
      )}

      {/* Rooms List */}
      {!loading && filteredRooms.length > 0 && (
        <div className="space-y-4">
          {filteredRooms.map((room) => {
            const upcoming = isUpcoming(room) || isActive(room)
            const scheduledDate = new Date(room.scheduledAt)

            return (
              <div
                key={`${room.roomId}-${room.id}`}
                className={`bg-white rounded-2xl p-5 shadow-lg border-l-4 transition-all hover:shadow-xl ${
                  upcoming ? 'border-green-500' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Participant Avatar */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      upcoming ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {room.participantImage ? (
                        <img src={room.participantImage} alt={room.participantName} className="w-14 h-14 rounded-full" />
                      ) : (
                        <FaUser />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{room.participantName}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-xs" />
                          {scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-xs" />
                          {scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {room.duration && (
                          <span className="text-gray-400">{room.duration} min</span>
                        )}
                      </div>
                      {room.reason && room.reason !== 'Video Session' && (
                        <p className="text-sm text-gray-400 mt-1">{room.reason}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(room.status, upcoming)}`}>
                      {upcoming ? 'Upcoming' : room.status === 'completed' ? 'Completed' : room.status}
                    </span>

                    {/* Join Button */}
                    {upcoming && room.roomId && (
                      <button
                        onClick={() => setSelectedRoom(room.roomId)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <FaVideo />
                        Join Call
                      </button>
                    )}

                    {!upcoming && (
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <FaHistory />
                        <span>Ended</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function isUpcoming(room: VideoRoom): boolean {
  const now = new Date()
  const scheduled = new Date(room.scheduledAt)
  return scheduled > now && (room.status === 'upcoming' || room.status === 'pending' || room.status === 'confirmed')
}

function isActive(room: VideoRoom): boolean {
  return room.status === 'active' || room.status === 'upcoming'
}

function getStatusBadgeColor(status: string, upcoming: boolean): string {
  if (upcoming) return 'bg-green-100 text-green-800'
  switch (status) {
    case 'completed': return 'bg-gray-100 text-gray-600'
    case 'cancelled': return 'bg-red-100 text-red-600'
    case 'active': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-600'
  }
}
