// import PopUp from "@/components/popUp";
// import { useAllUserQuery } from "@/features/auth/authApi";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// export default function Home() {
//   const { data, isLoading, isError, refetch } = useAllUserQuery();
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     refetch();
//     setUsers(data?.users);
//   }, [data?.users]);

//   if (isLoading) {
//     <p>Loading.....</p>;
//   }

//   return (
//     <div className="home">
//       <h2>All Users</h2>
//       <div>
//         <table>
//           <thead>
//             <tr>
//               <th>UserID</th>
//               <th>Name</th>
//               <th>User Email</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users?.map((user) => {
//               return (
//                 <tr>
//                   <td>{user._id}</td>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useAllUserQuery } from "@/features/auth/authApi";
import { useEffect, useState } from "react";

export default function Home() {
  const { data, isLoading, isError, refetch } = useAllUserQuery();
  const [users, setUsers] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    refetch();
    setUsers(data?.users);
  }, [data?.users]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) return <p>Loading.....</p>;

  return (
    <div className="home">
      <h2>All Users</h2>
      <div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td className="copy-cell">
                  <span>{user._id}</span>
                  <span
                    className="copy-icon"
                    onClick={() => handleCopy(user._id)}
                    title="Copy ID"
                  >
                    📋
                  </span>
                  {copiedId === user._id && (
                    <span className="copied-tooltip">Copied!</span>
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
