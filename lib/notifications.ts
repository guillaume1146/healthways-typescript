import prisma from '@/lib/db'
import { emitToUser } from '@/lib/socket-emitter'

interface CreateNotificationParams {
  userId: string
  type: string
  title: string
  message: string
  referenceId?: string
  referenceType?: string
}

export async function createNotification(params: CreateNotificationParams) {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      referenceId: params.referenceId || null,
      referenceType: params.referenceType || null,
    },
  })

  emitToUser(params.userId, 'notification:new', {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
    referenceId: notification.referenceId,
    referenceType: notification.referenceType,
  })

  return notification
}
