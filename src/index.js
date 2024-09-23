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

//  app.get("/api/tables/pcm", function (req, res, next) {
//   pcm.getPcmList(function (response) {
//     if (response.status === 'ok') {
//       res.json({ success: true, data: response.data }); // Enviar datos exitosamente
//     } else {
//       res.status(500).json({ success: false, message: response.message }); // Enviar error
//     }
//   });
// });

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

app.listen(4000, function () {
    console.log("gg-monitor REST listening on port 3000!");
}); 