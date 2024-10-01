var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require("multer");
var { db } = require("./database/db");
var app = express();
//var{ pcm }  = require("./tables/pcm");
const morgan = require('morgan');
const pcm   = require("./tables/pcmT");
const resultadosDB   = require("./tables/pcm2");

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
    // Intentar establecer la conexión a la base de datos id_pcm = 2
    const connId2 = await pcm;

    if (connId2) {
      console.log('Conexión a la base de datos id_pcm = 2 creada con éxito.');
      
      // Enviar respuesta al cliente indicando que la conexión fue exitosa
      res.json({
        message: 'Conexión a la base de datos PCM-Medellin creada con éxito.',
        connectionDetails: {
          user: connId2.user,
          connectString: connId2.connectString
        }
      });

      // Cerrar la conexión después de verificarla
      await connId2.close();
    } else {
      res.status(500).json({ error: 'No se pudo establecer la conexión a la base de datos id_pcm = 2.' });
    }
  } catch (err) {
    console.error('Error al conectar con la base de datos id_pcm = 2:', err.message);
    res.status(500).json({ error: 'Error al conectar con la base de datos', details: err.message });
  }
});

app.get('/api/resultados', async (req, res) => {
  try {
    const resultados = await resultadosDB.obtenerResultados(); // Llamar al método de la clase
    res.json(resultados); // Devolver los resultados
  } catch (err) {
    console.error('Error al obtener resultados:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});


app.get("/", function(req, res){
    res.send("Server running");
});

app.listen(3000, function () {
    console.log("gg-monitor REST listening on port 3000!");
}); 