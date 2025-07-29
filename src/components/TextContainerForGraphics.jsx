const TextContainerForGraphics = () => {
  return (
    <div className="flex-1 max-w-xl mx-auto mt-10 bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg dark:bg-gray-800">
      <h1 className="text-2xl font-extrabold text-center text-purple-700 mb-6">
        Wavex Challenge
      </h1>

      <div className="mb-6">
        <label
          htmlFor="input_prompt"
          className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
        >
          Enter Prompt
        </label>
        <textarea
          name="input_prompt"
          id="input_prompt"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-gray-700 dark:text-white"
          defaultValue="A dog is running in a garden full of greenery and flowers."
        />
      </div>

      {/* <div className="mb-6">
        <label
          htmlFor="input_script"
          className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
        >
          Generated Script
        </label>
        <textarea
          name="input_script"
          id="input_script"
          rows="6"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-gray-700 dark:text-white"
          placeholder="Your generated script will appear here..."
        />
      </div> */}

      <div className="flex justify-center">
        <button
          type="button"
          className="w-full sm:w-auto px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 transition-all duration-200"
        >
          Generate Image
        </button>
      </div>
    </div>
  );
};

export default TextContainerForGraphics;
