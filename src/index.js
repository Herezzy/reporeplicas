var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require("multer");
var { db } = require("./database/db");
var app = express();
//var{ pcm }  = require("./tables/pcm");
const morgan = require('morgan');
const pcm   = require("./tables/pcm");
const consumo   = require("./tables/detalle_consumo");

var whitelist = [
    "http://localhost",
    "http://localhost:3000",
  ];
  
  var corsOptions = {
    origin: function (origin, callback) {
      callback(null, true);
      return;
      console.log(origin);
      if (whitelist.indexOf(origin) !== -1) {
        console.log("Origin allowed");
        callback(null, true);
      } else {
        console.error("Origin not allowed");
        callback(new Error("Not allowed by CORS"));
      }
    },
  };


  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors(corsOptions));

app.get("/api/utils/db/test", function (req, res, next) {
  const params = req.headers;
  db.test(params, function (response) {
    res.json(response);
  });
});

// app.get("/api/tables/pcm",  function (req, res, next) {
//   const params = req.headers;
//   //const rows = await pcm();
//   //const rows =  await pcm.getPcmList();
//   pcm.getPcmList( function (response) {
//     res.json(response);
//   });


  
  //res.json(rows);
 // });

app.get('/api/tables/pcm', async (req, res) => {
  try {
    // Obtener la conexión a la base de datos con id_pcm = 2
    const listPcm = await pcm.getListPcm(); // Llamar al método de la clase para obtener la conexión
    res.json({
      status: 'success',
      message: 'Consulta efectuada correctamente.',
      listPcm:listPcm
    });
   
  } catch (err) {
    console.error('No se han encontrado datos:', err.message);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});



app.get('/api/tables/pcm/:id', async (req, res) => {
  try {
    // Obtener la conexión a la base de datos con id_pcm = 2
    const id = req.params.id;
    const listPcm = await pcm.getPcmById(id); // Llamar al método de la clase para obtener la conexión
    res.json({
      status: 'success',
      message: 'Consulta efectuada correctamente.',
      listPcm:listPcm
    });
   
  } catch (err) {
    console.error('No se han encontrado datos:', err.message);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});


app.get('/api/tables/pcm/status/:id', async (req, res) => {
  try {
    // Obtener el id del parámetro de la URL
    const id = req.params.id;
    
    // Llamar al método para obtener los datos de la PCM
    const pcmData = await pcm.getPcmById(id);
    
    // Obtener el estado de la PCM
    const pcmStatus = await pcm.getPcmStatus(pcmData[0],id);
    
    // Retornar los datos en JSON
    res.json({
      status: 'success',
      message: 'Consulta efectuada correctamente.',
      pcmStatus: pcmStatus
    });
  
  } catch (err) {
    console.error('No se han encontrado datos:', err.message);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});


app.post('/api/tables/pcm/insert', async (req, res) => {
  try {
    // Datos quemados por ahora para probar el insert
    const insertPcm = await consumo.setPcmData(); // Enviar datos estáticos por ahora

    res.json({
      status: 'success',
      message: 'Insert realizado correctamente.',
      insertPcm: insertPcm
    });
   
  } catch (err) {
    console.error('Error al realizar el insert:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor. No se pudo realizar el insert.'
    });
  }
});





app.get("/", function(req, res){
    res.send("Server running");
});

app.listen(3000, function () {
    console.log("gg-monitor REST listening on port 3000!");
}); 