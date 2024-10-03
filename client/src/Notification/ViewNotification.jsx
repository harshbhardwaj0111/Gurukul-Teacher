import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/notifications/getNotification');
        const allNotifications = response.data;
        const filteredNotifications = allNotifications
          .filter((notification) => notification.sendTo === 'teachers' || notification.sendTo === 'both')
          .map((notification) => ({
            ...notification,
            deleteDate: new Date(notification.deleteDate).toISOString().split('T')[0],
          }));

        // Sort notifications by deleteDate in descending order (newest first)
        const sortedNotifications = filteredNotifications.sort((a, b) => new Date(b.deleteDate) - new Date(a.deleteDate));

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // End loading after fetch
      }
    };

    fetchNotifications();
  }, []);

  // Helper function to format date in dd-mm-yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center sm:p-2">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-2 sm:p-4 sm:mt-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">
        <i class="md:hidden fas fa-bell mr-2 text-blue-800"></i>Teacher Notifications
        </h2>

        {/* Loader while fetching */}
        {loading ? (
          <div className="flex justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 sm:h-10 sm:w-10 mb-2"></div>
          </div>
        ) : (
          <>
            {/* Notification List */}
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 text-sm sm:text-base">No notifications available at the moment.</p>
            ) : (
              <ul className="space-y-3 sm:space-y-4">
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className={`bg-white border ${new Date(notification.deleteDate) < new Date() ? 'border-red-300' : 'border-gray-200'} 
                    rounded-lg p-2 sm:p-3 shadow-md transition-transform transform hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className={`text-xs sm:text-sm md:text-base ${new Date(notification.deleteDate) < new Date() ? 'text-red-500' : 'text-gray-500'} mt-1 md:mt-0`}>
                        {/* Format the deleteDate to dd-mm-yyyy */}
                        <i className="md:hidden fas fa-calendar-alt text-yellow-800 mr-2"></i>{formatDate(notification.deleteDate)}
                      </p>
                    </div>

                    <p className="text-gray-700 mt-2 sm:mt-3 text-xs sm:text-sm">{notification.content}</p>

                    {/* Attachment Icon */}
                    {notification.attachFile && (
                      <a
                        href={notification.attachFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 mt-2 inline-flex items-center text-xs sm:text-sm hover:underline"
                      >
                        <i className="md:hidden fas fa-paperclip mr-2"></i> View Attachment
                      </a>
                    )}

                    {/* Expired Notification Alert */}
                    {new Date(notification.deleteDate) < new Date() && (
                      <div className="mt-2 text-red-500 flex items-center text-xs sm:text-sm">
                        <i className="md:hidden fas fa-exclamation-circle mr-2"></i> This notification has expired.
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Notification;
