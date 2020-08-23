var db = firebase.firestore();

var imgIcon = "";
var icone = "";

function loadBanners() {
    db.collection("banners").onSnapshot(function (snapshot) {
        document.getElementById("loadBanners").innerHTML = "";
        snapshot.forEach(function (banners) {
            document.getElementById("loadBanners").innerHTML +=
                `
                    <tr>
                        <td><img src="${banners.data().imagem}" width="90" height="45"></img></td>
                        <td>${banners.data().ativo == true ? "<span class='badge badge-success'>Ativo</span>" : "<span class='badge badge-danger'>Desativado</span>"}</td>
                        <td><input type="checkbox" id="checkBanner" onchange="alterarBanner('${banners.id}' )" ${banners.data().ativo == true ? "checked" : ""}></td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="excluirBanner('${banners.id}')">Remover</button></td>
                        </tr >
                `
        });
    });
}

function excluirBanner(id) {
    var janela = confirm("Confirmar?");

    if (janela == true) {
        db.collection('banners').doc(id).delete().then(() => {
            console.log('ok' + id);
        });
        document.getElementById("loadBanners").innerHTML = '';
        loadBanners();

    } else {

    }



}

function alterarBanner(id) {
    var checkBox = document.getElementById("checkBanner");
    if (checkBox.checked == true) {
        var update = {
            ativo: true,
        }
        let db_update = db.collection("banners").doc(id);
        db_update.update(update).then(() => {
            alert("Alterado com sucesso");
        });
    } else {
        var update = {
            ativo: false,
        }
        let db_update = db.collection("banners").doc(id);
        db_update.update(update).then(() => {
            alert("Alterado com sucesso");
        });
    }


}

function uploadImg() {

    icone = document.getElementById("inputCadBImagem").files[0];
    var imageName = Date.now();
    var storageRef = firebase.storage().ref('banners/' + imageName);
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
            console.log(imgIcon);

            var img = document.createElement("IMG");
            img.setAttribute("src", downlaodURL);
            img.setAttribute("width", "80");
            img.setAttribute("height", "80");
            img.setAttribute("class", "m-3");
            document.getElementById("img_thumb").appendChild(img);
        });
    });
}

function salvarBanner() {

    var ativo = document.getElementById("inputCadBAtivo").value;
    console.log(imgIcon);

    db.collection("banners").doc().set({
        ativo: ativo == "true" ? true : false,
        imagem: imgIcon
    })
        .then(function () {
            alert("Cadastrado com sucesso");
            limparCampos();
            location.reload();
        })
        .catch(function (error) {
            console.error("error", error);
        });
}

function limparCampos() {
    imgIcon = "";
    icone = "";
}
