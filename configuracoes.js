var db = firebase.firestore();

function loadConfiguracoes() {
    db.collection("configuracoes").doc("entrega")
        .get()
        .then(function (configuracoes) {
            document.getElementById("inputEditarConfLat").value = configuracoes.data().lat;
            document.getElementById("inputEditarConfLong").value = configuracoes.data().long;
            document.getElementById("inputEditarConfPrecoBase").value = configuracoes.data().preco_base;
            document.getElementById("inputEditarConfPrecoKm").value = configuracoes.data().preco_km;
            document.getElementById("inputEditarConfFreteGratisRS").value = configuracoes.data().frete_gratis;
            document.getElementById("inputEditarConfFreteGratisKM").value = configuracoes.data().frete_gratis_km;
        });
}
function loadConfiguracoes2() {
    db.collection("configuracoes").doc("email")
        .get()
        .then(function (configuracoes) {
            document.getElementById("inputEditarConfEmail").value = configuracoes.data().email;
            document.getElementById("inputEditarConfSenha").value = configuracoes.data().senha;

        });
}

function editarEndereco() {
    var update = {
        lat: parseFloat(document.getElementById("inputEditarConfLat").value),
        long: parseFloat(document.getElementById("inputEditarConfLong").value),
    }
    let db_update = db.collection("configuracoes").doc("entrega");
    db_update.update(update).then(() => {
        alert("Alterado com sucesso");
        location.reload();
    });
}

function editarEmail() {
    var update = {
        email: document.getElementById("inputEditarConfEmail").value,
        senha: document.getElementById("inputEditarConfSenha").value,
    }
    let db_update = db.collection("configuracoes").doc("email");
    db_update.update(update).then(() => {
        alert("Alterado com sucesso");
        location.reload();
    });
}


function editarEntrega() {
    var update = {
        preco_base: parseFloat(document.getElementById("inputEditarConfPrecoBase").value),
        preco_km: parseFloat(document.getElementById("inputEditarConfPrecoKm").value),
        frete_gratis: parseFloat(document.getElementById("inputEditarConfFreteGratisRS").value),
        frete_gratis_km: parseFloat(document.getElementById("inputEditarConfFreteGratisKM").value),
    }
    let db_update = db.collection("configuracoes").doc("entrega");
    db_update.update(update).then(() => {
        alert("Alterado com sucesso");
        location.reload();
    });
}

function loadCupom() {

    db.collection('cupons').onSnapshot(function (snapshot) {
        document.getElementById("listaCupom").innerHTML = "";
        snapshot.forEach(function (cupom) {

            document.getElementById("listaCupom").innerHTML +=
                `
                <tr>
                <td>${cupom.id}</td>
                <td>${cupom.data().porcentagem}</td>
                <td><button type="button" class="btn btn-danger btn-sm" onclick="excluirCupon('${cupom.id}')">Remover</button></td>
                </tr>
                `

        });
    });
}

function excluirCupon(id) {
    var janela = confirm();

    if (janela == true) {
        db.collection('cupons').doc(id).delete().then(() => {
            console.log('ok' + id);
        });
        document.getElementById("listaCupom").innerHTML = '';
        loadCupom();
    } else {

    }

}

function alterarCupon(id) {
    var checkBox = document.getElementById("checkBanner");
    if (checkBox.checked == true) {
        var update = {
            ativo: true,
        }
        let db_update = db.collection("cupons").doc(id);
        db_update.update(update).then(() => {
            alert("Alterado com sucesso");
        });
    } else {
        var update = {
            ativo: false,
        }
        let db_update = db.collection("cupons").doc(id);
        db_update.update(update).then(() => {
            alert("Alterado com sucesso");
        });
    }


}

function salvarCupon() {

    var cupon = document.getElementById("inputCadCCupon").value;
    var porcentagem = document.getElementById("inputCadCPorcentagem").value;

    db.collection("cupons").doc(cupon).set({
        porcentagem: parseFloat(porcentagem),
        ativo: true
    })
        .then(function () {
            alert("Cadastrado com sucesso");
            location.reload();
            document.getElementById("inputCadCCupon").value = ""
            document.getElementById("inputCadCPorcentagem").value = ""
        })
        .catch(function (error) {
            console.error("error", error);
        });
}
