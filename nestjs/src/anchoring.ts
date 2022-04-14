const Caver = require('caver-js')

const abi = [
    {
        inputs: [],
        name: 'retrieve',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'num',
                type: 'uint256'
            }
        ],
        name: 'store',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
]

function createCaver() {
    const endpoint = process.env['KLAYTN_ENDPOINT']

    const caver = new Caver(endpoint)

    return caver
}

function createContract(caver) {
    const contractAddr = process.env['DATAMARKET_CONTRACT']
    const contract = caver.contract.create(abi, contractAddr)

    return contract
}

async function writeHash() {
    const caver = createCaver()
    const contract = createContract(caver)

    const privateKey = process.env['DATAMARKET_PRIVATE_KEY']
    const key = caver.wallet.keyring.createFromPrivateKey(privateKey)
    caver.wallet.add(key)

    const receipt = await contract.send({ from: key.address, gas: 100000 }, 'store', '0x1234')

    console.log(receipt)
}

async function readHash() {
    const caver = createCaver()
    const contract = createContract(caver)

    const value = await contract.call('retrieve')

    console.log(value)
}

writeHash()

readHash()
