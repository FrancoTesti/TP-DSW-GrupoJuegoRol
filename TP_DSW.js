{
} { }// This = se refiere a la instancia del objeto

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
  ingresarContraseña() {
    this.contrasena = prompt("Ingrese su contraseña: ");
    console.log("___________________________________________________________________________________________________");
    console.log("Su contraseña es: " + this.contrasena);
    console.log("Confirme su contraseña:");
    console.log("1- Confirmar");
    console.log("2- Volver");
    console.log("___________________________________________________________________________________________________");
    let opcion1_2_1_2 = prompt("Ingrese el número de opción: ");

    switch (opcion1_2_1_2) {
      case "1":
        console.log("Contraseña confirmada");
        return true;
      case "2":
        return false;
      default:
        console.log("Opción no válida");
        return false;
    }
  }
  ingresarNickname() {
    this.nickname = prompt("Ingrese su nickname: ");
    console.log("___________________________________________________________________________________________________");
    console.log("Su nickname es: " + this.nickname);
    console.log("Confirme su nickname:");
    console.log("1- Confirmar");
    console.log("2- Volver");
    console.log("___________________________________________________________________________________________________");
    let opcion1_2_1_1 = prompt("Ingrese el número de opción: ");

    switch (opcion1_2_1_1) {
      case "1":
        console.log("Nickname confirmado");
        return true;
      case "2":
        return false;
      default:
        console.log("Opción no válida");
        return false;
    }
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


  static obtenerRazasValidas(); {
  return [...Personaje.razasValidas];
}

obtenerRaza(); {
  return this.raza;
}

cambiarRaza(nuevaRaza); {
  if (!Personaje.validarRaza(nuevaRaza)) {
    console.log(`Raza inválida: ${nuevaRaza}`);
    return false;
  }
  this.raza = nuevaRaza.toLowerCase();
  return true;
}

comprarObjeto(objeto); {
  if (this.dinero < objeto.valor) return false;
  // Ahora le delegamos al inventario la tarea de agregarlo
  if (this.inventario.agregarObjeto(objeto)) {
    this.dinero -= objeto.valor;
    return true;
  }
  return false;
}

otorgarRecompensaMision(mision);: {
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
    this.tipoDeTransacc
    ion = tipoDeTransaccion; // compra / venta
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

  buscarObjeto(idObjeto) {
    this.objetos.find(
      objeto => objeto.id === idObjeto
    );
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
/* Hacer una opción en el menu, para ver el listado Historial*/

class Sesion {
  constructor(id, fechaYHora, duracionSesion, partida) {
    this.id = id
    this.fechaYHora = Date.now();
    this.duracionSesion = duracionSesion;
    this.partida = partida
    this.cantJugadores = 0;
    this.estadoSesion = "activa";
    this.misiones = [];
    this.historial = [];
  }

  registrarAccion(descripcion) {
    const fecha = new Date().toLocaleString();
    this.historial.push(`[${fecha}] ${descripcion}`);
  }
}

let arregloJugadores = []
let arregloAnfitriones = []
let menu1 = true;

while (menu1) {
  console.log("___________________________________________________________________________________________________");
  console.log("Seleccione una opción:");
  console.log("1- Loguearse");
  console.log("2- Registrarse");
  console.log("3- Salir");
  console.log("___________________________________________________________________________________________________");
  let opcion1 = prompt("Ingrese el número de opción: ");
  switch (opcion1) {
    case "1":
      menu1_1 = true;
      while (menu1_1) {
        console.log("___________________________________________________________________________________________________");
        console.log("Seleccione una opción:");
        console.log("1- Confirmar logueo como Jugador");
        console.log("2- Volver");
        console.log("___________________________________________________________________________________________________");
        let opcion1_1 = prompt("Ingrese el número de opción: ");
        switch (opcion1_1) {
          case "1":
            let nicknameLogin = prompt("Ingrese su nickname: ");
            let contrasenaLogin = prompt("Ingrese su contraseña: ");
            let usuarioEncontrado = arregloJugadores.find(j => j.nickname === nicknameLogin && j.contrasena === contrasenaLogin);
            if (usuarioEncontrado) {
              console.log("Se logueó como un jugador");
            } else {
              usuarioEncontrado = arregloAnfitriones.find(a => a.nickname === nicknameLogin && a.contrasena === contrasenaLogin);
              if (usuarioEncontrado) {
                console.log("Se logueó como un anfitrión");
              } else {
                console.log("Usuario no encontrado");
              }
              menu1_1 = false;
            }
          case "2":
            menu1_1 = false;
            break;
          default:
            console.log("Opción no válida");
            break;
        }
      }

      break;
    case "2":
      menu1_2 = true;
      while (menu1_2) {
        conso.log("___________________________________________________________________________________________________");
        console.log("Seleccione una opción:");
        console.log("1- Registrarse como Jugador");
        console.log("2- Registrarse como Anfitrion");
        console.log("3- Volver");
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
                  let confirmadoNickname = false;
                  while (!confirmadoNickname) {
                    confirmadoNickname = jugador.ingresarNickname();
                  }
                  let confirmadoContrasena = false;
                  while (!confirmadoContrasena) {
                    confirmadoContrasena = jugador.ingresarContraseña();
                  }
                  arregloJugadores.push(jugador);
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
            menu1_2_2 = true;
            while (menu1_2_2) {
              console.log("________________________________________");
              console.log("Seleccione una opción:");
              console.log("1- Confirmar registro como Anfitrion");
              console.log("2- Volver");
              console.log("________________________________________");
              let opcion1_2_2 = prompt("Ingrese el número de opción: ");
              switch (opcion1_2_2) {
                case "1":
                  const anfitrion = new Anfitrion();
                  let confirmadoNickname = false;
                  while (!confirmadoNickname) {
                    confirmadoNickname = anfitrion.ingresarNickname();
                  }
                  arregloAnfitriones.push(anfitrion);
                  menu1_2_2 = false;
                  break;
                case "2":
                  menu1_2_2 = false;
                  break;
                default:
                  console.log("Opción no válida");
                  break;
              }
            }
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
console.log(arregloJugadores);

/* // Ejemplo de objeto para la clase Partida
const partidaEjemplo = new Partida(
  'Aventura épica', // nombre
  'abierta',         // estado
  1,                 // id
  6,                 // limiteJugadores
  null               // contraseña opcional
); */


// METODOS 
// Clase partida ( gestion de turno )
iniciarTurno(); {
  if (this.jugadoresActivos.length === 0) return null; // Si no hay jugadores activos, no se puede iniciar el turno
  this.indiceTurnoActual = 0; // El primer jugador en la lista de jugadores activos comienza el turno
  return this.jugadoresActivos[this.indiceTurnoActual]; // Devuelve el jugador que inicia el turno
}
console.log("tu vieja");

avanzarTurno(); {
  if (this.indiceTurnoActual === null || this.jugadoresActivos.length === 0) return null; // Si no hay un turno iniciado o no hay jugadores activos, no se puede avanzar el turno
  this.indiceTurnoActual = (this.indiceTurnoActual + 1) % this.jugadoresActivos.length; // Avanza al siguiente jugador en la lista de jugadores activos, volviendo al inicio si se llega al final
  return this.jugadoresActivos[this.indiceTurnoActual]; // Devuelve el jugador que tiene el turno actual después de avanzar 
}

// VER DESPUES SI PROGRAMAMOS ELIMINAR JUGADOR DE PARTIDA ( SI SE VA O SE DESCONECTA ) Y COMO AFECTA AL TURNO //
//Clase Partida
removerJugador(idUsuario); {
  let idx = this.JugadoresActivos.findIndex(
    jugador => jugador.nombreUsuario === idUsuario // suponiendo que el idUsuario es el nombre de usuario del jugador, ajusta según corresponda
  );
  if (idx != -1) {
    this.jugadoresActivos.splice(idx, 1); // Elimina al jugador del arreglo de jugadores activos
  }
}

//Clase tienda
equiparObjeto(idObjeto); {
  let objeto = Tienda.buscarObjeto(idObjeto);
  if (objeto.nivelObjeto > this.nivel) {
    console.log(`Notiene el nivel suficiente para comprar el objeto. Tiene ${this.nivel} y precisa ${objeto.nivelObjeto}`);
  }
  else {
    switch (objeto.tipoObjeto) {
      case "armadura": {
        let idx = this.inventario.findIndex(
          item => item.id === idObjeto
        );
        if (idx !== -1) {
          this.inventario.splice(idx, 1);
        }
        let armaduraVieja = this.armadura;
        if (armaduraVieja !== null) {
          this.inventario.push(armaduraVieja);
        }
        this.armadura = objeto;
        break;
      }
      case "espada": {
        let idx = this.inventario.findIndex(
          item => item.id === idObjeto
        );
        if (idx !== -1) {
          this.inventario.splice(idx, 1);
        }
        let espadaVieja = this.espada;
        if (espadaVieja !== null) {
          this.inventario.push(espadaVieja);
        }
        this.espada = objeto;
        break;
      }
      case "escudo": {
        let idx = this.inventario.findIndex(
          item => item.id === idObjeto
        );
        if (idx !== -1) {
          this.inventario.splice(idx, 1);
        }
        let escudoViejo = this.escudo;
        if (escudoViejo !== null) {
          this.inventario.push(escudoViejo);
        }
        this.escudo = objeto;
        break;
      }
    }
  }
}
iniciarVenta(idObjeto, personaje, tienda);: {
  tienda.comprarAlJugador(personaje, idObjeto);
}
//Clase personaje
venderObjeto(idObjeto, precioPropuesto); {

  const factorAleatorio = 0.5 + Math.random









}

/*com rarObjeto(personaje, idObjeto)*/ { }

iniciarVenta(idObjeto, personaje, tienda);: {
  tienda.comprarAlJugador(personaje, idObjeto);
}
//Clase personaje
venderObjeto(idObjeto, factor); {
  const index = this.inventario.objetos.findIndex(obj => obj.id === idObjeto);
  if (index === -1) return null;

  const objeto = this.inventario.objetos.findIndex(obj => obj.id === idObjeto);
  if (index === -1) return null;

  const objeto = this.inventario
  this.dinero += Math.floor(objeto.valor * factor); // El personaje recibe el dinero de la venta, ajustado por el factor de venta

  return objeto; // Devuelve el objeto vendido para que la tienda pueda agregarlo a su stock

}

comprarObjeto(personaje, idObjeto) {

  const indexObjeto = this.objetos.findIndex(
    obj => obj.id === idObjeto
  );

  if (indexObjeto === -1) {
    console.log("No tenemos ese objeto.");
    return false;
  }

  const objeto = this.objetos[indexObjeto];

  if (personaje.comprarObjeto(objeto)) {

    this.objetos.splice(indexObjeto, 1);

    console.log(Compra realizada: ${ objeto.nombre });

    return true;
  }

  console.log("No hay dinero o espacio suficiente.");

  return false;
}

comprarObjeto(personaje, idObjeto) {

  const indexObjeto = this.objetos.findIndex(
    obj => obj.id === idObjeto
  );

  if (indexObjeto === -1) {
    console.log("No tenemos ese objeto.");
    return false;
  }

  const objeto = this.objetos[indexObjeto];

  if (personaje.comprarObjeto(objeto)) {

    this.objetos.splice(indexObjeto, 1);

    console.log(`Compra realizada: ${objeto.nombre}`);

    return true;
  }

  console.log("No hay dinero o espacio suficiente.");

  return false;
}