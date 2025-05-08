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

import { Copy } from "lucide-react"; // Icon from lucide-react
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
                <tr key={user._id}>
                  <td className="flex items-center gap-2">
                    {user._id}
                    <Copy
                      className="w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => handleCopy(user._id)}
                    />
                    {copiedId === user._id && (
                      <span className="text-green-500 text-xs">Copied!</span>
                    )}
                  </td>
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
