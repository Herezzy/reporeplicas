const pcm   = require("./tables/pcmT");
const oracledb = require('oracledb');

class OracleConnector {
  constructor(user, password, connectString) {
    this.user = user;
    this.password = password;
    this.connectString = connectString;
    this.connection = null;
  }

  // Método para establecer la conexión con Oracle
  async connect() {
    try {
      this.connection = await oracledb.getConnection({
        user: this.user,
        password: this.password,
        connectString: this.connectString,
      });
      console.log('Conexión a Oracle establecida exitosamente.');
    } catch (error) {
      console.error('Error al conectar a Oracle:', error);
      throw error;
    }
  }

  // Método para ejecutar un query en Oracle
  async executeQuery(query) {
    try {
      if (!this.connection) {
        await this.connect();
      }

      const result = await this.connection.execute(query);
      return result.rows;
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      throw error;
    }
  }

  // Método para cerrar la conexión
  async close() {
    try {
      if (this.connection) {
        await this.connection.close();
        console.log('Conexión a Oracle cerrada.');
      }
    } catch (error) {
      console.error('Error al cerrar la conexión de Oracle:', error);
    }
  }
}

// Exportar la clase OracleConnector
module.exports = OracleConnector;
