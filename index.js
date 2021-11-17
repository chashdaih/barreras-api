const express = require("express");
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const cors = require('cors');
const xlsx = require('node-xlsx').default;

const PORT = process.env.PORT || 5000
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/save', async (req, res) => {
  try {

    const body = req.body
    const writeResult = await admin.firestore().collection('resultados').add({
      identificacion: body.identificacion,
      evaluacion: body.evaluacion,
      intervencion: body.intervencion,
      seguimiento: body.seguimiento,
      capacitacion: body.capacitacion,
      supervision: body.supervision,
      profesionales: body.profesionales,
      manuales: body.manuales,
      personas: body.personas,
      timestamp: admin.firestore.Timestamp.now()
    })

    return res.json({ id: writeResult.id })

  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
});