
const fetch = require("node-fetch");
const express = require("express");
const { type } = require("os");
// const chalk = require("chalk");
const app = express();
const PORT = 3000;
const readline = require("readline");
const bodyParser = require("body-parser");
async function fetchQuestions(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
      };

      const data = await response.json();
      const questions = data.results.map((question) => ({
        question: question.question,
        options: [...question.incorrect_answers, question.correct_answer],
        correctOption: question.correct_answer,
      }));
      return questions;
  } catch (error) {
    throw new Error("Error fetching questions: " + error.message);
  }
}

// Function to display questions to the user
function displayQuestions(questions) {
    // console.log(chalk.blue("Here are the questions:"));
    // console.log(chalk.green.bold(typeof(questions)));
  questions.forEach((question, index) => {
    console.log(`\nQuestion ${index + 1}: ${question.question}`);
    console.log("Options:");
    const options = [...question.incorrect_answers, question.correct_answer];
    options.forEach((option, optionIndex) => {
      console.log(`${optionIndex + 1}. ${option}`);
    });
  });
}
const url =
  "https://opentdb.com/api.php?amount=10&category=26&difficulty=easy&type=multiple";
async function fetchAndDisplayQuestions() {
  try {
    const questions = displayQuestions(url);
    displayQuestions(questions);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await fetchQuestions(url);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/start-quiz", async (req, res) => {
  try {
    const url =
      "https://opentdb.com/api.php?amount=10&category=26&difficulty=easy&type=multiple";
    const questions = await fetchQuestions(url);
    req.session = { questions, score: 0, currentQuestionIndex: 0 };
    res.json({ message: "Quiz started", totalQuestions: questions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});
app.use(express.json());

fetchAndDisplayQuestions();
