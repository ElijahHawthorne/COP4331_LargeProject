import { useState, useEffect } from "react";

function UserProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  return (
    <div>
      {firstName && lastName ? (
        <p className="font-mono text-[12px]">Signed in as {firstName} {lastName}</p>
      ) : (
        <p>User not signed in</p>
      )}
    </div>
  );
}

export default UserProfile;
