function mascaraCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ''); // Remove tudo que não é dígito
    cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2"); // Coloca ponto após os dois primeiros dígitos
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); // Coloca ponto após o quinto dígito
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2"); // Coloca uma barra após o oitavo dígito
    cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2"); // Coloca um hífen após o décimo segundo dígito
    return cnpj;
}

function mascaraTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ''); // Remove tudo que não é dígito
    telefone = telefone.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses em torno dos dois primeiros dígitos
    telefone = telefone.replace(/(\d)(\d{4})$/, "$1-$2"); // Coloca um hífen entre o quinto e sexto dígitos
    return telefone;
}

function mascaraCEP(cep) {
    cep = cep.replace(/\D/g, ''); // Remove tudo que não é dígito
    cep = cep.replace(/^(\d{5})(\d)/, "$1-$2"); // Coloca um hífen entre o quinto e sexto dígitos
    return cep;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function mostrarSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function esconderSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

function consultarCNPJ() {
    const cnpjInput = document.getElementById('cnpjInput').value.replace(/\D/g, '');
    const resultDiv = document.getElementById('result');

    if (cnpjInput.length !== 14) {
        resultDiv.innerHTML = '<p>CNPJ inválido. Certifique-se de que possui 14 dígitos.</p>';
        return;
    }

    mostrarSpinner();

    fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjInput}`)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                resultDiv.innerHTML = '<p>CNPJ não encontrado.</p>';
            } else {
                const nomeFantasia = data.nome_fantasia || 'N/A';
                const razaoSocial = data.razao_social || 'N/A';
                const dataAbertura = data.data_inicio_atividade;
                const situacao = data.descricao_situacao_cadastral || 'N/A';
                const atividade_principal = data.cnae_fiscal_descricao || 'N/A';
                const uf = data.uf || 'N/A';
                const logradouro = data.logradouro || 'N/A';
                const numero = data.numero || 'N/A';
                const bairro = data.bairro || 'N/A';
                const municipio = data.municipio || 'N/A';
                const cep = mascaraCEP(data.cep) || 'N/A';
                const telefone = mascaraTelefone(data.ddd_telefone_1) || 'N/A';
                const email = data.email || 'N/A';

                resultDiv.innerHTML = `
                    <div class="input-group">
                        <label for="razaoSocial">Nome:</label>
                        <input type="text" id="razaoSocial" value="${razaoSocial}">
                    </div>
                    <div class="input-group">
                        <label for="nomeFantasia">Razão Social:</label>
                        <input type="text" id="nomeFantasia" value="${nomeFantasia}">
                    </div>
                    <div class="input-group">
                        <label for="dataAbertura">Data de Abertura:</label>
                        <input type="date" id="dataAbertura" value="${dataAbertura}">
                    </div>
                    <div class="input-group">
                        <label for="situacao">Situacao:</label>
                        <input type="text" id="situacao" value="${situacao}">
                    </div>
                    <div class="input-group">
                        <label for="atividade_principal">Atividade Principal:</label>
                        <input type="text" id="atividade_principal" value="${atividade_principal}">
                    </div>
                    <div class="input-group">
                        <label for="uf">UF:</label>
                        <input type="text" id="uf" value="${uf}" maxlength="2">
                    </div>
                    <div class="input-group">
                        <label for="logradouro">Endereço:</label>
                        <input type="text" id="logradouro" value="${logradouro}">
                    </div>
                    <div class="input-group">
                        <label for="numero">Número:</label>
                        <input type="text" id="numero" value="${numero}">
                    </div>
                    <div class="input-group">
                        <label for="bairro">Bairro:</label>
                        <input type="text" id="bairro" value="${bairro}">
                    </div>
                    <div class="input-group">
                        <label for="municipio">Municipio:</label>
                        <input type="text" id="municipio" value="${municipio}">
                    </div>
                    <div class="input-group">
                        <label for="cep">CEP:</label>
                        <input type="text" id="cep" value="${cep}" maxlength="9" oninput="this.value = mascaraCEP(this.value)">
                    </div>
                    <div class="input-group">
                        <label for="telefone">Telefone:</label>
                        <input type="text" id="telefone" value="${telefone}" maxlength="11" oninput="this.value = mascaraTelefone(this.value)">
                    </div>
                    <div class="input-group">
                        <label for="email">E-mail:</label>
                        <input type="email" id="email" value="${email}" oninput="if (!validarEmail(this.value)) this.setCustomValidity('Email inválido')">
                    </div>
                    <div class="input-group">
                        <button onclick="submeterFormulario()">Submeter</button>
                    </div>
                `;
            }
            
            esconderSpinner();
        })
        .catch(error => {
            esconderSpinner();
            resultDiv.innerHTML = '<p>Erro ao consultar o CNPJ.</p>';
            console.error('Erro:', error);
        });
}

function aplicarMascaraCNPJ(event) {
    const input = event.target;
    input.value = mascaraCNPJ(input.value);
}

function abrirModal() {
    document.getElementById('modal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

function submeterFormulario() {
    const razaoSocial = document.getElementById('razaoSocial').value;
    const nomeFantasia = document.getElementById('nomeFantasia').value;
    const dataAbertura = document.getElementById('dataAbertura').value;
    const uf = document.getElementById('uf').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const municipio = document.getElementById('municipio').value;
    const cep = document.getElementById('cep').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const situacao = document.getElementById('situacao').value;
    const atividade_principal = document.getElementById('atividade_principal').value;

    const textoExibirDados = `Dados submetidos:</br>Nome: ${nomeFantasia}</br>Razão social: ${razaoSocial}</br>Data de Abertura: ${dataAbertura}</br>Situação: ${situacao}</br>Atividade principal: ${atividade_principal}</br>Telefone: ${telefone}</br>Email: ${email}</br>Endereço completo: ${logradouro}, ${numero} - ${bairro}, ${municipio} - ${uf}, ${cep}`


    document.getElementById('modal-content').innerHTML = `
                <span class="close" onclick="fecharModal()">&times;</span>
                <h4>Dados submetidos com sucesso!</h4>
                <p>${textoExibirDados}</p>
            `;

            abrirModal();
}