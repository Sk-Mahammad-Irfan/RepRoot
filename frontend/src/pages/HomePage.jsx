import { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/get-users`
      );
      setUsers(data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  // console.log(users);
  // console.log(users[2]?.username);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main page of the application.</p>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            Name: {user.username} | Email: {user.email} | Role: {user.role}
          </li> // Adjust field names as needed
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
