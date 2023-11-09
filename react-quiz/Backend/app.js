const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const Question = require('./Question');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

// mongoose.connect('mongodb+srv://praveen2408:Fearless08@cluster0.emyokxy.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then((()=>{
//     console.log("Connected")
// }));
app.use(cors());

async function connectAndInsertQuestions() {
    try {
      await mongoose.connect('mongodb+srv://praveen2408:Fearless08@cluster0.emyokxy.mongodb.net/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log("Connected to MongoDB");
  
      // Read initial questions from the JSON file
      const initialQuestionsData = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
      const { questions: initialQuestions } = initialQuestionsData;
  
      // Insert initial questions into the database
      await Question.insertMany(initialQuestions);
      console.log('Initial questions inserted into the database.');
    } catch (error) {
      console.error('Failed to insert initial questions:', error);
    }
  }
  
  connectAndInsertQuestions(); 
  
  app.use(express.json());


// Define a route to retrieve 30 random questions
app.get('/get-questions', async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 30 } }]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve questions' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
