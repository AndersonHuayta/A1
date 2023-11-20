const mysql = require('mysql');
const config = require('../config');
const { error } = require('../red/respuestas');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let conexion;

function conmysql(){
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err){
            console.log('[db err]', err);
            setTimeout(conmysql, 200);
        }else{
            console.log('DB conectada!!!')
        }
    });

    conexion.on('error', err =>{
        console.log('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conmysql();
        }else{
            throw err;
        }
    })
}

conmysql();

function todos(tabla) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${tabla}`;
      conexion.query(query, (error, result) => {
       return error ? reject(error) : resolve(result);
      });
    });
  }



function uno(tabla, id){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE id=${id}`;
        conexion.query(query, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
      });

}

function agregar(tabla, data){
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`;
        conexion.query(query, [data, data], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
      });

}

function eliminar(tabla, id){
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM ${tabla} WHERE id= ?`;
        conexion.query(query, data.id, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
      });

}

function query(tabla, consulta){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE ?`;
        conexion.query(query, consulta, (error, result) => {
            return error ? reject(error) : resolve(result[0]);
        });
      });

}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    query

}