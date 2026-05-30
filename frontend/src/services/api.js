const BASE_URL = "http://127.0.0.1:5000";

// Get Question (dummy for now)
export const getQuestion = async () => {
  return { question: "Tell me about yourself" };
};

// Submit Answer (FIXED)
export const submitAnswer = async (answer) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer: answer }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Backend not reachable" };
  }
};