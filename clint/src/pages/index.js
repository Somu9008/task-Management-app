import PopUp from "@/components/popUp";
import { useAllUserQuery } from "@/features/auth/authApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { data, isLoading, isError, refetch } = useAllUserQuery();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    refetch();
    setUsers(data?.users);
  }, [data?.users]);

  if (isLoading) {
    <p>Loading.....</p>;
  }

  return (
    <div className="home">
      <h2>All Users</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>UserID</th>
              <th>Name</th>
              <th>User Email</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              return (
                <tr>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
