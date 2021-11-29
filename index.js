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
      "40",
      "41a",
      "41b",
      "41c",
      "41d",
      "41e",
      "41f",
      "41g",
      "41h",
      "41Other",
      "42",
      "43a",
      "43b",
      "43c",
      "43d",
      "43e",
      "43f",
      "43g",
      "43h",
      "43Other",
    ]
  },
  {
    name: 'intervencion',
    questions: [
      "44", "45", "46", "47", "48",
      "49a", "49b", "49c", "49d", "49e", "49f", "49g",
      "50", "51", "52", "53", "54",
      "55a", "55b", "55c", "55d", "55e", "55f", "55g", "55h", "55i", "55j",
      "56", "57", "58", "59", "60", "61",
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
      "107a", "107b", "107c", "107d", "107e", "107Other",
      "108a", "108b", "108c",
      "109"
    ]
  },
  {
    name: 'capacitacion',
    questions: [
      "110",
      "111a", "111b", "111c", "111d",
      "112",
      "113",
      "114a", "114aHours",
      "114b", "114bHours",
      "114c", "114cHours",
      "114d", "114dHours",
      "114e", "114eHours",
      "114f", "114fHours",
      "114g", "114gHours",
      "114h", "114hHours",
      "115a", "115b", "115c", "115d", "115e", "115f", "115g", "115h", "115i", "115j", "115k",
    ]
  },
  {
    name: 'supervision',
    questions: [
      "116a", "116b", "116c", "116d", "116e", "116Other",
      "117a", "117aHours",
      "117b", "117bHours",
      "117c", "117cHours",
      "117d", "117dHours",
      "117e", "117eHours",
      "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131"
    ]
  },
  {
    name: 'profesionales',
    questions: [
      "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167"
    ]
  },
  {
    name: 'manuales',
    questions: [
      "nombreManuales",
      "168", "169", "170", "171", "172"
    ]
  },
  {
    name: 'personas',
    questions: [
      "173", "174", "175", "176", "177", "178", "179"
    ]
  },
]