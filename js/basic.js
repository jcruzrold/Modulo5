let fShowItemDetail = (oItem) => {
    console.log("Id artículo: "     + oItem.id    + 
    "\tNombre: "        + oItem.name  +
    "\tPrecio unidad: " + oItem.price +
    "\tCantidad: "      + oItem.count +
    "\t¿Es premium? : " + (oItem.premium ? "Sí" : "No") +
    "\n"
    );    
}

let fShowShoppingCartContent = (oShoppingCart) => {
    console.log("\nContenido carro de la compra\n");

    for(oItem of oShoppingCart) fShowItemDetail(oItem);
}

let fListAllProducts = (oShoppingCart) => {
    console.log("\nListado de productos carro de la compra\n");

    for(oItem of oShoppingCart) console.log(oItem.name + "\n");
}

let fRemoveItem = (oShoppingCart, nId) => {
    let oItemToDelete;

    console.log("\nBorrando item con id: " + nId);

    for(oItem of oShoppingCart) if(oItem.id === nId) oItemToDelete = oItem;

    oShoppingCart.splice(oShoppingCart.indexOf(oItemToDelete),1);
}

let fCalculateTotal = (oShoppingCart) => {
    let nTotal = 0;

    for(oItem of oShoppingCart) nTotal += oItem.count * oItem.price;

    return nTotal;
}

let fFilterPrimeItems = (oShoppingCart) => {
    console.log("\nMostrando solo objetos premium");

    for(oItem of oShoppingCart) oItem.premium ? fShowItemDetail(oItem) : "";
}

window.onload = function() {
    fShowShoppingCartContent(oShoppingCart);
    fListAllProducts(oShoppingCart);
    fRemoveItem(oShoppingCart, 54657);
    fShowShoppingCartContent(oShoppingCart);
    console.log("\nEl total de la compra es: " + fCalculateTotal(oShoppingCart).toFixed(2));
    fFilterPrimeItems(oShoppingCart);
}