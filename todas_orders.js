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

function irOrdemDetalhe(ordemId) {
    location.href = 'ordem.html?ordemId=' + ordemId;
}

function loadAllOrdens(limit) {
    db.collection("ordens")
        .orderBy("data", "desc").limit(limit).onSnapshot(function (snapshot) {

            document.getElementById("todasOrdens").innerHTML = "";
            snapshot.forEach(function (ordens) {

                var dateFormat = ordens.data().data;
                var myDate = new Date(dateFormat.seconds * 1000);
                const options = { weekday: 'short', year: '2-digit', month: '2-digit', day: 'numeric', };
                var dataformatadaPT = myDate.toLocaleDateString('pt-BR', options);
                var horaformatadaPT = myDate.toLocaleTimeString('pt-BR');

                document.getElementById("todasOrdens").innerHTML +=
                    `<tr onclick="irOrdemDetalhe('${ordens.id}')">
                    <td>${ordens.data().entrega == "irei_buscar" ? "🏢" : ordens.data().entrega == "entregar" ? "🚚" : ""}</td>
                    <td>${ordens.id}</td>
                    <td>${dataformatadaPT} | ${horaformatadaPT}</td>
                    <td>${ordens.data().usuario_nome}</td>    
                    <td>${ordens.data().payInfo.result == "canceled" ? "<span class='badge badge-light'>Aguardando Pagamento</span>" : ordens.data().payInfo.id == "00000" ? "<span class='badge badge-light'>Aguardando Pagamento</span>" : ordens.data().payInfo.id == "null" ? "<span class='badge badge-light'>Aguardando Pagamento</span>" : "<span class='badge badge-success'>Realizado</span>"}</label > </td>
                    <td>${ordens.data().status == 0 ? "<span class='badge badge-danger'>Cancelado</span>" : ordens.data().status == 1 ? "<span class='badge badge-warning'>Preparando</span>" : ordens.data().status == 2 ? "<span class='badge badge-info'>Transporte</span>" : ordens.data().status == 3 ? "<span class='badge badge-info'>Transporte Concluído</span>" : "<span class='badge badge-success'>Entregue</span>"}</label > </td>
                   </tr>                
                `
            });

        });

}

function loadOrdensUsuario() {
    getUrlParametros();

    db.collection("ordens").doc(paramArray['ordemId'])
        .get()
        .then(function (order) {
            document.getElementById("dadosCliente").innerHTML = "";
            if (order.exists) {
                var dateFormat = order.data().data;
                var myDate = new Date(dateFormat.seconds * 1000);

                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', };

                var dataformatadaPT = myDate.toLocaleDateString('pt-BR', options);
                var horaformatadaPT = myDate.toLocaleTimeString('pt-BR');

                var tipo_entrega;
                order.data().entrega == "irei_buscar" ? tipo_entrega = "Retirar na Loja 🏢" : tipo_entrega = "Entregar em casa 🚚";

                var products = order.data().produtos;
                var status = order.data().status;

                products.forEach(valorAtual => {
                    document.getElementById("listaProdutos").innerHTML +=
                        `
                        <tr>
                            <td>${valorAtual.pid}</td>
                            <td>${valorAtual.produto.titulo}</td>
                            <td>${valorAtual.produto.marca}</td>                      
                            <td>${valorAtual.quantidade}</td>
                            <td class="text-right">${valorAtual.produto.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                        `
                    document.getElementById("listaProdutosResumo").innerHTML +=
                        `
                        <tr>
                            <td>${valorAtual.pid}</td>
                            <td>${valorAtual.produto.titulo}</td>
                            <td>${valorAtual.produto.marca}</td>                      
                            <td>${valorAtual.quantidade}</td>
                            <td class="text-right">${valorAtual.produto.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                        `;
                });

                document.getElementById("totalListaProdutos").innerHTML +=
                    `
                                <th class="table-active">TOTAL</th>
                                <th colspan="7" class="text-right table-active">${order.data().preco_total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</th>
                    `
                document.getElementById("resumoDados1").innerHTML +=

                    `
                    <h5>Dados do Cliente</h5>
                    <h5>${order.data().usuario_nome}</h5>
                    Venda ID: <b>${order.id}</b><br/>
                    Data: <b>${dataformatadaPT} | ${horaformatadaPT}</b><br/>
                    Tipo de entrega: <b>${tipo_entrega}</b>
                    <div class="dropdown-divider mt-4"></div>
                    <h5>Valores</h5>
                    Entrega: <b>${order.data().preco_entrega.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b><br/>
                    Desconto: <b>${order.data().desconto.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b><br/>
                    Total: <b>${order.data().preco_total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</b><br/>
                    <div class="dropdown-divider mt-4"></div>
                    `;

                db.collection("usuarios").doc(order.data().usuarioId)
                    .get()
                    .then(function (clienteResumo) {

                        order.data().entrega == "irei_buscar" ? document.getElementById("resumoDados2").innerHTML = "" :
                            document.getElementById("resumoDados2").innerHTML +=

                            `
                    <h5>Dados da Entrega</h5>
                    CPF Cliente: <b>${clienteResumo.data().cpf}</b><br/>
                    Endereço: <b>${clienteResumo.data().endereco}, ${clienteResumo.data().endereco_num}</b><br/>
                    Bairro: <b>${clienteResumo.data().endereco_bairro}</b><br/>
                    Cidade: <b>${clienteResumo.data().endereco_cidade}</b><br/>
                    CEP: <b>${clienteResumo.data().cep}</b><br/>
                    CEP: <b>${clienteResumo.data().cpf}</b><br/>
                    <div class="dropdown-divider mt-4"></div>
                    

                    `;

                    });







                var requestURL = 'https://api.mercadopago.com/v1/payments/' + order.data().payInfo.id + '?access_token=APP_USR-182247360055120-070317-0220c139f0f957d71c368b902a4ca441-602690240#json';
                var request = new XMLHttpRequest();
                request.open('GET', requestURL);
                request.responseType = 'json';
                request.send();
                request.onload = function () {
                    var resultadoApi = request.response;



                    document.getElementById("payType").innerHTML = resultadoApi.payment_type_id;
                    document.getElementById("payMethod").innerHTML = resultadoApi.payment_method_id;

                    resultadoApi.payment_type_id == null ?
                        document.getElementById("payType").innerHTML = `<span class="badge badge-light">Não Encontrado</span>` : resultadoApi.payment_type_id;

                    resultadoApi.payment_method_id == null ?
                        document.getElementById("payMethod").innerHTML = `<span class="badge badge-light">Não Encontrado</span>` : resultadoApi.payment_method_id;




                    console.log(resultadoApi.payment_type_id);

                    //status
                    resultadoApi.status == "refunded" ?
                        document.getElementById("statusMP").innerHTML = `<span class="badge badge-danger">Devolvido</span>` :
                        resultadoApi.status == "rejected" ?
                            document.getElementById("statusMP").innerHTML = `<span class="badge badge-danger">Rejeitado</span>` :
                            resultadoApi.status == "cancelled" ?
                                document.getElementById("statusMP").innerHTML = `<span class="badge badge-danger">Cancelado</span>` :
                                resultadoApi.status == "pending" ?
                                    document.getElementById("statusMP").innerHTML = `<span class="badge badge-warning">Pendente</span>` :
                                    resultadoApi.status == "in_process" ?
                                        document.getElementById("statusMP").innerHTML = `<span class="badge badge-warning">Em Processo</span>` :
                                        resultadoApi.status == "authorized" ?
                                            document.getElementById("statusMP").innerHTML = `<span class="badge badge-info">Autorizado</span>` :
                                            resultadoApi.status == "approved" ?
                                                document.getElementById("statusMP").innerHTML = `<span class="badge badge-success">Aprovado</span>` :
                                                resultadoApi.status == "partially_refunded" ?
                                                    document.getElementById("statusMP").innerHTML = `<span class="badge badge-danger">Parcialmente Devolvido</span>` :
                                                    resultadoApi.status == "charged_back" ?
                                                        document.getElementById("statusMP").innerHTML = `<span class="badge badge-danger">Devolvido ao Cartao</span>` :
                                                        resultadoApi.status == "vacated" ?
                                                            document.getElementById("statusMP").innerHTML = `<span class="badge badge-danger">ERRO INTERNO</span>` :
                                                            resultadoApi.message == "Payment not found" ?
                                                                document.getElementById("statusMP").innerHTML = `<span class="badge badge-light">Não Pago</span>` :
                                                                resultadoApi.message == "Not Found" ?
                                                                    document.getElementById("statusMP").innerHTML = `<span class="badge badge-light">Não Encontrado</span>` : ""

                }




                document.getElementById("dadosCliente").innerHTML +=
                    `
                <div class="card mb-3">
                            <div class="card-body">
                            <h5>${order.data().usuario_nome}</h5>
                            Venda ID: <b>${order.id}</b><br/>
                            Data: <b>${dataformatadaPT} | ${horaformatadaPT}</b><br/>
                            Tipo de entrega: <b>${tipo_entrega}</b>

                            <table class="table table-bordered mt-3 text-center table-sm">
                                <thead>
                                    <tr>
                                    <th scope="col">Entrega</th>
                                    <th scope="col">Produtos</th>
                                    <th scope="col">Desconto</th>
                                    <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>${order.data().preco_entrega.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</th>
                                    <td>${order.data().produtos_preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <td>${order.data().desconto.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                    <th>${order.data().preco_total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</th>
                                    </tr>
                                </tbody>
                                </table>

                                <div class="row mt-3">
                                    <div class="col-md-6 mt-3">
                                    <div class="card">
                                    <div class="card-body">
                                        <h5>Status da Entrega<h5><p/></h5>

                                        <div class="mt-3 alert alert-${status == 1 ? "warning" : status == 2 ? "primary" : status == 3 ? "info" : status == 0 ? "danger" : "success"}" role="alert">
                                ${status == 1 ? "Preparando os produtos" : status == 2 ? "Transporte" : status == 3 ? "Trasporte Concluído" : status == 0 ? "Cancelado" : "Entregue"}
                                </div>
                                <div class="dropdown-divider"></div>
                                <label for="" class="col-form-label">Alterar Status de Envio:</label>
                                <select class="form-control" id="status" onchange="updateStatus(value, '${order.id}')">
                                    <option selectd>Selecione...</option>
                                    <option value="0">Cancelado</option>
                                    <option value="1">Preparando</option>
                                    <option value="2">Transporte</option>
                                    <option value="3">Transporte Concluído</option>
                                    <option value="4">Entregue</option>
                                </select>
                                    </div>
                                    </div>
                                    </div>

                                
                                    <div class="col-md-6 mt-3">
                                    <div class="card">
                                    <div class="card-body">
                                    <h5>Status do Pagamento </h5>
                                                                 
                                    <label for="" class="col-form-label">Id Pagamento: ${order.data().payInfo.id == "null" ? "<span class='badge badge-danger'>Não Pago</span>" : order.data().payInfo.id == "00000" ? "<span class='badge badge-danger'>Não Pago</span>" : order.data().payInfo.id}</label> 
                                    
                                    <a href="https://api.mercadopago.com/v1/payments/${order.data().payInfo.id}?access_token=APP_USR-182247360055120-070317-0220c139f0f957d71c368b902a4ca441-602690240" class="badge badge-light">Link MercadoPago</a>
                                    <br/>
                                    <label for="" class="col-form-label">Status MP: <span id="statusMP"></span></label> 
                                    <br/>
                                    <label for="" class="col-form-label">Info: <span id="payType"></span> | <span id="payMethod"></span></label > 
                                    <p/>
                                   
                                    </div>
                                  </div>
                                    </div>
                                </div>


                               
                            </div >
                        </div >
                </div >
                    `
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
}

function updateStatus(status, id) {

    var statusUpdate = {
        status: parseInt(status),
    }

    let db_update = db.collection("ordens").doc(id);
    db_update.update(statusUpdate).then(() => {
        location.reload();
    });

}

