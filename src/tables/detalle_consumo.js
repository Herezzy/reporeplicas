const oracledb = require('oracledb');
// const SimpleOracleDB = require('simple-oracledb');
const dbConfig = require('../../config/dbconfig'); // Ruta relativa a dbconfig.js
// const db = require('../database/db'); // Ruta relativa a dbconfig.js

class DetalleConsumo {
  async error(err, conn) {
    if (conn) await conn.close();
    throw new Error(err.message);
  }

  async setPcmData() {
    let conn; 
    try {
      conn = await oracledb.getConnection({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString,
      });

      const query = `
        INSERT INTO DETALLE_CONSUMO (FECHA_CONSULTA, ACCION, RESULTADO, ERROR)
         VALUES ('10-11-2024','1','caida','si se conecto')`;

   
    

      
      await conn.execute(query);

  
      await conn.commit();

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
