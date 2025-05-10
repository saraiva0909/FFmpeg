const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('video'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `${inputPath}.webp`;

  const cmd = `ffmpeg -i ${inputPath} -vf "fps=10,scale=320:-1" -c:v libwebp -loop 0 ${outputPath}`;

  exec(cmd, (error) => {
    if (error) {
      console.error('Erro ao converter:', error);
      return res.status(500).send('Erro na conversão');
    }

    res.download(outputPath, 'converted.webp', () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API rodando na porta 3000');
});
