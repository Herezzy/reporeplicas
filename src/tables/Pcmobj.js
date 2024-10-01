var oracledb = require('oracledb');
var dbConfig = require('../../config/dbconfig'); 

class Pcm {
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

async getStatusDB(id_pcm){
    const query = `SELECT USUARIO_PCM, PASSWORD, HOST FROM PCM WHERE ID_PCM = ${id_pcm}`

    try {
        // Establecer conexión
        const conn = await oracledb.getConnection({
          user: dbConfig.user,
          password: dbConfig.password,
          connectString: dbConfig.connectString,
        });
  
        // Ejecutar la consulta con getListPCM
        //const result = await getListPCM();  // Asegúrate de que getListPCM está funcionando correctamente
  
        // Liberar conexión y retornar los datos
        this.release(null, conn, cb, {
          status: 'ok',
        //  data: result,  // Retorna los datos obtenidos de la base de datos
        });
      } catch (err) {
        this.error(err, null, cb);
      }
}


}