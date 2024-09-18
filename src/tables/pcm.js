var oracledb = require('oracledb');
var dbConfig = require('../../config/dbconfig');  // Ruta relativa a dbconfig.js

const pcm = async () =>    {
  let conn ;
  try {
    conn  = await oracledb.getConnection({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
    });
    const result = await conn.execute('SELECT nombre_pcm FROM pcm');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener los nombres de PCM:', error);
    throw new Error('Error al obtener los nombres de PCM');
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error);
      }
    }
  }
}

module.exports = { pcm  };
