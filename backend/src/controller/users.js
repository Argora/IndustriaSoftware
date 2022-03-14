//conexion base de datos
const MySQLBD = require("../config/mysql.config");
//encripter
const bcrypt = require('bcrypt');
//get token_Config
const {getToken,getTokenData} = require('../config/jwt.config');
//mailconfig_Config
const {getVerifyTemplate,sendEmailVerify} = require('../config/email.config');


const insertNewUser = async (req, res) => {

//CAPTURA DE DATOS,saque municipio
const {nombre,apellido,email,passw,departamento,telefono,direccion} = req.body;
const municipio =1;
const contrato = 1;
 // INICIAR CONEXION
const conectBD = MySQLBD.conectar();
    //CONSULTA
conectBD.query(`SELECT * FROM Usuarios WHERE email = '${email}'`, (err, oldUser) => {

        //COMPROBAR SI EXISTE USUSARIO
        if (!oldUser.length) {

            //INSERTAR DIRECCION Y RECUPERAR ID
            conectBD.query(`INSERT INTO Direcciones(calle,avenida,referencia,municipiosId) VALUES ('nohay','nohay','${direccion}',${municipio})`, (err, DirreccionRes) => {
                if (err) {
                    res.send('Error al insertar direccion');
                    console.log("Close Connection");
                    conectBD.end();
                }else{
                //INSERTAR USUSARIO Y RECUPERAR ID
                conectBD.query(`INSERT INTO Usuarios(nombre,apellido,email,contrato) VALUES ('${nombre}','${apellido}','${email}',${contrato})`, (err, UsuarioRes) => {
                    if (err) {
                        res.send('Error al insertar usuario');
                        console.log("Close Connection");
                        conectBD.end();
                    }else{
                    //LLENAR TABLA DIRECCIONES USUARIOS
                    conectBD.query(`INSERT INTO  DireccionesUsuarios(personaId,direccionId) VALUES (${UsuarioRes.insertId},${DirreccionRes.insertId})`, (err, UsuarioDireccionRes) => {
                        if (err) {
                            res.send('Error al emparejar ususario y direccion');
                            console.log("Close Connection");
                            conectBD.end();
                        }else{
                        //INSERTAR TELEFONO
                        conectBD.query(`INSERT INTO Telefonos(personaId,telefono) VALUES (${UsuarioRes.insertId},'${telefono}')`, (err, TelefonoRes) => {
                            
                            if (err) {
                                res.send('Error al insertar telefono');
                                console.log("Close Connection");
                                conectBD.end();
                            }else{
                            //ENCRIPTAR CONTRASEÑA
                            bcrypt.hash(passw, 10, (err, hashedPassword) => {

                                if (err) {
                                    res.send('Error de encriptado');
                                    console.log("Close Connection");
                                    conectBD.end();
                                }
                                else {
                                //INSERTAR CONTRASEÑA
                                conectBD.query(`INSERT INTO DatosInicioSesion(personaId,contrasenia) VALUES (${UsuarioRes.insertId},'${hashedPassword}')`, (err, ContraseniaRes) => {

                                    if (err) {
                                        res.send('Error en inserccion de contraseña');
                                        
                                    }
                                    else {
                                    //GENERAR TOKEN DE IDENTIFICACION
                                    const token = getToken(email);

                                    //TEMPLATE -> ESTRUCUTRA DEL CORREO DE CONFIRMACION
                                     const template = getVerifyTemplate(nombre+' '+apellido,token);
  
                                    //ENVIAR EMAIL
                                    sendEmailVerify(email,'PREUBA DE ENVIO',template);

                                    }
                                    res.send('Usuario insertado');
                                    console.log("Close Connection_Usuario_Insertado");
                                    conectBD.end();
                                });
                                }
                            });
                            }
                        });
                        }
                    });
                    }
                });
                }
            });

            /*/ENCRIPTAR CONTRASEÑA
             bcrypt.hash(passw, 10, (err, hashedPassword) => {

                if (err) {
                    res.send('Error de encriptado');
                }
                else {
                    //INSERCION EN LA BASE DE DATOS
                    conectBD.query(`INSERT INTO users(nombre,apellido,email,passw,municipio,departamento,telefono,direccion) VALUES 
                    ("${nombre}","${apellido}","${email}","${hashedPassword}","${municipio}","${departamento}","${telefono}","${direccion}")`, (err, result) => {

                           //GENERAR TOKEN DE IDENTIFICACION
                             const token = getToken(email);

                           //TEMPLATE -> ESTRUCUTRA DEL CORREO DE CONFIRMACION
                            const template = getVerifyTemplate(nombre+' '+apellido,token);

                            //ENVIAR EMAIL
                            sendEmailVerify(email,'PREUBA DE ENVIO',template);

                        res.send('save user');
                   

                    });

                }

                console.log("Close Connection");
                conectBD.end();}); 
*/



        } else {
            res.send('El usuario con el correo <' + oldUser[0].email+'> ya existe');
            console.log("Close Connection");
            conectBD.end();

        }


    });
};


const verifyUser = async (req, res) => {

     //OPTENER TOKEN
     const token = req.params.token;
     //VERIFICAR DATA
     const data = getTokenData(token);

     if(!data){
        res.status(500).send('Error en data');
        console.log("Error en data");
      };

      //OPTENER CORREO DEL USUARIO
      const email = data.data;

      //CONECTAR CON BD
      const conectBD = MySQLBD.conectar();
      //CONSULTA DE BUSQUEDA
      conectBD.query(`SELECT * FROM Usuarios WHERE email = '${email}'`, (err, User) => {

     
        //COMPROBAR SI EXISTE EL USUARIO
        if (!User.length) {
  
            res.send('Usuario no existe');
            console.log("Close Connection");
            conectBD.end();

        }else{
            //CONSULTA DE VERIFICACION
            conectBD.query(`UPDATE Usuarios SET estadoHabilitacion = 1 WHERE email = '${User[0].email}'`, (err, result) => {

                if(err){
            
                    res.send('ERROR AL Habilitar');

                }
                else{
                    console.log({"Usuario":User[0],"Ahora":"HABILITADO"});
                    res.send('USUSARIO HABILITADO');
                };

                console.log("Close Connection");
                conectBD.end();

            });
        }

      });
    
      
};


const LoginUser = async (req, res) => {

    const {email,contrasenia} = req.body;

    const conectBD = MySQLBD.conectar();
    //BUSCAR USUARIO
    conectBD.query(`SELECT * FROM Usuarios WHERE email = '${email}'`, (err, UsuarioRes) => {
      
        //REVISAR SI SE ENCONTRO EL USUARIO
        if (!UsuarioRes.length) {

            res.send('Usuario no existe');
            console.log("Close Connection");
            conectBD.end();

        } else {
        //BUSCAR CONTRASEÑA DEL USUARIO
        conectBD.query(`SELECT * FROM DatosInicioSesion WHERE personaId = ${UsuarioRes[0].Id }`, (err, ContraseniaRes) => {
         
            //COMPARAR LA CONTRASEÑA
            bcrypt.compare(contrasenia, ContraseniaRes[0].contrasenia, (err, result) => {

                if (result) {
                    res.send('contraseña correcta');

                }else {
                    res.send('contraseña incorrecta');
                };

                console.log("Close Connection");
                conectBD.end();
            });
       
        });
        }
    });



};


const test = async (req, res) => {

    console.log('realizando prueba');
    const conectBD = MySQLBD.conectar();

    conectBD.query(`select * from test `, (err, resultado) => {
        
    console.log('SELECT ');
        console.log(resultado);
    });

    conectBD.query(`UPDATE test set n='prueba 2' where id = 2`, (err, resultado) => {
        console.log('UPDATE id 2');
        console.log(resultado);
    });
    
    conectBD.query(`delete from test where n='prueba 2'`, (err, resultado) => {
        console.log('DELETE id 1');
        console.log(resultado);
    });

   
    conectBD.query(`insert into test(n) values ('prueba') `, (err, resultado) => {
        console.log('INSERT');
        console.log(resultado);
        res.send(resultado);
    });
};

module.exports = {
    insertNewUser,
    LoginUser,
    verifyUser,
    test
};


