import apiClient from '../core/apiClient';

export interface Notification {
  notificationId?: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read?: boolean;
  createdAt?: string;
}

export interface NotificationPreferences {
  rideRequests: boolean;
  rideStatusUpdates: boolean;
  systemNotifications: boolean;
}

export const notificationApi = {
  // Send a notification
  async sendNotification(notification: Notification): Promise<{ success: boolean; notificationId: string }> {
    const response = await apiClient.authenticatedRequest<{ success: boolean; notificationId: string }>('/notifications/send', {
      method: 'POST',
      data: notification
    });
    return response.data;
  },

  // Register FCM token with the backend
  async registerToken(userId: string, token: string): Promise<{ success: boolean }> {
    const response = await apiClient.authenticatedRequest<{ success: boolean }>('/notifications/tokens', {
      method: 'POST',
      data: { userId, token }
    });
    return response.data;
  },

  // Get user's notification history
  async getNotifications(limit: number = 20, offset: number = 0): Promise<Notification[]> {
    const response = await apiClient.authenticatedRequest<Notification[]>('/notifications', {
      method: 'GET',
      params: { limit, offset }
    });
    return response.data;
  },

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    const response = await apiClient.authenticatedRequest<{ success: boolean }>(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
    return response.data;
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    const response = await apiClient.authenticatedRequest<{ success: boolean; count: number }>('/notifications/read-all', {
      method: 'PUT'
    });
    return response.data;
  },

  // Get current notification preferences
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.authenticatedRequest<NotificationPreferences>('/notifications/preferences', {
      method: 'GET'
    });
    return response.data;
  },
  
  // Update notification preferences
  async updateNotificationPreferences(preferences: NotificationPreferences): Promise<{ success: boolean }> {
    const response = await apiClient.authenticatedRequest<{ success: boolean }>('/notifications/preferences', {
      method: 'PUT',
      data: preferences
    });
    return response.data;
  }
};

export default notificationApi;