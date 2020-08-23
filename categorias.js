var db = firebase.firestore();

var paramArray = {};
var imgIcon = "";
var icone = "";
var setor = "produtos_informatica";

function getUrlParametros() {
    var params = window.location.search.substring(1).split('&');

    for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        paramArray[param[0]] = param[1];
    }
    console.log(paramArray);
}

function irTodos(categoria, setor) {
    location.href = 'produtos_todos.html?categoria=' + categoria + '&setor=' + setor;

    //limpar campos
    localStorage.setItem("categoria", "");
    localStorage.setItem("setor", "");

    //cadastrar campos
    localStorage.setItem("categoria", categoria);
    localStorage.setItem("setor", setor);

}


function loadInformatica() {

    db.collection("produtos_informatica").onSnapshot(function (snapshot) {
        document.getElementById("loadCategoriasInformatica").innerHTML = "";
        snapshot.forEach(function (categoria) {

            document.getElementById("loadCategoriasInformatica").innerHTML +=
                `
               
                <tr >
                        <td class="text-left"><img src="${categoria.data().icone}" width="30" height="30"></img></td>
                        <td>${categoria.data().titulo}</td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="excluirCategoria('produtos_informatica','${categoria.id}')">Excluir</button></td>
                        <td><button type="button" class="btn btn-primary btn-sm" onclick="location.href='produtos_todos.html?categoria=${categoria.id}&setor=produtos_informatica'">Ver</button></td>
                </tr>
                    
                `
        });
    });
}

function loadCelulares() {

    db.collection("produtos_celulares").onSnapshot(function (snapshot) {
        document.getElementById("loadCategoriasCelulares").innerHTML = "";
        snapshot.forEach(function (categoria) {

            document.getElementById("loadCategoriasCelulares").innerHTML +=
                `
               
                <tr >
                        <td class="text-left"><img src="${categoria.data().icone}" width="30" height="30"></img></td>
                        <td>${categoria.data().titulo}</td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="excluirCategoria('produtos_celulares','${categoria.id}')">Excluir</button></td>
                        <td><button type="button" class="btn btn-primary btn-sm" onclick="irTodos('${categoria.id}','produtos_celulares')">Ver</button></td>
                </tr>
                    
                `
        });
    });
}

function salvarCategoria() {

    var titulo = document.getElementById("inputCatTitulo").value;
    var tituloLow = titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    db.collection(setor).doc(tituloLow.toLowerCase()).set({
        titulo: titulo,
        icone: imgIcon
    })
        .then(function () {
            document.getElementById("inputCatTitulo").value = "";
            alert("Cadastrado com sucesso");
        })
        .catch(function (error) {
            console.error("error", error);
        })
}

function uploadIcon() {

    icone = document.getElementById("inputCatIcon").files[0];
    var imageName = Date.now();
    var storageRef = firebase.storage().ref('icones/' + imageName);
    var uploadTask = storageRef.put(icone);

    uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + " done");
    }, function (error) {
        console.log(error.message);
    }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downlaodURL) {
            imgIcon = downlaodURL;
            console.log(icone);
        });
    });
}

function excluirCategoria(setor, id) {
    var janela = confirm("Confirmar?");

    if (janela == true) {
        db.collection(setor).doc(id).delete().then(() => {
            console.log('ok' + id);
        });

        document.getElementById("loadCategorias").innerHTML = '';
        loadCategorias(setor);

    } else {

    }

}

function limparCampos() {
    imgIcon = "";
    icone = "";
    document.getElementById("inputCatTitulo").value = "";
}

function setSetor() {
    setor = document.getElementById("inputSetor").value;
}

