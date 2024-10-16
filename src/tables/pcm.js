const oracledb = require('oracledb');
const SimpleOracleDB = require('simple-oracledb');
const dbConfig = require('../../config/dbconfig'); // Ruta relativa a dbconfig.js
const db = require('../database/db'); // Ruta relativa a dbconfig.js

// Extender la biblioteca oracledb
SimpleOracleDB.extend(oracledb);

class PCM {
  async error(err, conn) {
    if (conn) await conn.close();
    throw new Error(err.message);
  }

  async getListPcm() {
    try {
      // Establecer conexión con la primera base de datos (la que tiene la tabla PCM)
      const conn = await oracledb.getConnection({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString,
      });

      // Consultar la tabla PCM para obtener las credenciales de la base de datos con id_pcm = 2
      const result = await conn.execute(
        `SELECT * FROM pcm order by id_pcm asc`
      );

      await conn.close();

      if (result.rows.length === 0) {
        throw new Error('No se encontraron credenciales para id_pcm.');
      }
      return result.rows ;
    } catch (err) {
      console.error('Error al conectar con la base de datos id_pcm', err.message);
      throw err;
    }
  }



  

  async getPcmById (id){
    const conn = await oracledb.getConnection({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
    });
    const result = await conn.execute(

      `SELECT * FROM pcm WHERE id_pcm = ${id}`
    );

    if (result.rows.length === 0) {
      await conn.close();
      throw new Error(`No se encontraron credenciales para el ID ${id}`);
    }

    // Extraer las credenciales obtenidas
    // const [USUARIO_PCM, PASSWORD, HOST] = result.rows[0];
    await conn.close();
    return result.rows;

}






  async getPcmStatus (pcmData){
    // console.log(pcmData);

      try {
        const conn = await oracledb.getConnection({
          user: pcmData[2],
          password: pcmData[3],
          connectString: pcmData[4]
        });  
        // console.log(conn);
        // Ejecutar la consulta
        const result = await conn.execute(`SELECT '${pcmData[1]}' AS PCM
          ,GROUP_NAME AS PROCESO
          ,SEQNO
          ,RBA
          ,AUDIT_TS AS ULTIMA_EJECUCION
          ,(SELECT TO_CHAR(sysdate,'YYYY-MM-DD HH24:MI:SS') FROM dual) AS "FECHA REPORTE"
          ,ROUND(((SELECT sysdate FROM dual) - TO_DATE((SUBSTR(AUDIT_TS, 1, 10))||'/'||(SUBSTR(AUDIT_TS, 12, 8)),'YYYY-MM-DD HH24:MI:SS'))*24 ,1) AS "HORAS FUERA"
          ,'MAL' AS "ESTADO"
          FROM ${pcmData[6]}
          WHERE ROUND(((SELECT sysdate FROM dual) - TO_DATE((SUBSTR(AUDIT_TS, 1, 10))||'/'||(SUBSTR(AUDIT_TS, 12, 8)),'YYYY-MM-DD HH24:MI:SS'))*24 ,1) >= 2`);
          
          await conn.close();

        return result.rows; // Retornar los resultados en JSON
      } catch (err) {
        await conn.close();
        console.error('Error al hacer la consulta:', err.message);
        throw new Error(err.message);
      }
    }




  }
  






// Crear una instancia de PCM
const pcm = new PCM();

// Exportar la conexión a la base de datos con id_pcm = 2
module.exports = pcm;
