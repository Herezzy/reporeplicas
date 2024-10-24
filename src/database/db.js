var oracledb = require('oracledb');
var SimpleOracleDB = require('simple-oracledb');
var dbConfig = require('../../config/dbconfig');  // Ruta relativa a dbconfig.js
// var { getListPCM } = require('../tables/pcm');  // Ajusta la ruta según sea necesario

// Modificar la biblioteca oracledb original
SimpleOracleDB.extend(oracledb);
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


class DB {
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

  

  async test(data, cb) {
    
    const { bd } = data;
    
     

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

  async getDatabaseConnection() {  
    try{
    const conn = await oracledb.getConnection({

    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString
  });

  return conn ;
    }
    catch (err) {
      return null;
    }




  }
  async getDatabaseConnectionPcm(_user_,_password_,_connectString_) {  
    try{
    const conn = await oracledb.getConnection({

    user: _user_,
    password: _password_,
    connectString: _connectString_
  });

  return conn ;
    }
    catch (err) {
      return null;
    }



  }
}


const db = {
  db: new DB(),
};

module.exports = db;
