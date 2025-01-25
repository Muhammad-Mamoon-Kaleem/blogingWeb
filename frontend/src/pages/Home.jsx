import React from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate=useNavigate()
    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-gray-100">
                <div className="relative h-[70vh] w-full">
                    <img
                        src={assets.hero}
                        alt="Hero"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-center items-center text-center text-white">
                        <h1 className="text-4xl md:text-6xl font-bold">
                            Let's Build a Greener Planet
                        </h1>
                        <p className="mt-4 text-lg md:text-xl">
                            Together, we can reduce pollution and restore nature's balance.
                        </p>
                        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300" onClick={()=>navigate('/all')}>
                            Read Blogs
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-12 px-6 bg-white text-gray-800">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-green-600">
                        The Power of Nature
                    </h2>
                    <p className="mt-4 text-center text-lg leading-relaxed">
                        Trees and plants are nature's air purifiers. They absorb carbon dioxide, release oxygen, and filter harmful pollutants. Without them, our planet's delicate balance is at risk. Did you know a single tree can absorb up to 48 pounds of carbon dioxide per year? Planting trees is one of the simplest yet most effective ways to combat climate change.
                    </p>
                </div>
            </section>

            {/* Highlights Section */}
            <section className="py-12 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Highlight 1 */}
                    <div className="p-6 bg-white shadow-md rounded-lg text-center">
                        <div className="bg-green-500 w-16 h-16 mx-auto flex items-center justify-center rounded-full text-white text-2xl mb-4">
                            🌳
                        </div>
                        <h3 className="text-xl font-bold">Benefits of Trees</h3>
                        <p className="mt-2 text-gray-600">
                            Trees improve air quality, conserve water, and support wildlife. Urban green spaces can reduce temperatures and lower stress for city dwellers.
                        </p>
                    </div>

                    {/* Highlight 2 */}
                    <div className="p-6 bg-white shadow-md rounded-lg text-center">
                        <div className="bg-green-500 w-16 h-16 mx-auto flex items-center justify-center rounded-full text-white text-2xl mb-4">
                            🏭
                        </div>
                        <h3 className="text-xl font-bold">Fighting Pollution</h3>
                        <p className="mt-2 text-gray-600">
                            Air pollution causes 7 million deaths annually worldwide. Reducing fossil fuel usage and planting green belts can significantly improve air quality.
                        </p>
                    </div>

                    {/* Highlight 3 */}
                    <div className="p-6 bg-white shadow-md rounded-lg text-center">
                        <div className="bg-green-500 w-16 h-16 mx-auto flex items-center justify-center rounded-full text-white text-2xl mb-4">
                            🌍
                        </div>
                        <h3 className="text-xl font-bold">Your Role</h3>
                        <p className="mt-2 text-gray-600">
                            Small changes matter. Use public transport, recycle waste, and plant native trees to help your local environment thrive.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-12 px-6 bg-white text-gray-800">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-green-600">
                        How You Can Help
                    </h2>
                    <ul className="mt-6 space-y-4 text-lg ">
                        <li>
                            🌱 **Plant Native Species**: Native plants require less water and provide shelter for local wildlife.
                        </li>
                        <li>
                            🚲 **Reduce Vehicle Emissions**: Walk, bike, or use public transportation whenever possible.
                        </li>
                        <li>
                            ♻️ **Recycle**: Reduce waste by separating recyclables and reusing items.
                        </li>
                        <li>
                            🛍️ **Say No to Plastic**: Opt for reusable bags, bottles, and containers to cut down on plastic waste.
                        </li>
                        <li>
                            💡 **Conserve Energy**: Switch to energy-efficient appliances and turn off lights when not in use.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-12 bg-green-600 text-white text-center">
                <h2 className="text-3xl font-bold">Join the Eco Movement!</h2>
                <p className="mt-4 text-lg">
                    Start today. Plant a tree, reduce your carbon footprint, and inspire others to do the same.
                </p>
                <button className="mt-6 bg-white text-green-600 hover:bg-gray-100 py-2 px-6 rounded-lg shadow-lg transition duration-300">
                    Take Action
                </button>
            </section>
        </div>
    );
};

export default Home;
