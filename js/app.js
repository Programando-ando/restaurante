var ordenes = JSON.parse(localStorage.getItem("pedido")) || [];
var comandaItems = JSON.parse(localStorage.getItem("comanda")) || [];
var pagar = JSON.parse(localStorage.getItem("orden")) || [];
var platillo = document.getElementById("platillo");
var precio = document.getElementById("precio");
var p10 = document.getElementById("p10");
var p20 = document.getElementById("p20");
var p30 = document.getElementById("p30");
var gOrden = document.getElementById("gOrden");
var cOrden = document.getElementById("cOrden");
var comanda = document.getElementById("comanda");
var noOrdenMsg = document.getElementById("letras");

let propinaPorcentaje = 0;

var subtotalElement = document.getElementById('subtotal');
var propinaElement = document.getElementById('propina');
var totalElement = document.getElementById('total');

const registrarP = () => {
  var pla = platillo.value;
  var pre = parseFloat(precio.value);

  if (pla.trim() === "" || isNaN(pre) || pre <= 0) {
    Swal.fire("Complete los campos", "", "error");
    return;
  }

  const pedido = { platillo: pla, precio: pre };
  ordenes.push(pedido);
  
  localStorage.setItem("pedido", JSON.stringify(ordenes));

  platillo.value = "";
  precio.value = "";

  const orden2 = { platillo: pla, precio: pre };
  pagar.push(orden2);
  
  localStorage.setItem("orden", JSON.stringify(pagar));
  mostrar();
};


const mostrar = () => {
  pagar = JSON.parse(localStorage.getItem("orden")) || [];
  let orden1 = ``;
  
  pagar.forEach((pedi, i) => {
    orden1 += `
    <div class="card" style="width: 18rem;" onclick="agregarAComanda(${i})">
      <ul class="list-group list-group-flush">
        <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          ${pedi.platillo} 
          <span class="badge text-bg-primary rounded-pill">$${pedi.precio}</span> 
          <button class="btn btn-danger" onclick="event.stopPropagation(); borrarP(${i})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16">
              <path d="M2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
            </svg>
          </button>
        </li>
      </ul> 
    </div>`;
  });

  document.getElementById("num").innerHTML = orden1;
}

const agregarAComanda = (index1) => {
  if (noOrdenMsg) {
    noOrdenMsg.style.display = 'none';
  }
  
  var pedido = pagar[index1];
  
  var itemExistente = comandaItems.find(item => item.platillo === pedido.platillo);

 if (itemExistente) {
    itemExistente.cantidad += 1;
    
    var itemCard = document.getElementById(`comanda-item-${itemExistente.platillo}`);
    itemCard.querySelector('.cantidad').innerText = `Cantidad: ${itemExistente.cantidad}`;
    
   } else {
    pedido.cantidad = 1;
    comandaItems.push(pedido);

    var card = document.createElement('div');
    card.className = 'card';
    card.style.width = '18rem';
    card.id = `comanda-item-${pedido.platillo}`;
  
    var ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
  
    var li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
    li.innerHTML = `${pedido.platillo} <span class="badge text-bg-primary rounded-pill">$${pedido.precio}</span> <button class="btn btn-danger" onclick="elimiComanda('${pedido.platillo}')">x</button>`;
    
    var cantidad = document.createElement('div');
    cantidad.className = 'cantidad';
    cantidad.style.marginTop = '10px';
    cantidad.innerText = `Cantidad: ${pedido.cantidad}`;
    
    ul.appendChild(li);
    ul.appendChild(cantidad);
    card.appendChild(ul);
  
    comanda.appendChild(card);
  }
  
  calcularTotal(); 
}

const elimiComanda = (platillo) => {

  const index = comandaItems.findIndex(item => item.platillo === platillo);
  
  if (index !== -1) {
    comandaItems.splice(index, 1);
    localStorage.setItem("comanda", JSON.stringify(comandaItems));
    const itemCard = document.getElementById(`comanda-item-${platillo}`);
    if (itemCard) {
      itemCard.remove();
    }
    calcularTotal();

    Swal.fire("El platillo se eliminó exitosamente", "", "success");
  } else {
    Swal.fire("El platillo no se encontró", "", "error");
  }
}

const calcularTotal = () => {
  let subtotal = comandaItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  
  if (p10.checked) {
    propinaPorcentaje = 0.10;
  } else if (p20.checked) {
    propinaPorcentaje = 0.20;
  } else if (p30.checked) {
    propinaPorcentaje = 0.30;
  }

  let propina = subtotal * propinaPorcentaje;
  let total = subtotal + propina;
  
  subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
  propinaElement.innerText = `$${propina.toFixed(2)}`;
  totalElement.innerText = `$${total.toFixed(2)}`;
}

const borrarP = (index) => {
  Swal.fire({
    title: "¿Estás seguro de eliminar este platillo del menú?",
    showDenyButton: true,
    confirmButtonText: "Sí, eliminar",
    denyButtonText: "No, cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      ordenes.splice(index, 1);
      pagar.splice(index, 1);
      localStorage.setItem("pedido", JSON.stringify(ordenes));
      localStorage.setItem("orden", JSON.stringify(pagar));
      mostrar();

      Swal.fire("El platillo ha sido eliminado exitosamente", "", "success");
    }
  });
}

const cancelar=()=>{
  if (comandaItems.length == 0) {
    Swal.fire("No se puede cancelar algo vacio", "", "error");
  }else{
  Swal.fire({
    title: "¿Estás seguro de cancelar la orden?",
    showDenyButton: true,
    confirmButtonText: "Si",
    denyButtonText: "No"
}).then((result) => {
    if (result.isConfirmed) {
        comanda.innerHTML="";
        window.location.reload();
    }
});
}
}

const pagarO =()=>{
  if (comandaItems.length == 0) {
    Swal.fire("No se puede pagar algo vacio", "", "error");
  } else if (propinaPorcentaje==0) {
    Swal.fire("No se puede ir sin dejar propina", "", "error");
    calcularTotal();
  } else{
  Swal.fire({
    title: "¿Estás seguro de terminar la orden?",
    showDenyButton: true,
    confirmButtonText: "Si",
    denyButtonText: "No"
}).then((result) => {
    if (result.isConfirmed) {

        comanda.innerHTML="";
        localStorage.removeItem("comanda");
        window.location.reload();
    }
});
  }
}

p10.addEventListener('change', calcularTotal);
p20.addEventListener('change', calcularTotal);
p30.addEventListener('change', calcularTotal);

mostrar();