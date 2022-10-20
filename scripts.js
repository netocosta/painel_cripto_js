$(function () {
    feather.replace();
});


if (localStorage.getItem('data') === null) {
    localStorage.setItem('data', "[]")
}

_load() // Carrega o script

function _load() {
    var spots = [ // simbolo da moeda
        { spot: 'brl', symbol: 'R$', },
        { spot: 'usd', symbol: '$', }
    ]
    var spot = document.getElementById("resposta").checked ? 'usd' : 'brl'
    var symbol_spot = spots.filter((item) => item.spot.includes(spot))[0].symbol
    
    // Limpa a tabela
    let tabela = document.getElementById("dados")
    tabela.innerHTML = ""

    // Carrega os dados do localStorage
    var data = JSON.parse(localStorage.getItem('data'))

    var valorSaldo = 0
    var saldo = document.getElementsByClassName('saldo')[0]
    const formatNumber = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const formatNumberCripto = new Intl.NumberFormat('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 })

    saldo.innerHTML = `${symbol_spot} ${formatNumber.format(valorSaldo)}`
    data.forEach(function (data, index) {
        consultar(data.api_id, spot).then(function (total) {
            const api = total[0]
            const wallet = api ? data.wallet : "{wallet}"
            const symbol = api ? api.symbol : "{abc}"
            const name = api ? api.name : "{name}"
            const image = api ? api.image : "{img}"
            const current_price = api ? api.current_price : "{price}"
            const price_change_percentage_24h = api ? api.price_change_percentage_24h : "{percent}"
            const my_balance = data.balance
            const variantcor = api.price_change_percentage_24h > 0 ? 'green' : 'red'

            var tabela = document.getElementById("dados")
            var anterior = tabela.innerHTML
            tabela.innerHTML = [
                anterior,
                `<tr class="data">`,
                ` <td class="column0">${wallet}</td>`,
                ` <td class="column1">`,
                `  <img src="${image}" width="28" height="28" />`,
                `  <div class="cripto"><span class="abv">${symbol}</span><span class="nome">${name}</span></div>`,
                ` </td>`,
                ` <td class="column3"><span class="price">${symbol_spot} ${formatNumber.format(current_price)}</span><span class="variant ${variantcor}">${formatNumber.format(price_change_percentage_24h)} %</span></td>`,
                ` <td class="column4"><span class="balance">${symbol_spot} ${formatNumber.format(current_price * my_balance)}</span><span class="cripto">${formatNumberCripto.format(my_balance)} ${symbol}</span></td>`,
                ` <td class="column5"><span class="button" onclick="remover(${index})">Del</span> <span class="button" onclick="editar(${index})">Change</span></td>`,
                `</tr>`,
            ].join("\n");
            valorSaldo = (current_price * my_balance) + valorSaldo
            saldo.innerHTML = `${symbol_spot} ${formatNumber.format(valorSaldo)}`
        })
    });
    
    async function consultar(moeda, cotacao_em) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?ids=${moeda}&vs_currency=${cotacao_em}`, {
                method: "GET"
            });
            const data = await response.json();
            return data

        } catch (err) {
            console.error(err)
        }
    }
}



function adicionar() {
    alert("Consulte em www.coingecko.com qual o API ID da moeda que deseja adicionar.")
    if (confirm("Deseja continuar?")) {
        wallet = prompt("Informe a carteira que está a moeda (Ex: MetaMask).")
        apiid = prompt("Informe a API ID (Ex: ethereum).")
        symbol = prompt("Informe o simbolo (Ex: ETH).")
        nameCoin = prompt("Informe o nome (Ex: Ethereum).")
        balance = prompt("Informe o seu saldo atual. (Ex: 0.12345678)")

        montar = { wallet: wallet, api_id: apiid, symbol: symbol, name: nameCoin, balance: balance }
        data = JSON.parse(localStorage.getItem('data'))
        data.push(montar)
        localStorage.setItem('data', JSON.stringify(data));
    }
    _load()
}

function remover(index) {
    data = JSON.parse(localStorage.getItem('data'))

    if (confirm(`Deseja remover ${data[index].name} do porfolio ?`)) {
        data.splice(index, 1)
        localStorage.setItem('data', JSON.stringify(data));
    }
    _load()
}

function editar(index) {
    data = JSON.parse(localStorage.getItem('data'))

    // Alterar o saldo
    if (confirm(`Deseja modificar o saldo de ${data[index].name} ?`)) {
        new_balance = prompt(`Informe o novo saldo para ${data[index].name}. (Ex: 0.12345678)`)
        montar = { wallet: data[index].wallet, api_id: data[index].api_id, symbol: data[index].symbol, name: data[index].name, balance: new_balance }
        data.splice(index, 1)
        data.push(montar)
        localStorage.setItem('data', JSON.stringify(data));
    }
    
    // Alterar a carteira
    if (confirm(`Deseja modificar a carteira onde está ${data[index].name} ?`)) {
        new_wallet = prompt(`Informe a nova carteira para ${data[index].name}. (Ex: Binance)`)
        montar = { wallet: new_wallet, api_id: data[index].api_id, symbol: data[index].symbol, name: data[index].name, balance: data[index].balance }
        data.splice(index, 1)
        data.push(montar)
        localStorage.setItem('data', JSON.stringify(data));
    }

    _load()
}
