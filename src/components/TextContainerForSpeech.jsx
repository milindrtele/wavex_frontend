import React, { useState } from "react";
import axios from "axios";

const languages = {
  eng: "English",
  asm: "Assamese",
  hin: "Hindi",
  mar: "Marathi",
  tam: "Tamil",
  guj: "Gujarati",
  ory: "Odia",
};

const TextContainerForSpeech = ({ clips }) => {
  const [prompt, setPrompt] = useState(
    "A dog is running in a garden full of greenery and flowers."
  );
  const [language, setLanguage] = useState("eng");
  const [loading, setLoading] = useState(false);

  const handleGenerateSpeech = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://8b70d95abe7a.ngrok-free.app/tts",
        {
          text: prompt,
          lang: language,
        }
      );

      console.log(language);

      console.log("Response:", response.data);
      // Handle response (e.g., play audio or show download link)
    } catch (error) {
      console.log(language);
      console.error("Error generating speech:", error);
    } finally {
      setLoading(false);
    }
  };

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
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="language_select"
          className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
        >
          Select Language
        </label>
        <select
          id="language_select"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none dark:bg-gray-700 dark:text-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Object.entries(languages).map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGenerateSpeech}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 transition-all duration-200"
        >
          {loading ? "Generating..." : "Generate Speech"}
        </button>
      </div>
    </div>
  );
};

export default TextContainerForSpeech;
