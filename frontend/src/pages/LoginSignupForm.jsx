import React, { useContext, useState } from 'react';
import axios from 'axios'
import { AppContext } from '../context/AppContext';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const LoginSignupForm = () => {
    const {backendUrl,setToken,token,logInuser,registerUser,sendConfirmationCode,changePassword} = useContext(AppContext)
    const [isSignup, setIsSignup] = useState(false);
    
    const navigate = useNavigate()
    const [forgetPassword, setForgetPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        confirmationCode: '',
    });
    const [errors, setErrors] = useState({});
    const [agreedToSendCode, setAgreedToSendCode] = useState(false);

    // Toggle between Login and Signup
    const toggleForm = () => {
        setIsSignup(!isSignup);
        setForgetPassword(false);
        resetForm();
    };

    // Toggle Forget Password form
    const toggleForgetPasswordForm = () => {
        setForgetPassword(false);
        setIsSignup(false); // Ensure we return to the login state
        resetForm();
    };

    const forgetPasswordForm = () => {
        setForgetPassword(true);
        setIsSignup(false);
        resetForm();
    };

    // Reset form data and errors
    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            confirmationCode: '',
        });
        setErrors({});
    };

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (forgetPassword) {
            changePassword(formData,resetForm)
           setForgetPassword(false)
            console.log('Forget Password data:', formData);
        }
         else if (isSignup) {
            registerUser(formData,resetForm)
            setIsSignup(false)
        } 
        else {
            logInuser(formData.email,formData.password,resetForm)
        }
    };

    
    // Form Validation
    const validateForm = () => {
        const errors = {};
        if (isSignup && !formData.name) {
            errors.name = 'Name is required';
        }
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        if ((isSignup || forgetPassword) && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        if (isSignup || forgetPassword) {
            if (!formData.confirmationCode) {
                errors.confirmationCode = 'Confirmation code is required';
            }
        }
        return errors;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-lime-100">
            <div className="w-96 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-green-600 text-center mb-6">
                    {forgetPassword
                        ? 'Reset Your Password'
                        : isSignup
                        ? 'Create an Account'
                        : 'Welcome Back'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && !forgetPassword && (
                        <div>
                            <label className="block text-gray-700 font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">
                            {forgetPassword ? 'New Password' : 'Password'}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>
                    {(isSignup || forgetPassword) && (
                        <div>
                            <label className="block text-gray-700 font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}
                    {(isSignup || forgetPassword) && (
                        <div>
                            <label className="block text-gray-700 font-medium">Confirmation Code</label>
                            <input
                                type="text"
                                name="confirmationCode"
                                value={formData.confirmationCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="Enter confirmation code"
                            />
                            {errors.confirmationCode && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmationCode}
                                </p>
                            )}
                        </div>
                    )}
                    {(isSignup || forgetPassword) && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="agreeToSendCode"
                                checked={agreedToSendCode}
                                onChange={(e) => setAgreedToSendCode(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-green-500"
                            />
                            <label htmlFor="agreeToSendCode" className="text-gray-700">
                                Agree to send confirmation code
                            </label>
                            <button
                                type="button"
                                onClick={()=>sendConfirmationCode(formData.email)}
                                disabled={!agreedToSendCode}
                                className={`text-sm px-2 py-1 rounded-md ${
                                    agreedToSendCode
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Send Code
                            </button>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md shadow-lg hover:bg-green-600 transition duration-300"
                    >
                        {forgetPassword
                            ? 'Reset Password'
                            : isSignup
                            ? 'Sign Up'
                            : 'Log In'}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-6">
                    {forgetPassword
                        ? 'Remember your password?'
                        : isSignup
                        ? 'Already have an account?'
                        : "Don't have an account?"}{' '}
                    <button
                        onClick={forgetPassword ? toggleForgetPasswordForm : toggleForm}
                        className="text-green-500 underline font-medium"
                    >
                        {forgetPassword
                            ? 'Log In'
                            : isSignup
                            ? 'Log In'
                            : 'Sign Up'}
                    </button>
                </p>
                {!forgetPassword && (
                    <p
                        className="text-center mt-2 text-sm text-green-500 underline cursor-pointer"
                        onClick={forgetPasswordForm}
                    >
                        Forget Password?
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoginSignupForm;
