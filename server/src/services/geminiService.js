const axios = require("axios");
const callGemini = async (question) => {
  const prompt = `Given the following list of questions from an audience , group them 
    if they are similar , and return a sorted list with the best frequently asked or relevant question summarized:

    ${question
      .map((ques, index) => {
        `${index + 1}. ${ques.content}`;
      })
      .join("\n")}

    Respont with only the summarized list one per line
    `;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GEMINI_API_KEY,
      },
    }
  );

  const text  = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text.split("\n").filter((line) => line.trim() !== "");
};

module.exports = {
  callGemini,
};
 //example of questions that we will send in the request to gemini api
//  1.what is Mern
//  2.what is React
//  3.what is express