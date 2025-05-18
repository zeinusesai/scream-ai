const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 5000;
const upload = multer({ dest: 'server/audio/' });

app.use(cors());
app.use('/audio', express.static(path.join(__dirname, 'audio')));

app.post('/api/upload', upload.single('audio'), async (req, res) => {
  const filePath = path.join(__dirname, 'audio', req.file.filename + '.mp3');
  fs.renameSync(req.file.path, filePath);

  const elevenLabsResponse = await axios.post(
    'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream',
    {
      text: "AHHHHHHHHHHHHHHHHHH!",
      voice_settings: { stability: 0.3, similarity_boost: 0.75 },
    },
    {
      headers: {
        'xi-api-key': 'sk_4d0cc3832c257d571b6bfd5ff52edabce47618b2f3dcfc78',
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    }
  );

  const outputPath = path.join(__dirname, 'audio', 'screamed-' + req.file.filename + '.mp3');
  const writer = fs.createWriteStream(outputPath);
  elevenLabsResponse.data.pipe(writer);
  writer.on('finish', () => {
    res.json({ url: '/audio/' + path.basename(outputPath) });
  });
});

app.listen(PORT, () => console.log(`ScreamAI backend running on http://localhost:${PORT}`));
