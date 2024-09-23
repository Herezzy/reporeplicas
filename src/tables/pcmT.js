const oracledb = require('oracledb');
const SimpleOracleDB = require('simple-oracledb');
const dbConfig = require('../../config/dbconfig'); // Ruta relativa a dbconfig.js

// Extender la biblioteca oracledb
SimpleOracleDB.extend(oracledb);

class PCM {
  async error(err, conn) {
    if (conn) await conn.close();
    throw new Error(err.message);
  }

  async getPcmlist() {
    try {
      // Establecer conexión con la primera base de datos (la que tiene la tabla PCM)
      const conn = await oracledb.getConnection({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString,
      });

      // Consultar la tabla PCM para obtener las credenciales de la base de datos con id_pcm = 2
      const result = await conn.execute(
        `SELECT usuario_pcm, password, host FROM pcm WHERE id_pcm = 2`
      );

      if (result.rows.length === 0) {
        await conn.close();
        throw new Error('No se encontraron credenciales para id_pcm = 2.');
      }

      // Extraer las credenciales obtenidas
      const [usuario_pcm, password, host] = result.rows[0];

      // Cerrar la conexión a la primera base de datos
      await conn.close();

      // Establecer conexión con la base de datos con id_pcm = 2
      const connId2 = await oracledb.getConnection({
        user: usuario_pcm,
        password: password,
        connectString: host,
      
      });

      console.log('Conexión a la base de datos id_pcm = 2 creada con éxito.');

      // Retornar la conexión a la base de datos id_pcm = 2 para que pueda ser usada en otros archivos
      return connId2;
    } catch (err) {
      console.error('Error al conectar con la base de datos id_pcm = 2:', err.message);
      throw err;
    }
  }
}

// Crear una instancia de PCM
const pcm = new PCM();

// Exportar la conexión a la base de datos con id_pcm = 2
module.exports = pcm.getPcmlist();
