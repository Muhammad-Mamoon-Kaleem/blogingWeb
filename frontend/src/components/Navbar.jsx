import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const{token,setToken}=useContext(AppContext)

    const Logout=()=>{
        localStorage.removeItem('token')
        setToken(null)
        toast.success('Logout Successfully')
    }
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex justify-between items-center w-full p-2 bg-lime-300 ">
            {/* Logo Section */}
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/')}
            >
                {/* Icon */}
                <div className="bg-green-500 rounded-full p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                    >
                        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.6 5.7-4.4 9.4a14.2 14.2 0 0 1-2.6 2.6 14.2 14.2 0 0 1-2.6-2.6C6.6 14.7 5 11.5 5 9a7 7 0 0 1 7-7Zm0 2a5 5 0 0 0-5 5c0 1.6 1.2 4.3 3.9 8.2.6.9 1.2 1.6 1.7 2 .5-.4 1.1-1.1 1.7-2C15.8 13.3 17 10.6 17 9a5 5 0 0 0-5-5Zm0 3.5a1.5 1.5 0 0 1 1.5 1.5H15a3 3 0 0 0-3-3V8a1.5 1.5 0 0 1 1.5-1.5ZM10.5 9A1.5 1.5 0 0 1 12 7.5V6a3 3 0 0 0-3 3h1.5Z" />
                    </svg>
                </div>
                {/* Text */}
                <p className="text-2xl font-bold">
                    Eco<span className="text-green-500">Friendly</span>
                </p>
            </div>

            {/* Navigation Links for Desktop */}
            <div className="hidden md:flex justify-evenly flex-1">
            <NavLink
                    to="/all"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                            : 'text-lg font-semibold hover:text-green-500'
                    }
                >
                    All
                </NavLink>
                <NavLink
                    to="/allblogs/Eco-Products"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                            : 'text-lg font-semibold hover:text-green-500'
                    }
                >
                    Eco-Products
                </NavLink>
                <NavLink
                    to="/allblogs/Places"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                            : 'text-lg font-semibold hover:text-green-500'
                    }
                >
                    Places
                </NavLink>
                <NavLink
                    to="/allblogs/Green Environment"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                            : 'text-lg font-semibold hover:text-green-500'
                    }
                >
                    Green Environment
                </NavLink>
               {token && <NavLink
                    to="/myfavourite"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                            : 'text-lg font-semibold hover:text-green-500'
                    }
                >
                    My Favourites
                </NavLink>}
            </div>
             
            <div className="flex items-center space-x-4">
            <div className="md:hidden ">
                <button onClick={toggleMenu}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
                <button className="bg-green-500 font-semibold px-5 shadow-sm hover:scale-110 duration-300 shadow-green-300 py-1 text-white rounded-full" 
                onClick={token?Logout:()=>navigate('/login')}>
                    {token?'LogOut':"LogIn"}
                </button>
            </div>

            {/* Mobile Menu - Shows when isMenuOpen is true */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-lime-300 shadow-md z-10 transition-all duration-200">
                    <div className="flex flex-col items-center space-y-4 p-4">
                    <NavLink onClick={toggleMenu}
                            to="/all"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                                    : 'text-lg font-semibold hover:text-green-500'
                            }
                        >
                            All
                        </NavLink>
                        <NavLink onClick={toggleMenu}
                            to="/allblogs/Eco-Products"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                                    : 'text-lg font-semibold hover:text-green-500'
                            }
                        >
                            Eco-Products
                        </NavLink>
                        <NavLink onClick={toggleMenu}
                            to="/allblogs/Places"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                                    : 'text-lg font-semibold hover:text-green-500'
                            }
                        >
                            Places
                        </NavLink>
                        <NavLink onClick={toggleMenu}
                            to="/allblogs/Green Environment"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                                    : 'text-lg font-semibold hover:text-green-500'
                            }
                        >
                            Green Environment
                        </NavLink>
                        <NavLink onClick={toggleMenu}
                            to="/myfavourite"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-green-500 border-b-2 border-green-500 text-lg font-semibold'
                                    : 'text-lg font-semibold hover:text-green-500'
                            }
                        >
                            My Favourites
                        </NavLink>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
