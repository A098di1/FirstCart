import React from "react";

const NewsLetter = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center space-y-4 pt-12 pb-20 bg-[#F9FAFB] px-4">
      <h1 className="md:text-4xl text-2xl font-semibold text-gray-800">
        Subscribe now & get 20% off
      </h1>
      <p className="text-gray-500 max-w-xl">
        Start exploring. Start saving. Start smiling. <br />
        Welcome to your personal shopping hub — <strong>Quick Cart</strong>! 😊
      </p>

      {/* Input Section */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col md:flex-row items-center gap-3 mt-4 w-full max-w-2xl"
      >
        <label htmlFor="email" className="sr-only">Email address</label>
        <input
          type="email"
          id="email"
          required
          placeholder="Enter your email"
          className="w-full md:flex-1 h-12 px-4 border border-gray-300 rounded-md md:rounded-r-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
        />
        <button
          type="submit"
          className="h-12 px-6 md:px-10 bg-orange-600 text-white rounded-md md:rounded-l-none hover:bg-orange-700 transition"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsLetter;
