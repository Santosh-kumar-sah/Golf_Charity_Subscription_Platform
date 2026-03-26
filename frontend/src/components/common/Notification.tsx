import React from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
}

const Notification: React.FC<NotificationProps> = ({ message, type = "info" }) => {
  const bgColor = type === "success" ? "bg-green-500" :
                  type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className={`${bgColor} text-white p-4 rounded-md fixed top-4 right-4`}>
      {message}
    </div>
  );
};

export default Notification;