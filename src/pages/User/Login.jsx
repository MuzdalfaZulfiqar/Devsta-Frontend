// import { useState } from "react";
// import { login, googleLogin } from "../../api/auth";
// import { useAuth } from "../../context/AuthContext";

// export default function Login() {
//   const { loginUser } = useAuth();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await login(form);
//       loginUser(data.user);
//     } catch (err) {
//       console.error(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-black">
//       <div className="w-full max-w-md rounded-2xl bg-primary p-6 text-white shadow-lg">
//         <h2 className="text-2xl font-bold mb-4">Login to Devsta 🚀</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full p-2 rounded-md text-black"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full p-2 rounded-md text-black"
//           />
//           <button type="submit" className="w-full py-2 rounded-md bg-black text-white hover:bg-gray-800">
//             Login
//           </button>
//         </form>

//         <button
//           onClick={googleLogin}
//           className="mt-4 w-full py-2 rounded-md bg-white text-black hover:bg-gray-200"
//         >
//           Continue with Google
//         </button>
//       </div>
//     </div>
//   );
// }
