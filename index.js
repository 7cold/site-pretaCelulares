var db = firebase.firestore();
function numeroTotalVendas() {
    db.collection("ordens").get().then(snap => {
        size = snap.size // will return the collection size
        document.getElementById("totalVenda").innerHTML = `
                <h3> ${size}</h3>
            `;
    });
}
function numeroTotalUsuarios() {
    db.collection("usuarios").get().then(snap => {
        size = snap.size // will return the collection size
        document.getElementById("totalUsuarios").innerHTML = `
                <h3> ${size}</h3>
            `;
    });
}