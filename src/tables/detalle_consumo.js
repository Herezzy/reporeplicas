const oracledb = require('oracledb');
// const SimpleOracleDB = require('simple-oracledb');
const dbConfig = require('../../config/dbconfig'); // Ruta relativa a dbconfig.js
const {db} = require('../database/db'); // Ruta relativa a dbconfig.js



class DetalleConsumo {
  async error(err, conn) {
    if (conn) await conn.close();
    throw new Error(err.message);
  }

  async setPcmData(rows) {
    let conn; 
    try {
      conn = await db.getDatabaseConnection();

      for (let row in rows  ) {
        console.log(rows)
        var query = `INSERT INTO DETALLE_CONSUMO (FECHA_CONSULTA, ACCION, RESULTADO, ERROR)
         VALUES (TO_TIMESTAMP('${rows[row].ULTIMA_EJECUCION}','RRRR-MM-DD HH24:MI:SS.FF9'),'1','${rows[row].HORAS_FUERA}','${rows[row].HORAS_FUERA}')`;
       
         await conn.execute(query);
         await conn.commit();

     }; 
     await conn.close();

    } catch (err) {
        await conn.close();
        console.error('Error al hacer la consulta:', err.message);
        throw new Error(err.message);
      }
  }
}

const consumo = new DetalleConsumo();

// Exportar la clase para usarla en otros archivos
module.exports = consumo;        