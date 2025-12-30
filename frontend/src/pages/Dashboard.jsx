// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("atp_token");
//     navigate("/login");
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h1>Dashboard</h1>
//       <p>You are logged in 🎉</p>

//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }



import React from "react";

export default function Dashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>
      <p>If you see this, routing to Dashboard works.</p>
    </div>
  );
}
