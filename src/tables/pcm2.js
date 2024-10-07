const getConnId2 = require('./pcmT'); // Importar la promesa que retorna la conexión

class ResultadosDB {
  constructor() {
    // Puedes agregar más propiedades si es necesario
  }

  async obtenerResultados() {
    try {
      const connId2 = await getConnId2;

      // Ejecutar la consulta
      const result = await connId2.execute(`SELECT 'Aeropuerto J Medellin' AS PCM
        ,GROUP_NAME AS PROCESO
        ,SEQNO
        ,RBA
        ,AUDIT_TS AS ULTIMA_EJECUCION
        ,(SELECT TO_CHAR(sysdate,'YYYY-MM-DD HH24:MI:SS') FROM dual) AS "FECHA REPORTE"
        ,ROUND(((SELECT sysdate FROM dual) - TO_DATE((SUBSTR(AUDIT_TS, 1, 10))||'/'||(SUBSTR(AUDIT_TS, 12, 8)),'YYYY-MM-DD HH24:MI:SS'))*24 ,1) AS "HORAS FUERA"
        ,'MAL' AS "ESTADO"
        FROM GOLDENGATE_12C.checkpointtable
        WHERE ROUND(((SELECT sysdate FROM dual) - TO_DATE((SUBSTR(AUDIT_TS, 1, 10))||'/'||(SUBSTR(AUDIT_TS, 12, 8)),'YYYY-MM-DD HH24:MI:SS'))*24 ,1) >= 2`);

      return { status: 'ok', data: result.rows }; // Retornar los resultados en JSON
    } catch (err) {
      console.error('Error al hacer la consulta:', err.message);
      throw new Error(err.message);
    }
  }
}

const  PCMRESULT = new ResultadosDB();
module.exports = PCMRESULT; // Exportar una instancia de la clase
