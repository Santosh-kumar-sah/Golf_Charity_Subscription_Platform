import React, { createContext, type ReactNode } from "react";

type NotificationType = "success" | "error" | "info";

export interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notify: () => {}, // default noop
});

interface Props {
  children: ReactNode;
}

export const NotificationProvider: React.FC<Props> = ({ children }) => {
  const notify = (message: string, type: NotificationType = "info") => {
    // You can implement a toast/alert here
    alert(`${type.toUpperCase()}: ${message}`);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  );
};