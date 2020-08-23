var db = firebase.firestore();


var paramArray = {};

function getUrlParametros() {
    var params = window.location.search.substring(1).split('&');

    for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        paramArray[param[0]] = param[1];
    }
    // console.log(paramArray);
}

function loadUsuarios(valor, orderBy, desc) {
    db.collection("usuarios").orderBy(orderBy, desc).limit(valor).onSnapshot(function (snapshot) {
        document.getElementById("loadUsuarios").innerHTML = "";
        snapshot.forEach(function (clientes) {
            document.getElementById("loadUsuarios").innerHTML +=
                `
                <tr onclick="location.href = 'usuarios_detalhes.html?clienteId=${clientes.id}'">
                <td>${clientes.id}</td>
                <td>${clientes.data().nome}</td>
                <td>${clientes.data().cpf}</td>
                <td>${clientes.data().celular}</td>           
                </tr>
        `
        });
    });

}

function loadUsuariosDetalhes() {
    getUrlParametros();
    db.collection("usuarios").doc(paramArray['clienteId'])
        .get()
        .then(function (clientes) {
            document.getElementById("dadosCliente").innerHTML = "";
            if (clientes.exists) {
                var dateFormat = clientes.data().data_cadastro;
                var myDate = new Date(dateFormat.seconds * 1000);
                const options = { weekday: 'short', year: '2-digit', month: '2-digit', day: 'numeric', };
                var dataformatadaPT = myDate.toLocaleDateString('pt-BR', options);
                var horaformatadaPT = myDate.toLocaleTimeString('pt-BR');

                document.getElementById("dadosCliente").innerHTML +=
                    `
                <div class="card mb-3">
                                <div class="card-body">
                                <img src="${clientes.data().imagem}" alt="..." class="img-thumbnail col-md-1 col-sm-2">
                                    <h5 class="card-title mt-3">${clientes.data().nome}</h5>
                                    Cliente ID: <b>${clientes.id}</b><br/>
                                    CPF: <b>${clientes.data().cpf}</b><br/>
                                    Email: <b>${clientes.data().email}</b><br/>
                                    Celular: <b>${clientes.data().celular}</b><br/>
                                    <div class="dropdown-divider"></div>
                                    Endereço: <b>${clientes.data().endereco} ,${clientes.data().endereco_num}</b><br/>
                                    Bairro: <b>${clientes.data().endereco_bairro}</b><br/>
                                   Cidade: <b>${clientes.data().endereco_cidade} -  ${clientes.data().cep}</b><br/>
                                   <div class="dropdown-divider"></div>
                                   Cadastro em: <b>${dataformatadaPT} | ${horaformatadaPT}</b><br/>
      
                                </div>
                        </div>
                </div>

        `
            } else {

                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}

function loadOrdens() {
    db.collection("usuarios").doc(paramArray['clienteId']).collection("ordens").onSnapshot(function (snapshot) {
        document.getElementById("pedidos").innerHTML = "";
        snapshot.forEach(function (orders) {

            var dateFormat = orders.data().data;
            var myDate = new Date(dateFormat.seconds * 1000);

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', };

            var dataformatadaPT = myDate.toLocaleDateString('pt-BR', options);
            var horaformatadaPT = myDate.toLocaleTimeString('pt-BR');

            document.getElementById("pedidos").innerHTML +=
                `
                <tr onclick="location.href = 'ordem.html?ordemId=${orders.id}'">
                    <td>${orders.id}</td>
                    <td>${dataformatadaPT} | ${horaformatadaPT}</td>
                </tr>
        `
        });
    });
}

function loadMensagens() {
    db.collection("usuarios").doc(paramArray['clienteId']).collection("mensagens").onSnapshot(function (snapshot) {
        document.getElementById("mensagens").innerHTML = "";
        snapshot.forEach(function (mensagens) {

            var dateFormat = mensagens.data().data;
            var myDate = new Date(dateFormat.seconds * 1000);

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', };

            var dataformatadaPT = myDate.toLocaleDateString('pt-BR', options);
            var horaformatadaPT = myDate.toLocaleTimeString('pt-BR');

            document.getElementById("mensagens").innerHTML +=
                `
                <tr>
                    <td>${mensagens.data().titulo}</td>
                    <td>${mensagens.data().descricao.substring(0, 100) + "..."}</td>
                    
                    <td>${dataformatadaPT}</td>
                </tr>
        `
        });
    });
}


function enviarMensagem() {
    const date = new Date()
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date)

    console.log(`${month} ${day}, ${year}`)


    var titulo = document.getElementById("inputCadUTitulo").value;
    var descricao = document.getElementById("inputCadUDescricao").value;



    db.collection("usuarios").doc(paramArray['clienteId']).collection("mensagens").doc().set({
        titulo: titulo,
        descricao: descricao,

        data: firebase.firestore.Timestamp.fromDate(new Date(`${month} ${day}, ${year}`)),
    })
        .then(function () {
            alert("Cadastrado com sucesso");
            location.reload();
        })
        .catch(function (error) {
            console.error("error", error);
        });

}




