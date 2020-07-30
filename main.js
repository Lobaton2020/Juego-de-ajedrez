var elementoArrastrandose;
var columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
// -------------------------------------------------------------------------------------------------
/*
    Mueve la pieza al nuevo sitio y quita la anterior
    @e informacion del evento drop
*/
const traslatePiece = (e) => {
    let data = e.dataTransfer.getData("piece");
    e.target.innerHTML = data;
    addDragDrop(e.target.childNodes[0]);
    elementoArrastrandose.parentNode.removeChild(elementoArrastrandose);
};

/*
    @element elemento a aplicar los estilos
    @type (show-hide) quitar o poner efectos
*/
const animatePiece = (element, type) => {
    if (type == "show") {
        if (element.classList.contains("blanca")) {
            element.classList.add("over-white");
        } else {
            element.classList.add("over-black");
        }
    } else {

        if (element.classList.contains("over-white")) {
            element.classList.remove("over-white");
        } else {
            element.classList.remove("over-black");
        }
    }
};

/*
    Añade los eventos  al nuevo elemento
    @elemento representa la nueva pieza que se movio
*/
const addDragDrop = (elemento) => {
    elemento.addEventListener("dragstart", dragStart, false);
    elemento.addEventListener("dragend", dragEnd, false);
};
/*
    Añade reglas de movimento para los peones
    @e informacion del evento drop
    @peon elemento que se esta arrastrando (el anterior)
*/
const verifyMovePeon = (e, peon) => {
    let columnOld = peon.parentNode.id.substring(0, peon.parentNode.id.length - 1);
    let columnNew = e.target.id.substring(0, e.target.id.length - 1) || e.target.parentNode.id.substring(0, e.target.parentNode.id.length - 1);
    let colAround = columns.indexOf(columnOld);

    let rowOld = parseInt(peon.parentNode.id.substring(1));
    let rowNew = parseInt(e.target.id.substring(1)) || parseInt(e.target.parentNode.id.substring(1));

    if (columnNew == columnOld || columnNew == columns[colAround - 1] || columnNew == columns[colAround + 1]) {
        if (e.target.parentNode.childNodes.length == 1) {
            if (e.target.parentNode.childNodes[0].classList.contains("negra")) {
                console.log(e.target.tagName)
                if (columnNew != columnOld && e.target.tagName == "IMG") {

                    let data = e.dataTransfer.getData("piece");
                    let newElement = document.getElementById(columnNew + rowNew);
                    e.target.parentNode.innerHTML = data;
                    peon.outerHTML = "";
                    console.log(columnNew + rowNew)
                    addDragDrop(newElement);
                    if (!document.querySelector("img.negra")) {
                        alert("Hemos Vencido!")
                    }
                }
            }
        } else {
            if (columnNew == columnOld) {

                traslatePiece(e);
                animatePiece(e.target, "hide")
            }
        }


    } else {
        console.log("Error")
    }

}

/*
    Reglas de movimiento para el peon
    @e informacion del evento drop
*/
const validatePeon = (e, type) => { // Reglas de movimiento para el peon
    let peon = elementoArrastrandose;
    let numMove = 0;
    let rowOld = parseInt(peon.parentNode.id.substring(1));
    let rowNew = parseInt(e.target.id.substring(1)) || parseInt(e.target.parentNode.id.substring(1));
    if (peon.classList.contains("negra")) {
        numMove = -1;
    } else {
        numMove = 1;
    }
    if (rowNew % rowOld == 0) {
        if (!peon.classList.contains("salida")) {
            if (peon.classList.contains("negra")) {
                numMove = -2;
            } else {
                numMove = 2;
            }
        }
        if (rowNew == rowOld + numMove) {
            (type == "drop") ? verifyMovePeon(e, peon): animatePiece(e.target, "show");

        }
    } else {
        if (rowNew == rowOld + numMove) {
            (type == "drop") ? verifyMovePeon(e, peon): animatePiece(e.target, "show");
        }
    }
};
/*
    Valida que tipo de pieza se esta moviendo (aplica las reglas dependiendo de esta)
    @e informacion del evento drop
    @type (drop-over) indica el tipo de llamada que se hace
*/
const validatePiece = (e, type = "drop") => {
    switch (elementoArrastrandose.classList[2]) {
        case "peon":
            validatePeon(e, type);
            break;
        default:
            console.log("Pieza no configurada")
    }
};


// -------------------------------------------------------------------------------------------------

// Acciones de elementos a arrastrar
const dragStart = (e) => { // Empieza el arrastre del elemento
    elementoArrastrandose = e.target;
    e.dataTransfer.setData("piece", e.target.outerHTML);

}


const dragEnd = (e) => { //Finaliza el proceso de arrastre
    e.preventDefault();
}

// Acciones del contenedor del elemento
const dragOver = (e) => { // (casilla) Acciones al dejar el elemento !!cuando esta sostenido con el mouse - Similar a dragEnter
    e.preventDefault();
    validatePiece(e, "over");
    return false;
}

const dragLeave = (e) => { //(casilla) Acciones al ponerse encima del elemento !!cuando esta sostenido con el mouse
    animatePiece(e.target, "hide");
}

const drop = (e) => { //(casilla) Acciones para soltar el elemento
        e.preventDefault();
        validatePiece(e, "drop");
    }
    // -------------------------------------------------------------------------------------------------
const init = (e) => { // acciones de inicializacion tablero
    let piezas = document.getElementsByClassName("pieza");
    let casillas = document.getElementsByClassName("casilla");

    for (let casilla of casillas) {
        casilla.addEventListener("dragover", dragOver, false);
        casilla.addEventListener("dragleave", dragLeave, false);
        casilla.addEventListener("drop", drop, false);
    }
    for (let pieza of piezas) {
        if (typeof pieza.innerHTML != "undefined") {
            pieza.setAttribute("draggable", "true");
            pieza.addEventListener("dragstart", dragStart, false)
            pieza.addEventListener("dragend", dragEnd, false)
        }
    }

}

//ejecuta la funcion al cargar el navegador
window.addEventListener("load", init, false);