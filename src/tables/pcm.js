const oracledb = require('oracledb');
const SimpleOracleDB = require('simple-oracledb');
const dbConfig = require('../../config/dbconfig');
const {db} = require('../database/db');

const replicaD = require('./replica_detalle');
// const consumo = require('./detalle_consumo');

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
            [id],
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // Salida como objeto
        );

        // Verificar si se encontraron resultados
        if (result.rows.length === 0) {
            throw new Error(`No se encontraron credenciales para el ID ${id}`);
        }

        // Devuelve la primera fila como objeto
        return result.rows[0]; // Retorna el primer resultado como un objeto

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
let errorMessage = null; // Definir errorMessage antes del try


    try {
      const {connection,error} = await this.getPcmConnection (pcmData);
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
        // const resultDetalleConsumo = await consumo.setPcmData(result.rows,id);
        const resultDetalleConsumo2 = await replicaD.PcmDataReplica(result.rows,id,errorMessage);
        // const resultReplicaD = await replicaD.PcmDataReplicas(result.rows,id);
      

      return result.rows.id.errorMessage// Retornar los resultados en JSON
    } catch (err) {

      await conn.close();
      errorMessage = err.message; // Captura el mensaje de error

      console.error('Error al hacer la consulta:', err.message);
      throw new Error(errorMessage);
    }
  }

  async getPcmConnection (pcmData){
    let conn = null;
    let errorMessage = null; // Definir errorMessage antes del try
    
    // conn = await db.getDatabaseConnection();

        try {
            conn = await oracledb.getConnection({
            user: pcmData.USUARIO_PCM,
            password: pcmData.PASSWORD,
            connectString: pcmData.HOST
          });
        }
          catch (err) {

            

            errorMessage = err.message; // Captura el mensaje de error
      
            console.error('Error al hacer la consulta:', err.message);
          }
        
          return ({connection:conn,error:errorMessage});

        }

      }




const pcm = new PCM();

module.exports = pcm;