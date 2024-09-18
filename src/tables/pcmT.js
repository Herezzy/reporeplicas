var oracledb = require('oracledb');
var SimpleOracleDB = require('simple-oracledb');
var dbConfig = require('../../config/dbconfig');  // Ruta relativa a dbconfig.js

// Modificar la biblioteca oracledb original
SimpleOracleDB.extend(oracledb);

class PCM {
  error(err, conn, cb) {
    if (conn) this.release(err, conn, cb);
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
      // Establecer conexión
      const conn = await oracledb.getConnection({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString,
      });

      // Ejecutar la consulta con getListPCM
      const result = await conn.execute('SELECT nombre_pcm FROM pcm');

      // Liberar conexión y retornar los datos
      this.release(null, conn, cb, {
      status: 'ok',
      data: result,  // Retorna los datos obtenidos de la base de datos
      });
    } catch (err) {
      this.error(err, null, cb);
    }
  }
}

const pcm = {
  pcm: new PCM(),
};

module.exports = pcm;
