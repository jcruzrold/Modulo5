const sEuroSign = "&#8364;";
const sBinIcon = "&#128465;";
const sSumSign = "&#43;";
const sSubtractSign = "&#8722;";
const sPremiumMedal = "&#127941;";

let fGenerateButton = (sId, sButtonText) => "<button id=\"" + sId + "\">" + sButtonText + "</button>";
let fGenerateImg = (sId, sPath, sAlternate) => "<img id=\"" + sId + "\" src=\"" + sPath + "\" alt=\"" + sAlternate + "\">";
let fGenerateParagraph = (sId, sClass, sParagraphText) => "<p id=\"" + sId + "\" class=\"" + sClass + "\">" + sParagraphText + "</p>";
let fGenerateCheckbox = (sId, sName, bIsChecked, sLabelText) => "<input type=\"checkbox\" name=\"" + sName + "\" id=\"" + sId + "\"" + (bIsChecked ? "checked" : "") + ">" + "<label for=\"" + sName + "\">" + sLabelText + "</label>";
let fGenerateSpan = (sId, sClass, sSpanText) => {
    let sSpan = "<span ";

    if(sId.length !== 0) sSpan += "id=\"" + sId + "\" ";

    if(sClass.length !== 0) sSpan += "class=\"" + sClass + "\" ";

    sSpan += ">" + sSpanText + "</span>";

    return sSpan;
}
let fGenerateDiv = (sId, sClass, sDivContent) => {
    let sDiv = "<div ";

    if(sId.length !== 0) sDiv += "id=\"" + sId + "\" ";

    if(sClass.length !== 0) sDiv += "class=\"" + sClass + "\" ";
    
    sDiv += ">" + sDivContent + "</div>";

    return sDiv;
}

let fGenerateItemStructure = (oItem) => {
    //Remove container
    let sRemoveButton = fGenerateButton("item_remove_button_" + oItem.id, sBinIcon);
    let sRemoveContainer = fGenerateDiv("", "remove-container", sRemoveButton);

    //Image
    let sImage = fGenerateImg("item_img_" + oItem.id, oItem.img.src, oItem.img.alt);

    //Name
    let sName = fGenerateParagraph("item_name_" + oItem.id, oItem.premium ? "item-name-premium" : "item-name", oItem.premium ? oItem.name + " " + sPremiumMedal : oItem.name);

    //Quantity controls
    let sAddButton = fGenerateButton("item_add_button_" + oItem.id, sSumSign);
    let sQuantitySpan = fGenerateSpan("item_quantity_" + oItem.id, "", oItem.count);
    let sSubtractButton = fGenerateButton("item_subtract_button_" + oItem.id, sSubtractSign);
    let sQuantityControlsContainer = fGenerateDiv("", "quantity-controls", sSubtractButton + sQuantitySpan + sAddButton);

    //Item total price
    let sItemTotalPrice = fGenerateParagraph("item_total_price_" + oItem.id, "item-total-price", (oItem.price * oItem.count).toFixed(2) + " " + sEuroSign);

    //Item container
    return fGenerateDiv("item_container_" + oItem.id, "item-container", sRemoveContainer + sImage + sName + sQuantityControlsContainer + sItemTotalPrice);
}

let fGenerateFoot = (oShoppingCart) => {
    let nTotal = 0;
    let bNoPremiumItem = false;
    let sCheckbox = "";
    let sCheckboxDiv = "";
    let sSpanTotal = "";
    let sSpanTotalWithDiscount = "";
    let sSpanTotalDiscountMessage = "";
    let sSpanShippingCosts = "";
    let sAmountDiv = "";
    let sMessagesDiv = "";
    let sTotalDiv = "";

    for(oItem of oShoppingCart) {
        nTotal += oItem.price * oItem.count;
        bNoPremiumItem = bNoPremiumItem || !oItem.premium;
    }

    //Filter checkbox
    sCheckbox = fGenerateCheckbox("premium_item_checkbox", "premiumItemCheckbox", document.getElementById("premium_item_checkbox").checked, "Filtrar artículos premium");
    sCheckboxDiv = fGenerateDiv("", "filter", sCheckbox);

    //Amount container => Amount container + Messages container
    sSpanTotal = fGenerateSpan("", nTotal > 100 ? "total-strikethrough" : "total-purchase", nTotal.toFixed(2) + " " + sEuroSign);
    sSpanTotalWithDiscount = "";
    sSpanTotalDiscountMessage = "";
    if(nTotal > 100) {
        sSpanTotalWithDiscount = fGenerateSpan("", "total-discount", (nTotal - nTotal * (nDiscount / 100)).toFixed(2) + " " + sEuroSign);
        sSpanTotalDiscountMessage = fGenerateSpan("", "text-discount", "*" + nDiscount + "% descuento aplicado");
    }

    sSpanShippingCosts = fGenerateSpan("", (bNoPremiumItem || oShoppingCart.length == 0) ? "gastos-envio" : "gastos-envio-premium", 
        (bNoPremiumItem || oShoppingCart.length == 0) ? "(Este pedido tiene gastos de envio)" : "(Pedido sin gastos de envio)");
    sAmountDiv = fGenerateDiv("", "","Total: " + sSpanTotal + " " + sSpanTotalWithDiscount);
    sMessagesDiv = fGenerateDiv("", "", sSpanTotalDiscountMessage + " " + sSpanShippingCosts)
    sTotalDiv = fGenerateDiv("", "total", sAmountDiv + sMessagesDiv);

    return fGenerateDiv("", "foot", sCheckboxDiv + sTotalDiv);
}

let fGenerateShoppingCartStructure = (oShoppingCart) => {
    let sShoppingCartContent = "";

    for(oItem of oShoppingCart) sShoppingCartContent += fGenerateItemStructure(oItem);

    sShoppingCartContent += fGenerateFoot(oShoppingCart);

    return sShoppingCartContent;
}

let fGenerateEventListeners = (oShoppingCart) => {
    for(oItem of oShoppingCart) {
        document.getElementById("item_add_button_" + oItem.id).addEventListener("click", fAddItem);
        document.getElementById("item_subtract_button_" + oItem.id).addEventListener("click", fSubtractItem);
        document.getElementById("item_remove_button_" + oItem.id).addEventListener("click", fRemoveItem);
    }

    document.getElementById("premium_item_checkbox").addEventListener("change", fFilterPremiumItems);
}

let fDrawShoppingCart = () => {
    document.getElementById("shopping_cart_container").innerHTML = fGenerateShoppingCartStructure(oShoppingCart);

    fGenerateEventListeners(oShoppingCart);

    fFilterPremiumItems();
}

let fGetIdNumber = (sId) => {
    let sIdSplit = sId.split('_');
    
    sIdSplit = sIdSplit[sIdSplit.length - 1];

    return parseFloat(sIdSplit);   
}

let fAddItem = (event) => {
    let nId = fGetIdNumber(event.srcElement.id);

    for(oItem of oShoppingCart) if(oItem.id === nId) oItem.count ++;

    fDrawShoppingCart();
}

let fSubtractItem = (event) => {
    let nId = fGetIdNumber(event.srcElement.id);

    for(oItem of oShoppingCart) if(oItem.id === nId && oItem.count > 1) oItem.count --;

    fDrawShoppingCart();
}

let fRemoveItem = (event) => {
    let nId = fGetIdNumber(event.srcElement.id);
    let oItemToDelete;

    for(oItem of oShoppingCart) if(oItem.id === nId) oItemToDelete = oItem;

    if(window.confirm("¿Desea eliminar el artículo: " + oItemToDelete.name + "?")) {
        oShoppingCart.splice(oShoppingCart.indexOf(oItemToDelete),1);

        fDrawShoppingCart();
    }
}

let fFilterPremiumItems = () => {
    if(document.getElementById("premium_item_checkbox").checked) {
        for(oItem of oShoppingCart) if(!oItem.premium) document.getElementById("item_container_" + oItem.id).style.display = "none";
    }
    else {
        for(oItem of oShoppingCart) if(!oItem.premium) document.getElementById("item_container_" + oItem.id).style.display = "flex";
    }
}

window.onload=fDrawShoppingCart;