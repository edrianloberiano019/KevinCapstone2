import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import backgroundImage from '../images/purebg.jpeg';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from "react-toastify";

function Homepage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const appStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        color: 'white',
    };

    const getUserRole = async (uid) => {
        const userDoc = doc(db, "users", uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            return userSnap.data().role;
        }
        return null;
    };


    // const goingtoregistration = async (e) => {
    //     e.preventDefault();

    //     navigate('/CreateAccount')
    // }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            //const user = userCredential.users;
            const userRole = await getUserRole(user.uid);
            if (userRole === 'admin') {
                navigate('/admin');
            } else if (userRole === 'staff') {
                navigate('/staff');
            } else {
                toast.error("Email or password is incorrect.", {
                    position: "top-center"
                });
            }

            // console.log('User signed in:', user.uid); 

            // const userRole = await getUserRole(user.uid);
            // console.log('User role:', userRole); 

            // if (userRole === 'admin') {
            //     alert('Logging in as admin...');
            //     navigate('/admin'); 
            // } else if (userRole === 'staff') {
            //     alert('Logging in as staff...');
            //     navigate('/staff'); 
            // } else {
            //     alert('No valid role found.'); 
            // }
        } catch (error) {
            toast.error("Email or password is incorrect.", {
                position: "top-center"
            });
        }
    };


    return (
        <div>
            <div className='cont w-full h-screen' style={appStyle}>
                <div className='flex bg-[#ffffff56] w-full h-screen justify-center items-center'>
                    <div className='flex w-[400px] justify-center rounded-xl drop-shadow-md bg-[#347928]'>
                        <div className='flex w-3/4 justify-center items-center'>
                            <div className=''>
                                <form onSubmit={handleLogin}>
                                    <h3 className="text-3xl py-4 pt-8 text-[#FFFBE6]">Log In</h3>

                                    <div className='flex mb-2 rounded-md overflow-hidden'>
                                        <input
                                            className='pl-4 focus:outline-none py-3 w-full text-xl text-black'
                                            type='email'
                                            placeholder='Email or username'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='flex mb-2 rounded-md overflow-hidden'>
                                        <input
                                            className='pl-5 focus:outline-none py-3 w-full text-black text-xl'
                                            type='password'
                                            placeholder='Password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        className='w-full bg-[#FCCD2A] text-xl text-black font-bold py-3 rounded-md hover:scale-105 hover:bg-[#f0cb45] hover:drop-shadow-md transition-all'
                                        type='submit'
                                    >
                                        Log In
                                    </button>
                                </form>
                                <div className='flex justify-end'>
                                    <a href='/' className='text-sm mt-2 mb-8'>Forgot password?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
