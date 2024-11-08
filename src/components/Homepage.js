import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import backgroundImage from '../images/BGLOGIN.jpg';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from "react-toastify";
import LoadingButtons from './LoadingButtons';
import Require from '../images/LOGO2.jpg';

function Homepage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userRole = await getUserRole(user.uid);

            if (userRole === 'admin') {
                setLoading(false);
                navigate('/admin');
            } else if (userRole === 'staff') {
                setLoading(false);
                navigate('/staff');
            } else {
                setLoading(false);
                toast.error("Email or password is incorrect.", {
                    position: "top-center"
                });
            }
        } catch (error) {
            setLoading(false);
            toast.error("Email or password is incorrect.", {
                position: "top-center"
            });
        }
    };

    return (
        <div>
            <div className='cont w-full h-screen' style={appStyle}>
                <div className='flex bg-[#ffffff00] w-full h-screen justify-center items-center'>
                    <div className='flex w-[400px] justify-center rounded-xl drop-shadow-md bg-[#347928]'>
                        <div className='flex w-3/4 justify-center items-center'>
                            <div>
                                <form onSubmit={handleLogin}>
                                    <div className='flex justify-center'>
                                        <img className='my-8 rounded-lg drop-shadow-lg w-[200px]' src={Require} alt="Logo" />
                                    
                                    </div>
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
                                    <div className='flex mb-2 rounded-md overflow-hidden bg-white'>
                                        <input
                                            className='pl-5 focus:outline-none py-3 w-full text-black text-xl'
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder='Password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className='px-3 text-gray-500'
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                                    <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
                                                </svg>

                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                                </svg>

                                            )}
                                        </button>
                                    </div>
                                    <button
                                        className={`w-full bg-[#FCCD2A] text-xl ${loading ? 'cursor-not-allowed' : 'cursor-pointer'} text-black font-bold py-3 rounded-md hover:scale-105 hover:bg-[#f0cb45] hover:drop-shadow-md transition-all`}
                                        type='submit'
                                    >
                                        {loading ? <LoadingButtons /> : 'Log In'}
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
