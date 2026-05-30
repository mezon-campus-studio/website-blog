import prisma from "@/lib/prisma";
import { io } from "@/websocket/socket";
import { NotificationType } from "@prisma/client";

interface INotificationPayload {
    userId: string;
    targetId: string;
    postId?: string;
    type: NotificationType;
    message: string;
}

export const notificationWorker = async (
    payload: INotificationPayload,
) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: payload.targetId, // Recipient
        targetId: payload.userId, // Actor
        postId: payload.postId,
        type: payload.type,
        message: payload.message,
        createdBy: payload.userId, // Actor
        updatedBy: payload.userId, // Actor
      },
    });

    io.to(payload.targetId).emit(
        "notification:new",
        notification,
    )
  } catch (error) {
    console.error('Notification worker error:', error);
  }

}
