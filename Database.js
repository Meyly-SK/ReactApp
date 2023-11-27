import {openDatabase} from 'expo-sqlite';

const db = openDatabase('miBaseDeDatos.db')

db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nomUsuario TEXT NOT NULL,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      dni TEXT NOT NULL,
      contraseña TEXT NOT NULL
    );`,
    [],
    (tx, results) => {
      console.log('Tabla de usuarios creada correctamente');
    },
    (error) => {
      console.error('Error al crear la tabla:', error);
    }
  );
});

export const insertarUsuario = (nomUsuario, nombre, apellido, dni, contraseña) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO usuarios (nomUsuario, nombre, apellido, dni, contraseña) VALUES (?, ?, ?, ?, ?);',
        [nomUsuario, nombre, apellido, dni, contraseña],
        (tx, results) => {
          console.log('Usuario insertado correctamente');
          resolve(results.insertId);
        },
        (error) => {
          console.error('Error al insertar usuario:', error);
          reject(error);
        }
      );
    });
  });
};

export const obtenerUsuarios = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM usuarios;', [], (_, { rows }) => {
        const usuarios = rows['_array'];
        resolve(usuarios);
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
        reject(error);
      });
    });
  });
};

export const buscarInformacionPorDNI = async (dni) => {
  try {
    const token = 'apis-token-6209.ps7vv2d8fLzbYi8ozkbSDK4lzHw0zj-b';
    const response = await axios.get(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data; 
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    throw error;
  }
};

export const verificarCredenciales = (usuario, contrasena) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM usuarios WHERE nomUsuario = ? AND contraseña = ?;',
        [usuario, contrasena],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const obtenerUsuarioId = async (usuario) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id FROM usuarios WHERE nomUsuario = ?;',
        [usuario],
        (_, { rows }) => {
          if (rows.length > 0) {
            const usuarioId = rows.item(0).id;
            navigation.navigate('Principal', { usuarioId });
            resolve(usuarioId);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};


db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS fotos (id INTEGER PRIMARY KEY AUTOINCREMENT, usuarioId INTEGER, url TEXT);'
  );
});

export const agregarFoto = (usuarioId, url) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO fotos (usuarioId, url) VALUES (?, ?);',
        [usuarioId, url],
        (_, result) => {
          resolve(result.insertId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};


export const obtenerFotosPorUsuarioId = (usuarioId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM fotos WHERE usuarioId = ?;',
        [usuarioId],
        (_, { rows }) => {
          const fotos = [];
          for (let i = 0; i < rows.length; i++) {
            fotos.push(rows.item(i));
          }
          resolve(fotos);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};


export const eliminarFoto = (fotoId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM fotos WHERE id = ?;',
        [fotoId],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const guardarFotoEnBD = async (usuarioId, fotoBase64) => {
  try {
    const result = await db.executeSql(
      'UPDATE usuarios SET foto = ? WHERE id = ?',
      [fotoBase64, usuarioId]
    );

    if (result[0].rowsAffected > 0) {
      console.log('Foto guardada correctamente en la base de datos');
    } else {
      console.warn('No se pudo guardar la foto en la base de datos');
    }
  } catch (error) {
    console.error('Error al guardar la foto en la base de datos:', error);
    throw error;
  }
};

export const obtenerTodasLasFotos = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM fotos;',
        [],
        (_, { rows }) => {
          const fotos = [];
          for (let i = 0; i < rows.length; i++) {
            fotos.push(rows.item(i));
          }
          resolve(fotos);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export {
  guardarFotoEnBD,
};




export default db;