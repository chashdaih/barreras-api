const express = require("express");
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const cors = require('cors');
const xlsx = require('node-xlsx').default;

const PORT = process.env.PORT || 5001
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

app.get('/download', async (req, res) => {
  try {
    const rows = [];

    const headers = ['id', 'fecha registro']
    sections.forEach(section => {
      section.questions.forEach(key => headers.push(key))
    })
    rows.push(headers)

    const results = await admin.firestore().collection('resultados').get();
    results.forEach(doc => {
      const data = doc.data();
      const row = [doc.id, data.timestamp.toDate().toLocaleString('es-MX', 'short')];
      sections.forEach(section => {
        const sectionData = data[section.name]
        // console.log(section.name)
        section.questions.forEach(key => {
          // console.log(key, sectionData[key])
          row.push(sectionData[key])
        })
      })
      // console.log(row)
      rows.push(row);
    });

    const buffer = xlsx.build([{ name: "Cuestionario", data: rows }]);

    res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    return res.end(new Buffer.from(buffer, 'base64'));
  } catch (error) {
    console.error(error)
    return res.status(500).send(error);
  }
})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
});


const sections = [
  {
    name: 'identificacion',
    questions: [
      'nombre',
      'edad',
      'sexo',
      'escolaridad',
      'profesion',
      'puesto',
      'institucion',
      'añosEgreso',
      'aunLicenciatura',
      'añosExperiencia',
      'añosSuicidio',
      'pacientesUltimoAñoInfantes',
      'pacientesUltimoAñoNiños',
      'pacientesUltimoAñoAdolescentes',
      'pacientesUltimoAñoAdultos',
      'pacientesUltimoAñoMayores',
      'ideacionNiños',
      'ideacionAdolescentes',
      'ideacionAdultos',
      'ideacionMayores',
      'sexoMasAtendido',
      'intervencionPrioritaria',
      'intervencionOtra',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28'
    ]
  },
  {
    name: 'evaluacion',
    questions: [
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37a",
      "37b",
      "37c",
      "37d",
      "37e",
      "37f",
      "37g",
      "37h",
      "37Other",
      "38",
      "39a",
      "39b",
      "39c",
      "39d",
      "39e",
      "39f",
      "39g",
      "39h",
      "39Other",
      "41",
      "42a",
      "42b",
      "42c",
      "42d",
      "42e",
      "42f",
      "42g",
      "42h",
      "42Other",
      "43",
      "44a",
      "44b",
      "44c",
      "44d",
      "44e",
      "44f",
      "44g",
      "44h",
      "44Other",
    ]
  },
  {
    name: 'intervencion',
    questions: [
      "45", "46", "47", "48", "49",
      "50a", "50b", "50c", "50d", "50e", "50f", "50g",
      "51", "52", "53", "54", "55",
      "56a", "56b", "56c", "56d", "56e", "56f", "56g", "56h", "56i", "56j",
      "57", "58", "59", "60", "61",
      "62", "63", "64", "65", "66",
      "67", "68", "69", "70", "71",
      "72", "73", "74", "75", "76",
      "77", "78", "79", "80", "81",
      "82", "83", "84", "85", "86",
      "87", "88", "89", "90", "91",
      "92", "93", "94", "95", "96",
      "97", "98", "99", "100", "101",
      "102", "103", "104", "105", "106",
    ]
  },
  {
    name: 'seguimiento',
    questions: [
      "108a", "108b", "108c", "108d", "108e", "108Other",
      "109a", "109b", "109c",
      "110"
    ]
  },
  {
    name: 'capacitacion',
    questions: [
      "111",
      "112a", "112b", "112c", "112d",
      "113",
      "114",
      "115a", "115aHours",
      "115b", "115bHours",
      "115c", "115cHours",
      "115d", "115dHours",
      "115e", "115eHours",
      "115f", "115fHours",
      "115g", "115gHours",
      "115h", "115hHours",
      "116a", "116b", "116c", "116d", "116e", "116f", "116g", "116h", "116i", "116j", "116k",
    ]
  },
  {
    name: 'supervision',
    questions: [
      "117a", "117b", "117c", "117d", "117e", "117Other",
      "118", "118Hours",
      "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132"
    ]
  },
  {
    name: 'profesionales',
    questions: [
      "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168",
    ]
  },
  {
    name: 'manuales',
    questions: [
      "nombreManuales",
      "169", "170", "171", "172", "173",
    ]
  },
  {
    name: 'personas',
    questions: [
      "174", "175", "176", "177", "178", "179", "180",
    ]
  },
]