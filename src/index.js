const express = require('express');
const app = express();
const { NlpManager } = require('node-nlp');
const fs = require ("fs")

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = 'AIzaSyBImEAY1wU8pe_QlYfkkECbA-yPdvtklO8';
  const genAI = new GoogleGenerativeAI(apiKey);
  const file = __dirname + "/model/inst-profesi-v2.txt"
  const instructionProfesi = fs.readFileSync(file, "utf-8");
  console.log("inst-profesi-v2.txt ", instructionProfesi);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: instructionProfesi
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  let history = [];

// baris 25 selalu di ganti dengan "application/json"
  
// buat variable array dengan nama history
  async function getgemini(tanya) {
    const chatSession = model.startChat({
      generationConfig,
      history: history,
    });

    let hist = {
      role: "user",
      parts: [
        {text: tanya},
      ],
    }
    history.push(hist);
  
    //console.log('tanya ', tanya)
    const result = await chatSession.sendMessage(tanya);

    let hasilJawaban = result.response.text();

    let hasil = {
      role: "model",
      parts: [
        {text: hasilJawaban},
      ],
    }
    history.push(hasil);

    console.log("history :  ", JSON.stringify (history, null, 2));
    // isi dari result adalah jawaban dari pertanyaan
    // ini hasil jawaban dari Gemini AI
    return result.response.text()
  }



// Define a route
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js Tutorial');
});

app.get('/example',(req,res) => {
    res.send('test');
})

app.get('/example/:nama',(req,res) => {
  let nama = req.params.nama
  res.send(nama);
})

app.get('/api/predict2/:tanya',async (req,res) => {
// menyimpan kata kata pertanyaan dari frontend ke dalam variabel tanya
  let tanya = req.params.tanya;
    // bertanya ke gemini
    let hasil = await getgemini(tanya)
    console.log('hasil ', hasil)
    res.send(hasil);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});