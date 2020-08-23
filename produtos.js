var db = firebase.firestore();

var paramArray = {};
var lista_tags = [];
var lista_tags_badge = [];
var lista_imagens = [];

function getUrlParametros() {
    var params = window.location.search.substring(1).split('&');

    for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        paramArray[param[0]] = param[1];
    }
    console.log(paramArray);
}

function irEditar(titulo, marca, precoNormal, precoPromocao, quantidade, id, categoria, setor) {
    location.href = 'produtos_editar.html?categoria=' + categoria + '&setor=' + setor;

    //limpar campos
    localStorage.setItem("titulo", "");
    localStorage.setItem("marca", "");
    localStorage.setItem("precoNormal", "");
    localStorage.setItem("precoPromocao", "");
    localStorage.setItem("quantidade", "");
    localStorage.setItem("id", "");


    //cadastrar campos
    localStorage.setItem("titulo", titulo);
    localStorage.setItem("marca", marca);
    localStorage.setItem("precoNormal", precoNormal);
    localStorage.setItem("precoPromocao", precoPromocao);
    localStorage.setItem("quantidade", quantidade);
    localStorage.setItem("id", id);

}

function loadProdutos() {
    getUrlParametros();
    document.getElementById("navCategoria").innerHTML = decodeURIComponent(paramArray['categoria'].toUpperCase());
    document.getElementById("navSetor").innerHTML = paramArray['setor'] == "produtos_informatica" ? "Informática" : "Celulares";

    db.collection(paramArray['setor']).doc(decodeURIComponent(paramArray['categoria'])).collection("itens").onSnapshot(function (snapshot) {
        document.getElementById("loadProdutos").innerHTML = "";
        snapshot.forEach(function (produto) {

            document.getElementById("loadProdutos").innerHTML +=
                `
                    <tr>
                        <td><img src="${produto.data().imagem}" width="30" height="30"></img></td>
                        <td>${produto.id}</td>
                        <td>${produto.data().titulo} - ${produto.data().marca}</td>
                        <td>${produto.data().preco_promocao.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                        <td><strike class="text-secondary">${produto.data().preco_normal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</strike></td>
                        <td>
                        <button type="button" class="btn btn-light btn-sm" onclick="diminuirProduto('${paramArray['setor']}','${decodeURIComponent(paramArray['categoria'])}','${produto.id}', '${produto.data().quantidade_e}')">-</button>
                        ${produto.data().quantidade_e}
                         <button type="button" class="btn btn-light btn-sm" onclick="aumentarProduto('${paramArray['setor']}','${decodeURIComponent(paramArray['categoria'])}','${produto.id}', '${produto.data().quantidade_e}')">+</button>
                        </td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="excluirProdutos('${produto.id}')">Excluir</button></td>
                        <td><button type="button" class="btn btn-primary btn-sm" onclick="irEditar('${produto.data().titulo}', '${produto.data().marca}', '${produto.data().preco_normal}', '${produto.data().preco_promocao}', '${produto.data().quantidade_e}', '${produto.id}', '${paramArray['categoria']}','${paramArray['setor']}' );">Editar</button></td>
                        <td class="text-center"><input type="checkbox" id="checkBanner" onchange="alterarProdutoAtivo('${produto.id}', '${paramArray['setor']}', '${paramArray['categoria']}')" ${produto.data().ativo == true ? "checked" : ""}></td>
                    </tr >
                `

        });
    });
}

function aumentarProduto(setor, categoria, id, quantidadeAntiga) {

    var productUpdate = {
        quantidade_e: parseFloat(quantidadeAntiga) + 1,
    }
    let db_update = db.collection(setor).doc(categoria).collection("itens").doc(id);
    db_update.update(productUpdate).then(() => {
        alert("Alterado com sucesso");
    });
}

function diminuirProduto(setor, categoria, id, quantidadeAntiga) {

    var productUpdate = {
        quantidade_e: parseFloat(quantidadeAntiga) - 1,
    }
    let db_update = db.collection(setor).doc(categoria).collection("itens").doc(id);
    db_update.update(productUpdate).then(() => {
        alert("Alterado com sucesso");
    });
}



function loadProdutosEditar() {

    document.getElementById("inputEditarPTitulo").value = localStorage.getItem("titulo");
    document.getElementById("inputEditarPMarca").value = localStorage.getItem("marca");
    document.getElementById("inputEditarPPrecoNormal").value = localStorage.getItem("precoNormal");
    document.getElementById("inputEditarPPrecoPromocao").value = localStorage.getItem("precoPromocao");
    document.getElementById("inputEditarPQuantidade").value = localStorage.getItem("quantidade");
    document.getElementById("id").value = localStorage.getItem("id");
}

function editarProdutos() {
    getUrlParametros();
    console.log(parseFloat(document.getElementById("inputEditarPPrecoNormal").value));

    var keyDivider = document.getElementById("inputEditarPTitulo").value.toUpperCase().split('', 1);
    var productUpdate = {
        titulo: document.getElementById("inputEditarPTitulo").value.toUpperCase(),
        marca: document.getElementById("inputEditarPMarca").value.toUpperCase(),
        preco_normal: parseFloat(document.getElementById("inputEditarPPrecoNormal").value),
        preco_promocao: parseFloat(document.getElementById("inputEditarPPrecoPromocao").value),
        quantidade_e: parseFloat(document.getElementById("inputEditarPQuantidade").value),
        key: keyDivider[0].toUpperCase(),
    }
    let db_update = db.collection(paramArray['setor']).doc(decodeURIComponent(paramArray['categoria'])).collection("itens").doc(document.getElementById("id").value);
    db_update.update(productUpdate).then(() => {
        alert("Alterado com sucesso");
        window.history.back();
    });
}

function cadProdutos() {

    var descricao = document.getElementById("inputCadPDescricao").value;
    var kg = document.getElementById("inputCadPPeso").value;
    var marca = document.getElementById("inputCadPMarca").value;
    var preco_normal = document.getElementById("inputCadPPrecoNormal").value;
    var preco_promocao = document.getElementById("inputCadPPrecoPromocao").value;
    var titulo = document.getElementById("inputCadPTitulo").value;
    var quantidade = document.getElementById("inputCadPQuantidade").value;

    var keyDivider = titulo.split('', 1);

    db.collection(paramArray['setor']).doc(decodeURIComponent(paramArray['categoria'])).collection("itens").doc().set({
        descricao: descricao,
        imagem: lista_imagens[0],
        key: keyDivider[0].toUpperCase(),
        kg: parseFloat(kg),
        lista_imagens: lista_imagens,
        marca: marca.toUpperCase(),
        preco_normal: parseFloat(preco_normal),
        preco_promocao: parseFloat(preco_promocao),
        setor: paramArray['setor'],
        tags: lista_tags,
        titulo: titulo.toUpperCase(),
        ativo: true,
        quantidade_e: parseFloat(quantidade)
    })
        .then(function () {

            alert("Cadastrado com sucesso");

            document.getElementById("inputCadPDescricao").value = "";
            document.getElementById("inputCadPPeso").value = "";
            document.getElementById("inputCadPMarca").value = "";
            document.getElementById("inputCadPPrecoNormal").value = "";
            document.getElementById("inputCadPPrecoPromocao").value = "";
            document.getElementById("inputCadPTitulo").value = "";
            document.getElementById("inputCadPQuantidade").value = "";
            lista_imagens.splice(0, 10);
            document.getElementById("img_thumb").innerHTML = ""
            lista_tags.splice(0, 10);
            lista_tags_badge.splice(0, 10);
            document.getElementById("tags_badge").innerHTML = ""



            // console.log(lista_imagens);
        })
        .catch(function (error) {
            // console.error("error", error);

        })
}

function excluirProdutos(id) {
    var janela = confirm("Confirmar?");

    if (janela == true) {
        db.collection(paramArray['setor']).doc(decodeURIComponent(paramArray['categoria'])).collection("itens").doc(id).delete().then(() => {
            console.log('ok' + id);
        });
        document.getElementById("loadProdutos").innerHTML = '';
        loadProdutos();
    } else {
    }
}

function uploadImg() {
    var image = document.getElementById("inputCadPImagem").files[0];
    var imageName = Date.now();
    var storageRef = firebase.storage().ref('produtos/' + imageName);
    var uploadTask = storageRef.put(image);

    var tamanhoImg = (image['size'] / 1024) / 1024;

    if (tamanhoImg < 1.5) {
        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("upload is " + progress + " done");
        }, function (error) {
            console.log(error.message);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downlaodURL) {

                lista_imagens.push(downlaodURL).value;

                var img = document.createElement("IMG");
                img.setAttribute("src", downlaodURL);
                img.setAttribute("width", "80");
                img.setAttribute("height", "80");
                img.setAttribute("class", "m-3");
                document.getElementById("img_thumb").appendChild(img);
            });
        });
    } else {
        alert("tamanho do arquivo maior que 1.5mb");
    }


}

function delImg() {
    lista_imagens.pop();
    var remover = document.getElementById("img_thumb");
    remover.removeChild(remover.lastChild);
}

function addTags() {
    lista_tags.push(document.getElementById("inputCadPTags").value);//add a lista
    lista_tags_badge.push(
        document.getElementById("tags_badge").innerHTML +=
        `
        <span class="badge badge-primary">`+ document.getElementById("inputCadPTags").value + `</span>
        `
    );//add a tela e a lista de badge
    document.getElementById("inputCadPTags").value = "";//limpa lista

}

function delTags() {
    lista_tags.pop();
    lista_tags_badge.pop();
    document.getElementById("tags_badge").innerHTML = lista_tags_badge;
}

function loadDestaques() {

    db.collection('destaques').onSnapshot(function (snapshot) {
        document.getElementById("loadDestaques").innerHTML = "";
        snapshot.forEach(function (destaques) {

            db.collection(destaques.data().setor).doc(destaques.data().categoria).collection("itens").doc(destaques.data().idProduto).onSnapshot(function (snapshot_) {
                document.getElementById("loadDestaques").innerHTML +=
                    `
                        <tr>
                            <td><img src="${snapshot_.data().imagem}" width="30" height="30"></img></td>
                            <td>${snapshot_.id}</td>
                            <td>${snapshot_.data().titulo}</td>
                            <td>${snapshot_.data().marca}</td>
                            <td><button type="button" class="btn btn-danger btn-sm" onclick="removerDestaque('${snapshot_.id}')">Remover</button></td>
                        </tr >
                    `
            });
        });
    });
}

function removerDestaque(id) {

    console.log(id);
    var janela = confirm("Confirmar?");

    if (janela == true) {
        db.collection('destaques').doc(id).delete().then(() => {
            console.log('ok' + id);
        });



    } else {

    }

}

function cadDestaques() {
    var idProduto = document.getElementById("inputCadDIdProduto").value;
    var setor = document.getElementById("inputCadDSetor").value;
    var categoria = document.getElementById("inputCadDCategoria").value;

    db.collection("destaques").doc(idProduto).set({
        idProduto: idProduto,
        setor: setor,
        categoria: decodeURIComponent(categoria)
    })
        .then(function () {
            alert("Cadastrado com sucesso");
            document.getElementById("inputCadDIdProduto").value = "";
            document.getElementById("inputCadDSetor").value = "";
            document.getElementById("inputCadDCategoria").value = "";
            // console.log(lista_imagens);
        })
        .catch(function (error) {
            // console.error("error", error);
        });

}

function limparCampos() {
    document.getElementById("inputCadDIdProduto").value = "";
}

var setor = "";
function setSetor() {
    setor = document.getElementById("inputCadDSetor").value;
}

function loadCategorias() {
    db.collection(setor).onSnapshot(function (snapshot) {
        document.getElementById("inputCadDCategoria").innerHTML = "";
        snapshot.forEach(function (categoria) {
            //console.log(produto.id);

            document.getElementById("inputCadDCategoria").innerHTML +=
                `<option value="${decodeURIComponent(categoria.id)}">${categoria.data().titulo}</option>`
        });
    });

}

function alterarProdutoAtivo(id, setor, categoria) {
    var checkBox = document.getElementById("checkBanner");
    if (checkBox.checked == true) {
        var update = {
            ativo: true,
        }
        let db_update = db.collection(setor).doc(decodeURIComponent(categoria)).collection("itens").doc(id);
        db_update.update(update).then(() => {
            alert("Alterado com sucesso");
        });
    } else {
        var update = {
            ativo: false,
        }
        let db_update = db.collection(setor).doc(decodeURIComponent(categoria)).collection("itens").doc(id);
        db_update.update(update).then(() => {
            alert("Alterado com sucesso");
        });
    }


}