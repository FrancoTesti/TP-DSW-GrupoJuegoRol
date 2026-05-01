// This = se refiere a la instancia del objeto

const prompt = require('prompt-sync')();

class Usuario {
  constructor(nickname, nombreUsuario, contrasena, imagen = null) {
    this.nickname = nickname;
    this.nombreUsuario = nombreUsuario;
    this.contrasena = contrasena;
    this.imagen = imagen;
  }
  cambiarcontrasena(nuevaContrasena) {
    this.contrasena = nuevaContrasena;
  }
  cambiarimagen(nuevaImagen) {
    this.imagen = nuevaImagen;
  }
}

class Jugador extends Usuario {
  constructor(nickname, nombreUsuario, contrasena, estado, imagen = null) {
    super(nickname, nombreUsuario, contrasena, imagen);
    this.estado = estado;
    this.personajes = [];  //instancias de la clase Personaje
  }
  crearPersonaje(idPersonaje, nombreFicticio, raza, clase) {
    const nuevoPersonaje = new Personaje(idPersonaje, nombreFicticio, raza, clase);
    nuevoPersonaje.inventario = new Inventario(20); // cada personaje comienza con un inventario de 20 espacios
    this.personajes.push(nuevoPersonaje);
    return nuevoPersonaje;
  }
}

class Anfitrion extends Usuario {
  constructor(nickname, nombreUsuario, contrasena, karma, cantPartidasActuales = 0, imagen = null) {
    super(nickname, nombreUsuario, contrasena, imagen);
    this.karma = karma;
    this.cantPartidasActuales = cantPartidasActuales;
    this.partidas = []; // instancias de la clase Partida
  }

  crearPartida(id, nombre, limiteJugadores, contrasena = null) {
    const nuevaPartida = new Partida(id, nombre, 'activa', limiteJugadores, this, contrasena);
    this.partidas.push(nuevaPartida);
    this.cantPartidasActuales++;
    return nuevaPartida;
  }
  terminarPartida(idPartida) {
    const partida = this.partidas.find(p => p.id === idPartida);
    if (partida) {
      partida.estado = 'finalizada';
      this.cantPartidasActuales--;
      console.log(`La partida ${partida.nombre} ha sido cerrada.`);
    }
  }
}

class Personaje {
  static razasValidas = [
    'elfo',
    'orco',
    'draconico',
    'humano',
    'enano',
    'gnomo',
    'goliat',
    'mediano',
    'tiefling',
    'aasimar'
  ];

  constructor(idPersonaje, nombreFicticio, raza, xp, dinero, clase, nivel) {
    this.idPersonaje = idPersonaje;
    this.nombreFicticio = nombreFicticio;
    this.raza = Personaje.validarRaza(raza) ? raza.toLowerCase() : null;
    this.xp = xp;
    this.dinero = dinero;
    this.clase = clase;
    this.nivel = nivel;
    this.inventario = null;
  }

  static validarRaza(raza) {
    if (typeof raza !== 'string') return false;
    return Personaje.razasValidas.includes(raza.toLowerCase());
  }

  static obtenerRazasValidas() {
    return [...Personaje.razasValidas];
  }

  obtenerRaza() {
    return this.raza;
  }

  cambiarRaza(nuevaRaza) {
    if (!Personaje.validarRaza(nuevaRaza)) {
      console.log(`Raza inválida: ${nuevaRaza}`);
      return false;
    }
    this.raza = nuevaRaza.toLowerCase();
    return true;
  }

  comprarObjeto(objeto) {
    if (this.dinero < objeto.valor) return false;
    // Ahora le delegamos al inventario la tarea de agregarlo
    if (this.inventario.agregarObjeto(objeto)) {
      this.dinero -= objeto.valor;
      return true;
    }
    return false;
  }

  otorgarRecompensaMision(mision) {
    this.xp += mision.xpOtorgadoJugadores; // suma la experiencia otorgada por la misión al personaje
    this.dinero += mision.dineroOtorgadoAJugadores; // suma el dinero otorgado por la misión al personaje
    this.nivel = Math.floor(this.xp / 1000) + 1; /* calcula el nivel del personaje 
    basado en su experiencia (ejemplo: cada 1000 XP es un nivel)*/

  }

}

class Partida {
  constructor(id, nombre, estado, limiteJugadores, anfitrion, contrasena = null)
      /*es un método especial en una clase que se ejecuta automáticamente
        cuando creas una nueva instancia del objeto. */ {
    this.id = id;
    this.nombre = nombre;
    this.estado = estado;
    this.limiteJugadores = limiteJugadores;
    this.contrasena = contrasena; // opcional, solo si la partida es privada
    this.anfitrion = anfitrion;
    this.sesiones = [];  // instancias de la clase Sesion
    this.jugadoresActivos = []; // lista de jugadores que ingresan a la partida
  }
  iniciarSesion(fechaYHora, duracionSesion) {
    const nuevaSesion = new Sesion(fechaYHora, duracionSesion, "activa", 0, this);
    nuevaSesion.cantJugadores = this.jugadoresActivos.length;
    this.sesiones.push(nuevaSesion);
    return nuevaSesion;
  }

  finalizarSesion(id) {
    const sesion = this.sesiones.find(s => s.id === id); // requiere agregar 'id' al constructor de Sesion
    if (!sesion) return false;
    sesion.estadoSesion = "terminada"; // estado exacto del UML
    console.log("Sesión finalizada con éxito.");
    return true;
  }
  agregarJugador(jugador, intentoContrasena) {
    if (this.jugadoresActivos.length >= this.limiteJugadores) {
      console.log("Partida llena bro.");
      return false;
    }
    if (this.contrasena && this.contrasena !== intentoContrasena) {
      console.log("Contraseña incorrecta.");
      return false;
    }
    this.jugadoresActivos.push(jugador);
    console.log(`Bienvenido a la partida, ${jugador.nickname}.`);
    return true;
  }
}
class Inventario {
  constructor(cantidadDeEspacios) {
    this.cantidadDeEspacios = cantidadDeEspacios;
    this.objetos = []; // instancias de la clase Objeto
  }
  agregarObjeto(objeto) {
    if (this.objetos.length >= this.cantidadDeEspacios) {
      console.log("Inventario lleno, tira algo.");
      return false;
    }
    this.objetos.push(objeto);
    return true;
  }
}

class Clase {
  constructor(idClase, nombreClase, descripcionClave) {
    this.idClase = idClase;
    this.nombreClase = nombreClase;
    this.descripcionClave = descripcionClave;
  }
}
class Objeto {
  constructor(id, nombre, descripcion, valor, esUnico, nivelObjeto) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.valor = valor;
    this.esUnico = esUnico;
    this.nivelObjeto = nivelObjeto;
  }
}
class Transaccion {
  constructor(idTransaccion, tipoDeTransaccion, montoTotal) {
    this.idTransaccion = idTransaccion;
    this.tipoDeTransaccion = tipoDeTransaccion; // compra / venta
    this.montoTotal = montoTotal;

  }
}

class Tienda {
  constructor(idTienda, nombre, tipoTienda, nivelDeTienda) {
    this.idTienda = idTienda;
    this.nombre = nombre;
    this.tipoTienda = tipoTienda;
    this.nivelDeTienda = nivelDeTienda;
    this.objetos = [];
  }
  agregarStock(objeto) {
    this.objetos.push(objeto);
  }

  procesarVenta(personaje, idObjeto) {
    const indexObjeto = this.objetos.findIndex(obj => obj.id === idObjeto);
    if (indexObjeto === -1) {
      console.log("No nos queda ese ítem.");
      return false;
    }

    const objeto = this.objetos[indexObjeto];

    // Si el personaje tiene plata y espacio (comprarObjeto valida ambas cosas)...
    if (personaje.comprarObjeto(objeto)) {
      this.objetos.splice(indexObjeto, 1); // Lo borramos del stock de la tienda
      console.log(`Venta realizada: ${objeto.nombre}`);
      return true;
    }
    console.log("La venta falló (sin plata o sin espacio).");
    return false;
  }
}
class Mision {
  constructor(descripcion, dineroTotal, xpTotal, xpOtorgadoJugadores, dineroOtorgadoAJugadores) {
    this.descripcion = descripcion;
    this.dineroTotal = dineroTotal;
    this.xpTotal = xpTotal;
    this.xpOtorgadoJugadores = xpOtorgadoJugadores;
    this.dineroOtorgadoAJugadores = dineroOtorgadoAJugadores;
    this.estado = "pendiente";
  }
  completarMision(grupoDePersonajes) {
    if (this.estado === "completada") return false;

    grupoDePersonajes.forEach(personaje => {
      personaje.otorgarRecompensaMision(this);
    });

    this.estado = "completada";
    console.log(`Misión "${this.descripcion}" completada por el grupo.`);
    return true;
  }
}
class Sesion {
  constructor(duracionSesion, fechaYHora) {
    this.duracionSesion = duracionSesion;
    this.fechaYHora = Date.now();
    this.cantJugadores = 0;
    this.estadoSesion = "activa";
    this.misiones = [];
  }
}

let arregloJugadores = []
let arregloAnfitriones = []
let menu1 = true;
let menu1_2 = true;
let menu1_2_1 = true;

while (menu1) {
  console.log("___________________________________________________________________________________________________");
  console.log("Seleccione una opción:");
  console.log("1- Loguearse");
  console.log("2- Registrarse");
  console.log("3. Salir");
  console.log("___________________________________________________________________________________________________");
  let opcion1 = prompt("Ingrese el número de opción: ");

  switch (opcion1) {
    case "1":
      console.log("Loguearse");
      break;

    case "2":
      menu1_2 = true;

      while (menu1_2) {
        console.log("___________________________________________________________________________________________________");
        console.log("Seleccione una opción:");
        console.log("1- Registrarse como Jugador");
        console.log("2- Registrarse como Anfitrion");
        console.log("3. Volver");
        console.log("___________________________________________________________________________________________________");
        let opcion1_2 = prompt("Ingrese el número de opción: ");

        switch (opcion1_2) {
          case "1":
            menu1_2_1 = true;
            while (menu1_2_1) {
              console.log("___________________________________________________________________________________________________");
              console.log("Seleccione una opción:");
              console.log("1- Confirmar registro como Jugador");
              console.log("2- Volver");
              console.log("___________________________________________________________________________________________________");
              let opcion1_2_1 = prompt("Ingrese el número de opción: ");

              switch (opcion1_2_1) {
                case "1":
                  const jugador = new Jugador();

                  let menu1_2_1_1 = true;
                  while (menu1_2_1_1) {
                    jugador.nickname = prompt("Ingrese su nickname: ");
                    console.log("___________________________________________________________________________________________________");
                    console.log("Su nickname es: " + jugador.nickname);
                    console.log("Confirme su nickname:");
                    console.log("1- Confirmar");
                    console.log("2- Volver");
                    console.log("___________________________________________________________________________________________________");
                    let opcion1_2_1_1 = prompt("Ingrese el número de opción: ");

                    switch (opcion1_2_1_1) {
                      case "1":
                        console.log("Nickname confirmado");
                        menu1_2_1_1 = false;
                        break;
                      case "2":
                        break;
                      default:
                        console.log("Opción no válida");
                        break;
                    }
                  }

                  let menu1_2_1_2 = true;
                  while (menu1_2_1_2) {
                    jugador.contrasena = prompt("Ingrese su contraseña: ");
                    console.log("___________________________________________________________________________________________________");
                    console.log("Su contraseña es: " + jugador.contrasena);
                    console.log("Confirme su contraseña:");
                    console.log("1- Confirmar");
                    console.log("2- Volver");
                    console.log("___________________________________________________________________________________________________");
                    let opcion1_2_1_2 = prompt("Ingrese el número de opción: ");

                    switch (opcion1_2_1_2) {
                      case "1":
                        console.log("Contraseña confirmada");
                        menu1_2_1_2 = false;
                        break;
                      case "2":
                        break;
                      default:
                        console.log("Opción no válida");
                        break;
                    }
                    arregloJugadores.push(jugador);
                  }
                  menu1_2_1 = false;
                  break;

                case "2":
                  menu1_2_1 = false;
                  break;

                default:
                  console.log("Opción no válida");
                  break;
              }
            }
            break;

          case "2":
            console.log("Ingresar datos");
            break;

          case "3":
            menu1_2 = false;
            break;

          default:
            console.log("Opción no válida");
            break;
        }
      }
      break;

    case "3":
      console.log("Salir");
      menu1 = false;
      break;

    default:
      console.log("Opción no válida");
      break;
  }
}
console.log(arregloJugadores)


/* // Ejemplo de objeto para la clase Partida
const partidaEjemplo = new Partida(
  'Aventura épica', // nombre
  'abierta',         // estado
  1,                 // id
  6,                 // limiteJugadores
  null               // contraseña opcional
); */
