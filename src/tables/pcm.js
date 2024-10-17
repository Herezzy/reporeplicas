const oracledb = require('oracledb');
const SimpleOracleDB = require('simple-oracledb');
const dbConfig = require('../../config/dbconfig'); 
const {db} = require('../database/db'); 

const consumo = require('../tables/detalle_consumo');

SimpleOracleDB.extend(oracledb);

class PCM {
  async error(err, conn) {
    if (conn) await conn.close();
    throw new Error(err.message);
  }

  async getListPcm() {
    let conn;
    try {
      conn = await db.getDatabaseConnection();


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



  

  async getPcmById(id) {
    let conn;  
    try {
        conn = await db.getDatabaseConnection();  

        // Ejecutar la consulta
        const result = await conn.execute(
            `SELECT * FROM pcm WHERE id_pcm = :id`,  
            [id]  
        );

        if (result.rows.length === 0) {
            throw new Error(`No se encontraron credenciales para el ID ${id}`);
        }

        return result.rows;  
    } catch (err) {
        console.error('Error al conectar con la base de datos id_pcm', err.message);
        throw err; 
    } finally {
        if (conn) {
            await conn.close();  
        }
    }
}






async getPcmStatus (pcmData,id){
let conn;

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
        ,(SELECT TO_CHAR(sysdate,'YYYY-MM-DD HH24:MI:SS') FROM dual) AS "FECHA_REPORTE"
        ,ROUND(((SELECT sysdate FROM dual) - TO_DATE((SUBSTR(AUDIT_TS, 1, 10))||'/'||(SUBSTR(AUDIT_TS, 12, 8)),'YYYY-MM-DD HH24:MI:SS'))*24 ,1) AS "HORAS_FUERA"
        ,'MAL' AS "ESTADO"
        FROM ${pcmData[6]}
        WHERE ROUND(((SELECT sysdate FROM dual) - TO_DATE((SUBSTR(AUDIT_TS, 1, 10))||'/'||(SUBSTR(AUDIT_TS, 12, 8)),'YYYY-MM-DD HH24:MI:SS'))*24 ,1) >= 2`,
        [],
        { outFormat: oracledb.OBJECT } 
      );
      console.log(result);
        await conn.close();
        const resultDetalleConsumo = await consumo.setPcmData(result.rows,id);

      return result.rows; // Retornar los resultados en JSON
    } catch (err) {
      await conn.close();
      console.error('Error al hacer la consulta:', err.message);
      throw new Error(err.message);
    }
  }

  


}



const pcm = new PCM();

module.exports = pcm;