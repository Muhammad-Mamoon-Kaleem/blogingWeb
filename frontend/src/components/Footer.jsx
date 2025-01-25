import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-lime-300 p-6 text-gray-700">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center md:items-start space-y-6 md:space-y-0 text-center md:text-left">
                {/* About Section */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-600">About Us</h3>
                    <p className="mt-2 text-sm">
                        EcoFriendly is dedicated to promoting sustainability by showcasing
                        eco-friendly products, pollution-free travel destinations, and tips for a greener environment. Join us in building a better future!
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-600">Quick Links</h3>
                    <ul className="mt-2 space-y-2">
                        <li>
                            <Link to="/" className="hover:text-green-500">
                                Eco-Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="hover:text-green-500">
                                Places
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="hover:text-green-500">
                                Green Environment
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-600">Contact Us</h3>
                    <ul className="mt-2 space-y-2">
                        <li>Email: support@ecofriendly.com</li>
                        <li>Phone: +123-456-7890</li>
                        <li>Address: 123 Green Lane, Eco City</li>
                    </ul>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t mt-6 pt-4 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} EcoFriendly. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
