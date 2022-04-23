const productos = [
    {
        id: 1,
        img: "img/remera.jpg",
        name: "Remera",
        price: 1600,
        stock: 25,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Congue nisi vitae suscipit tellus mauris a diam maecenas sed. Sagittis purus sit amet volutpat consequat mauris nunc congue. Sagittis purus sit amet volutpat consequat mauris nunc congue.",
        category: "remeras",
        season: "Winter 2022"
    },
    {
        id: 2,
        img: "img/jean.jpg",
        name: "Jean",
        price: 5500,
        stock: 10,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Congue nisi vitae suscipit tellus mauris a diam maecenas sed. Sagittis purus sit amet volutpat consequat mauris nunc congue. Sagittis purus sit amet volutpat consequat mauris nunc congue.",
        category: "jeans",
        season: "Winter 2022"
    },
    {
        id: 3,
        name: "Campera",
        img: "img/campera.jpg",
        price: 16000,
        stock: 30,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Congue nisi vitae suscipit tellus mauris a diam maecenas sed. Sagittis purus sit amet volutpat consequat mauris nunc congue. Sagittis purus sit amet volutpat consequat mauris nunc congue.",
        category: "abrigo",
        season: "Winter 2022"
    }
]

// VARIALBES GLOBALES
const queryId = (id) => document.getElementById(id)
const queryClass = (className) => document.getElementsByClassName(className)
let category = undefined // Me captura la categoria elegida por el boton que clickea el usuario, inicialmente undefined para que muestre TODO
let cart = [] // Array vacio donde guardo lo que el usuario agrega el carrito

// Promesas: se cumplen o no
// Tres estados: pending => fullfilled || rejected
const getFetch = new Promise((resolve, rejected) => {
    let condicion = true // en logicas mas grandes puedo llegar a tener una condicion para hacer que la promise se cumpla o no, en este caso hardcodeamos
    if (condicion) {
        resolve(productos) // el callback resolve resuelve la promise, en este caso mi array de productos
    } else {
        rejected('error') // el callback rejected se ejecutara si la promise no se cumple y ahi podria hacer mas cosas
    }
})
// "res" es mi array de productos que se resuelve con la promise
const requestProducts = () => {
    getFetch
        .then(res => {
            if (category) { // pregunto si tengo categoria guardada, si da true filtro por categoria, sino, resuelvo el array entero
                renderProducts(res.filter(prod => prod.category === category))
            } else {
                renderProducts(res)
            }
        })
        .catch(err => console.log(err))
}
requestProducts() // muestro todo apenas se carga la pag

// aca vuelvo a utilizar mi promise pero para poder encontrar el producto que coincide con el ID del boton de "Ver Producto"
const productDetail = (id) => {
    getFetch
        .then(res => {
            const product = res.find(prod => prod.id === id)
            renderProduct(product)
        })
        .catch(err => console.log(err))
}

// RENDER FUNCTION
const renderProducts = (productos) => { // renderiza todos los productos que reciba
    queryId("container").innerHTML = "" // limpio primero mi contenedor, para renderizar luego, eso se hace constantemente en el proyecto
    for (const { id, name, img, price, stock, category, season } of productos) {
        queryId("container").innerHTML += `
            <div class="card m-2" style="width: 18rem;">
                <img src="${img}" class="card-img-top" alt="${name}">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">$${price}</p>
                    <p class="card-text">Stock: ${stock}</p>
                    <span class="badge bg-dark">${category}</span>
                    <span class="badge bg-dark">${season}</span>
                </div>
                <button class="btn btn-secondary mb-2" onclick="productDetail(${id})">Ver Producto</button>
            </div>         
        `
    }
}
// hago un destructuring adentro del parametro de mi func que en realidad lo que esta recibiendo es el objeto "product", y renderizo el detalle
const renderProduct = ({ id, name, img, price, stock, category, description, season }) => {
    queryId("container").innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
            <div class="col-md-4">
                <img src="${img}" class="img-fluid rounded-start" alt="${name}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">$${price}</p>
                    <p class="card-text">Stock: ${stock}</p>
                    <label for="exampleColorInput" class="form-label">Color</label>
                    <input type="color" class="form-control form-control-color mb-2" id="exampleColorInput" value="#563d7c" title="Choose your color">
                    <p class="card-text">${description}</p>
                    <span class="badge bg-dark">${category}</span>
                    <span class="badge bg-dark">${season}</span>
                </div>
            </div>
            <button class="btn btn-info mb-2" onclick="addToCart(${id})">Agregar al carrito</button>
            </div>
        </div>        
    `
}
// esta funcion me renderiza los datos del carrito como una tabla
const renderCart = () => {
    queryId("container").innerHTML = "" // limpio el contenedor
    if (cart.length) { // cart.length si es 0 equivale a falso, si es igual o mayor a 1 es verdadero
        queryId("table").classList.remove("d-none") // quito la clase que me oculta la tabla
        queryId("table--body").innerHTML = "" // limpio la tabla para luego renderizar
        for (const { id, quantity, name } of cart) { // hago un for para iterar el array de productos y por cada vuelta renderizo esos datos
            queryId("table--body").innerHTML += `
            <tr>
                <td>${name}</td>
                <td>${quantity}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteProduct(${id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>            
            `
        }
    } else { // en caso de que cart.length sea 0 entro aca, en donde vuelvo a ocultar la tabla y muestro un msj de que aun no hay productos
        queryId("table").classList.add("d-none")
        queryId("container").innerHTML = "Aun no hay productos"
    }
}

// CART LOGIC
const addToCart = (id) => { 
    getFetch // vuelvo a usar la promise porque yo necesito usar el id para hacer muchas validaciones
        .then(res => {
            const isInCart = cart.find(prod => prod.id === id) // me busca si existe ese producto en mi array de CART
            const product = res.find(prod => prod.id === id) // me busca ese producto del array de PRODUCTOS que resuelve la PROMISE
            if (!isInCart) { // si el producto NO esta en el carrito, lo pusheo agregandole la propiedad quantity inicializada en 1
                cart.push({...product, quantity: 1})
            } else { // si SI esta en el carrito, tengo que buscarlo en el array de CART e incrementarle el quantity
                const productInCart = cart.find(prod => prod.id === id) // aca lo busco
                const newQuantity = productInCart.quantity + 1 // aca aumento el quantity
                cart = cart.map(prod => { // aca le digo a CART que ahora me va a guardar un array nuevo modificado, por eso uso map()
                    if (prod.id === id) { // si el producto coincide con mi ID que recibo en la funcion, entonces le modifico el quantity por el incrementado
                        return {...prod, quantity: newQuantity}
                    } else { // y para todos los que no son ese ID, los retorno sin modificar
                        return prod
                    }
                })
            }
        })
        .catch(err => console.log(err))
}
// function para eliminar el producto del carrito que selecciona el usuario
const deleteProduct = (id) => {
    cart = cart.filter(prod => prod.id !== id) // devuelvo todos los productos que NO coinciden con mi ID
    renderCart() // vuelvo a renderizar el carrito para mostrarle al usuario que logro eliminarlo
}

// EVENTS
for (const button of queryClass("category--buttons")) { // por cada uno de mis botones de categorias, le agrego el evento de tipo click para filterar
    button.addEventListener("click", () => {
        queryId("table").classList.add("d-none") // aca le vuelvo a agregar el display none a la tabla por si el usuario luego de ver el carrito, vuelve a la pagina principal de productos
        if (button.id) { // si mi boton tiene id, guardo en category ese id, el unico que no tiene id es mi boton "todo" por lo tanto si clickeo en todo sigue siendo undefined
            category = button.id
        } else {
            category = undefined
        }
        requestProducts()
    })
}

queryId("cart").addEventListener("click", renderCart) // evneto que renderiza el carrito

// queryId("remeras").addEventListener("click", () => {
//     category = "remeras"
//     requestProducts()
// })
// queryId("jeans").addEventListener("click", () => {
//     category = "jeans"
//     requestProducts()
// })
// queryId("abrigo").addEventListener("click", () => {
//     category = "abrigo"
//     requestProducts()
// })
// queryId("todo").addEventListener("click", () => {
//     category = undefined
//     requestProducts()
// })