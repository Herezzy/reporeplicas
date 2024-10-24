const oracledb = require('oracledb');
// const SimpleOracleDB = require('simple-oracledb');
const dbConfig = require('../../config/dbconfig'); // Ruta relativa a dbconfig.js
const {db} = require('../database/db'); // Ruta relativa a dbconfig.js




class ReplicaDetalle {
  async error(err, conn) {
    if (conn) await conn.close();
    throw new Error(err.message);
  }

  async PcmDataReplica(rows, id, errorMessage = null) {
    let conn; 
    try {
      conn = await db.getDatabaseConnection();
      
      conn = await pcm.getPcmStatus(errorMessage);


      for (let row in rows  ) {
        console.log(rows)
        console.log(replicas)
        var replicas = `
        INSERT INTO REPLICAS (PCM, PROCESO, ULTIMA_EJECUCION, FECHA_REPORTE, HORAS_FUERA, ESTADO, ERROR_MENSAJE, ID_PCM)
         VALUES ('${rows[row].PCM}', '${rows[row].PROCESO}', '${rows[row].ULTIMA_EJECUCION}', '${rows[row].FECHA_REPORTE}', '${rows[row].HORAS_FUERA}', '${rows[row].ESTADO}',:error_mensaje,'${id}')`;


      //  console.log(errorMessage);
         await conn.execute(replicas);

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

const replicaD = new ReplicaDetalle();

// Exportar la clase para usarla en otros archivos
module.exports = replicaD;
