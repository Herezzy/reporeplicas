const oracledb = require('oracledb');
const SimpleOracleDB = require('simple-oracledb');
const dbConfig = require('../../config/dbconfig'); // Ruta relativa a dbconfig.js

// Extender la biblioteca oracledb
SimpleOracleDB.extend(oracledb);

class PCM {
  async error(err, conn, cb) {
    if (conn) await this.release(err, conn, cb);
    else return cb({ status: 'error', message: err.message });
  }

  async release(err, conn, cb, data) {
    try {
      if (conn) await conn.close();
      if (err) return cb({ status: 'error', message: err.message });
      return cb(data); // Retorna los datos correctamente
    } catch (closeErr) {
      return cb({ status: 'error', message: closeErr.message });
    }
  }

  async getPcmList(cb) {
    try {
      // Establecer conexión con Oracle
      const conn = await oracledb.getConnection({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString,
      });

      // Ejecutar la consulta
      const result = await conn.execute(`SELECT nombre_pcm, usuario_pcm, password, host FROM pcm WHERE id_pcm = 2`);

      // Liberar la conexión y retornar los datos
      this.release(null, conn, cb, {
        status: 'ok',
        data: result.rows, // Retorna solo las filas obtenidas
      });
    } catch (err) {
      this.error(err, null, cb);
    }
  }
}
const pcm = {
  pcm: new PCM(),
};

// Exportar la instancia de PCM
module.exports = new PCM();
