import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import backgroundImage from '../images/purebg.jpeg'


function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uname, setFname] = useState("");
  const [role, setRole] = useState("staff");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: uname,
        role: role,
        password: password
      });
  
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error creating user:", error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };


  return (
    <div className="flex p-5">
    <div className='flex w-full '>
      <div className="flex justify-center items-center rounded-xl drop-shadow-md w-[400px] bg-[#347928]">
        <form onSubmit={handleRegister}>
          <h3 className="text-3xl py-4 pt-5 text-[#FFFBE6]">Register your account</h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control pl-4 py-3 rounded-t-xl w-full text-xl text-black"
              placeholder="Username"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control pl-4 py-3 w-full text-xl text-black"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control pl-4 py-3 w-full rounded-b-xl text-xl text-black"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 flex">
            <div className="">
              <div className="flex text-">
                <label className="text-lg text-[#FFFBE6] mb-1">Position: </label>
              </div>
              <div>
                <select
                  className="form-control py-2 pl-3  text-black pr-2 rounded-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option className="text-black" value="admin">Admin</option>
                  <option className="text-black" value="staff">Staff</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex bg-[#FCCD2A] rounded-xl transition-all hover:scale-105 hover:bg-[#f0cb45] hover:drop-shadow-md  py-3 justify-center ">
            <button type="submit" className="btn btn-primary text-black font-bold text-xl ">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-[#FFFBE6] mt-2 mb-5 text-right">
            Already have an account? <a className="text-[#FCCD2A]" href="/Homepage">Sign In</a>
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}

export default CreateAccount;
