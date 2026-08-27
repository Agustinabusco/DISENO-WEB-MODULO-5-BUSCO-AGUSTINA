document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // 1) NAVEGACIÓN ENTRE SECCIONES
  // -----------------------------
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".seccion");

  function mostrarSeccion(id) {
    sections.forEach((section) => {
      section.classList.toggle("visible", section.id === id);
    });

    navButtons.forEach((button) => {
      button.classList.toggle("activo", button.dataset.seccion === id);
    });

    history.replaceState(null, "", `#${id}`);

    // Leaflet necesita recalcular el tamaño cuando el mapa pasa de oculto a visible.
    if (id === "contacto" && window.mapaJuegolandia) {
      setTimeout(() => window.mapaJuegolandia.invalidateSize(), 100);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => mostrarSeccion(button.dataset.seccion));
  });

  const seccionInicial = location.hash.replace("#", "");
  if (["inicio", "servicios", "contacto"].includes(seccionInicial)) {
    mostrarSeccion(seccionInicial);
  }

  // -------------------------------------------
  // 2) INICIO - MANIPULACIÓN AVANZADA DEL DOM
  // -------------------------------------------
  const datosEmpresa = [
    {
      icono: "🧩",
      titulo: "Aprender jugando",
      resumen: "Juegos que estimulan la creatividad, la lógica y la curiosidad.",
      detalle:
        "Seleccionamos propuestas que permiten explorar, resolver problemas y aprender de forma entretenida.",
      color: "#22c55e"
    },
    {
      icono: "🎨",
      titulo: "Imaginar y crear",
      resumen: "Materiales y juguetes pensados para inventar nuevas historias.",
      detalle:
        "Buscamos que cada juguete abra posibilidades: construir, dibujar, representar, combinar y crear.",
      color: "#f472b6"
    },
    {
      icono: "🤝",
      titulo: "Compartir",
      resumen: "Opciones para disfrutar en familia o con amigos.",
      detalle:
        "También ofrecemos juegos de mesa y propuestas cooperativas que invitan a compartir tiempo de calidad.",
      color: "#38bdf8"
    }
  ];

  const cardsContainer = document.getElementById("presentacion-cards");
  const detalleDinamico = document.getElementById("detalle-dinamico");

  datosEmpresa.forEach((item, indice) => {
    const card = document.createElement("article");
    card.className = "presentacion-card";
    card.tabIndex = 0;
    card.style.setProperty("--card-color", item.color);
    card.innerHTML = `
      <span class="icono">${item.icono}</span>
      <h3>${item.titulo}</h3>
      <p>${item.resumen}</p>
    `;

    const activarTarjeta = () => {
      document.querySelectorAll(".presentacion-card").forEach((c) => {
        c.classList.remove("seleccionada");
      });

      card.classList.add("seleccionada");

      detalleDinamico.innerHTML = `
        <span class="detalle-icono">${item.icono}</span>
        <div>
          <h3>${item.titulo}</h3>
          <p>${item.detalle}</p>
        </div>
      `;
    };

    card.addEventListener("click", activarTarjeta);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activarTarjeta();
      }
    });

    cardsContainer.appendChild(card);

    if (indice === 0) {
      // Deja una tarjeta preseleccionada al cargar.
      setTimeout(activarTarjeta, 0);
    }
  });

  const btnDescubrir = document.getElementById("btn-descubrir");
  const panelExtra = document.getElementById("panel-extra");

  btnDescubrir.addEventListener("click", () => {
    panelExtra.classList.toggle("oculto");
    btnDescubrir.textContent = panelExtra.classList.contains("oculto")
      ? "Descubrir Juegolandia"
      : "Ocultar información";
  });

  // --------------------------------
  // 3) SERVICIOS - GALERÍA DE IMÁGENES
  // --------------------------------
  const productos = [
    {
      titulo: "Bloques de construcción",
      imagen: "img/bloques.svg",
      descripcion: "Piezas de colores para construir, combinar formas y desarrollar la creatividad."
    },
    {
      titulo: "Robot explorador",
      imagen: "img/robot.svg",
      descripcion: "Un robot simpático para imaginar aventuras tecnológicas y juegos de exploración."
    },
    {
      titulo: "Tren de madera",
      imagen: "img/tren.svg",
      descripcion: "Un clásico para inventar recorridos, estaciones y pequeñas historias."
    },
    {
      titulo: "Rompecabezas creativo",
      imagen: "img/rompecabezas.svg",
      descripcion: "Piezas grandes y coloridas para trabajar la observación y la resolución de problemas."
    },
    {
      titulo: "Oso de peluche",
      imagen: "img/oso.svg",
      descripcion: "Un compañero suave para el juego simbólico, la imaginación y los momentos tranquilos."
    },
    {
      titulo: "Pelota multicolor",
      imagen: "img/pelota.svg",
      descripcion: "Ideal para juegos de movimiento, coordinación y diversión al aire libre."
    }
  ];

  const galeria = document.getElementById("galeria");
  const modal = document.getElementById("modal-imagen");
  const imgAmpliada = document.getElementById("imagen-ampliada");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalDescripcion = document.getElementById("modal-descripcion");
  const cerrarModal = document.getElementById("cerrar-modal");

  productos.forEach((producto) => {
    const card = document.createElement("article");
    card.className = "producto-card";

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Ampliar imagen de ${producto.titulo}`);
    button.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.titulo}">
      <h3>${producto.titulo}</h3>
      <p>${producto.descripcion}</p>
    `;

    button.addEventListener("click", () => abrirModal(producto));
    card.appendChild(button);
    galeria.appendChild(card);
  });

  function abrirModal(producto) {
    imgAmpliada.src = producto.imagen;
    imgAmpliada.alt = producto.titulo;
    modalTitulo.textContent = producto.titulo;
    modalDescripcion.textContent = producto.descripcion;
    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function ocultarModal() {
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  cerrarModal.addEventListener("click", ocultarModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      ocultarModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("abierto")) {
      ocultarModal();
    }
  });

  // --------------------------------
  // 4) CONTACTO - MAPA CON LEAFLET.JS
  // --------------------------------
  const estadoUbicacion = document.getElementById("estado-ubicacion");
  const btnUbicacion = document.getElementById("btn-ubicacion");

  if (typeof L !== "undefined") {
    const map = L.map("map").setView([-34.883, -56.119], 10);
    window.mapaJuegolandia = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const sucursales = [
      {
        nombre: "Juegolandia Centro",
        coords: [-34.9056, -56.1910],
        direccion: "Av. 18 de Julio 1234, Montevideo"
      },
      {
        nombre: "Juegolandia Pocitos",
        coords: [-34.9100, -56.1510],
        direccion: "Av. Brasil 2450, Montevideo"
      },
      {
        nombre: "Juegolandia Ciudad de la Costa",
        coords: [-34.8295, -55.9765],
        direccion: "Av. Giannattasio 18000, Canelones"
      }
    ];

    sucursales.forEach((sucursal) => {
      L.circleMarker(sucursal.coords, {
        radius: 9,
        weight: 3,
        color: "#ffffff",
        fillColor: "#4f46e5",
        fillOpacity: 1
      })
        .addTo(map)
        .bindPopup(`<b>${sucursal.nombre}</b><br>${sucursal.direccion}`);
    });

    let marcadorUsuario = null;

    btnUbicacion.addEventListener("click", () => {
      if (!("geolocation" in navigator)) {
        estadoUbicacion.textContent = "La geolocalización no está disponible en este navegador.";
        return;
      }

      estadoUbicacion.textContent = "Buscando tu ubicación...";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          if (marcadorUsuario) {
            map.removeLayer(marcadorUsuario);
          }

          marcadorUsuario = L.circleMarker([lat, lon], {
            radius: 10,
            weight: 3,
            color: "#ffffff",
            fillColor: "#f472b6",
            fillOpacity: 1
          })
            .addTo(map)
            .bindPopup("<b>Tu ubicación actual</b>")
            .openPopup();

          map.setView([lat, lon], 13);
          estadoUbicacion.textContent = "Ubicación encontrada y mostrada en el mapa.";
        },
        () => {
          estadoUbicacion.textContent =
            "No fue posible obtener tu ubicación. Podés seguir usando el mapa de sucursales.";
        }
      );
    });
  } else {
    estadoUbicacion.textContent =
      "El mapa necesita conexión a Internet para cargar la biblioteca Leaflet.js.";
    btnUbicacion.disabled = true;
  }
});
