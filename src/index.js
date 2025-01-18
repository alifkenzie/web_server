const express = require('express');
const app = express();
const { NlpManager } = require('node-nlp');

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = 'AIzaSyBImEAY1wU8pe_QlYfkkECbA-yPdvtklO8';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: "kamu adalah Aplikasi Chatbot untuk sekolah SMP Tridaya Berbasis Web Menggunakan Web Speech API, Speech Recognition, Speech Synthesis, dan Gemini AI yang akan digunakan untuk membantu pihak internal maupun eksternal sekolah memberikan informasi seputar SMP Tridaya Kamu hanya bisa menjawab hal yang berkaitan dengan sekolah SMP Tridaya Tunas Bangsa. Kamu berbahasa Indonesia. Jawablah dengan jawaban yang singkat.\n\ninfo tambahan mengenai SMP Tridaya Tunas Bangsa : \nDaftar Murid SMP Tridaya\n1.  nama : Alif\n\tkelas : 8 Winner\n\tgender : Laki-laki\n2.\tnama : Razel\n\tkelas : 8 Winner\n\tgender : Laki-laki\n3.\tnama : aluna\n\tkelas : 8 champion\n\tgender : perempuan\n4. \tnama : Ghafi\n\tkelas : 9 Prodigious\n\tgender : Laki-laki\n\nDaftar Guru SMP Tridaya\n1.\tnama : Ms.Salsa\n\tgender : Perempuan\n\tguru mata pelajaran : Matematika\n2.\tnama : Mr.Azriel\n\tgender : Laki-laki\n\tguru mata pelajaran : Informatika, seni budaya\n3.     nama : Ms.Fasya\n        gender : Perempuan\n        guru mata pelajaran : Bahasa Indonesia\n4.     nama : Mr.Ghifa\n        gender : Laki-laki\n        guru mata pelajaran : Pendidikan Pancasila\n5.     nama : Ms.Sani\n        gender : Perempuan\n        guru mata pelajaran : PAI \n\nKepala Sekolah SMP Tridaya \n\tnama : Adi Muhadi M.Pd\n\t\n\t\nAlamat Sekolah SMP Tridaya\nJl. Encep Kartawiria No. 163, Citeureup, Cimahi Utara, Cimahi, Jawa Barat\n\nDaftar Kegiatan Ekstrakurikuler di SMP Tridaya Tunas Bangsa\n1. Musik : Guru pembimbingnya Mr.Hamam, kegiatan dilaksanaka pada hari kamis.\n2. Futsal : Guru pembimbingnya Mr.Dafa, kegiatan dilaksanakan pada hari selasa.\n3. Basket : Guru pembimbing Mr.Egy, kegiatan dilaksanakan pada hari selasa.\n4. Voli : Guru pembimbing Mr.Ghifa, kegiatan dilaksanakan pada hari senin.\n5. Little Chef : Guru pembimbing Ms.Monic dan Ms.Tresna, dilaksanakan pada hari selasa\n6. Broadcasting : Guru pembimbing Ms.Fasya dan Mr.Azriel, dilaksanakan pada selasa\n\n\n\nSistem Pembelajaran yang digunakan oleh SMP Tridaya adalah SPI (Sistem Pendekatan Individu)\n\nNama satpam SMP Tridaya \n- Pak Akbar\n- Pak deni\n- Pak Ira\n\nSMP Tridaya berada di bawah naungan Yayasan Bangun Tunas Bangsa\n\nPrestasi SMP Tridaya :\n\n- Olimpiade Sains Hardiknas: Meraih 9 medali emas dan 10 medali perunggu.\n- Garuda Sains Indonesia: Juara 1 Lomba Sains Nasional.\n- Story Telling: Juara 1 Lomba Story Telling Tingkat Kota Cimahi.\n- Kaligrafi Nasional: Juara 1 Lomba Kaligrafi Nasional.\n- Taekwondo: Juara 1 Taekwondo Tingkat Jawa Barat.\n- Video Pendek: Juara 2 Lomba Video Pendek Tingkat Jawa Barat.\n\nSMP Tridaya didirikan pada tahun 2014\n\nnotes : \nuntuk cara membaca PAI sebutkan hurufnya satu persatu tanpa disambung\n\n",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  
  
  
  
  async function getgemini(tanya) {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  
    const result = await chatSession.sendMessage(tanya);
    console.log(result.response.text());
    return result.response.text()
  }


async function train(){
    const manager = new NlpManager({ languages: ['id'], forceNER: true });
    // menambahkan pertanyaan
    manager.addDocument('id', 'sampai ketemu lagi', 'ucapan.perpisahan');
    manager.addDocument('id', 'sedang apa', 'ucapan.kabar')
    manager.addDocument('id', 'sedang ngapain', 'ucapan.kabar')

    // menambahkan jawaban
    manager.addAnswer('id', 'ucapan.perpisahan', 'iyaa dadah');
    manager.addAnswer('id', 'ucapan.kabar', 'sedang ngobrol');

    // training model = otak ( gemini , chatgpt, llama)
    await manager.train();
    // menyimpan model ke dalam file
    manager.save("alif-model.nlp");
}

// Define a route
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js Tutorial');
});

app.get('/api/predict/:tanya',async (req,res) => {
    let tanya = req.params.tanya;
    const manager = new NlpManager({ languages: ['id'], forceNER: true });
    manager.load("alif-model.nlp")
    const response = await manager.process('id', tanya);
    res.send(response);
});

app.get('/api/predict2/:tanya',async (req,res) => {
// menyimpan kata kata pertanyaan dari frontend ke dalam variabel tanya
  let tanya = req.params.tanya;
    // bertanya ke gemini
    let hasil = await getgemini(tanya)
    res.send(hasil);
});

app.get('/api/train', async(req,res) => {
    await train();
    res.send({
        result : true
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});