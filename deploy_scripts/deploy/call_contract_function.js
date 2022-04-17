import nearAPI from "near-api-js";
import loginNear from "./_login.js";

import buildContractObject from "./_contract_object.js";
import { BN } from "bn.js";

async function initializeContract(ownerAccount, contractAccount, mint_cost) {
    const contract = await buildContractObject(ownerAccount, contractAccount);

    let namedArgs = {
        owner_id: ownerAccount,
        metadata: {
            spec: "nft-2.0.0",
            name: "Tokonami",
            symbol: "TOKO",
            icon: Some(DATA_IMAGE_SVG_NEAR_ICON.to_string()),
            base_uri: "https://gateway.ipfs.io/",
            reference: null,
            reference_hash: null
        },
        mint_cost: nearAPI.utils.format.parseNearAmount(mint_cost)

    };

    const result = await contract.new(
        namedArgs,
        "300000000000000"
    );

    console.log(result);
    return result;
}

//batch mint nfts
async function mintNfts(ownerAccount, contractAccount, token_quantity, mint_cost) {
    const contract = await buildContractObject(ownerAccount, contractAccount);

    const token_price = nearAPI.utils.format.parseNearAmount(mint_cost);
    let bnTokenPrice = new BN(token_price);
    let bnTokenQuantity = new BN(token_quantity);
    let bnAdjustment = new BN("1.1");
    let totalTokenPrice = bnTokenPrice.mul(bnTokenQuantity).mul(bnAdjustment);


    const result = await contract.nft_mint({
            quantity: token_quantity.toString()
        },
        "300000000000000",
        totalTokenPrice.toString(10)
    );

    console.log(result);
    return result;
}

//get_contract_state
async function addToWhiteList(ownerAccount, contractAccount, listBeneficiaries, allowance) {
    const contract = await buildContractObject(ownerAccount, contractAccount);

    let whiteListMap = {};

    for (let item of listBeneficiaries) {
        whiteListMap[item] = allowance
    }


    const result = await contract.add_to_whitelist({
            whitelist_map: whiteListMap
        },
        "300000000000000",
        "1"
    );

    console.log(result);
    return result;
}

//add metadata to contract
async function addMetadata(ownerAccount, contractAccount) {
    const contract = await buildContractObject(ownerAccount, contractAccount);

    let metaDataMap = {};
    let totalCount = 2331;
    let counter = 1;

    while (counter <= totalCount) {
        whiteListMap[counter.toString()] = fs.readFileSync(`../../json_generation/chain_json/${counter}.json`);
        counter += 1;
    }

    const chunkSize = 100;
    let currentStart = 1;
    let iterMap;
    while (currentStart <= totalCount) {
        iterMap = {};
        while (i <= currentStart + chunkSize) {
            iterMap[i.toString()] = metaDataMap[i.toString()]
        }
        let result = await contract.add_metadatalookup({
                metadata_map: iterMap
            },
            "300000000000000",
            "1"
        );
        console.log(`start at ${currentStart} to ${currentStart+chunkSize} completed`);
    }
}

//update_contract
async function retriveFunds(ownerAccount, contractAccount, quantity) {
    const contract = await buildContractObject(ownerAccount, contractAccount);

    const result = await contract.retrieve_funds({
            quantity: quantity.toString()
        },
        "300000000000000",
        "1"
    );

    console.log(result);
    return result;
}

//lock/unlock minting
async function unlockSales(ownerAccount, contractAccount, status) {
    const contract = await buildContractObject(ownerAccount, contractAccount);

    const result = await contract.unlock_sale({
            sales_lock: status
        },
        "300000000000000",
        "1"
    );

    console.log(result);
    return result;
}

//change minting cost
async function updateMintingCost(ownerAccount, contractAccount, newCost) {
    const contract = await buildContractObject(ownerAccount, contractAccount);

    const result = await contract.change_mint_cost({
            mint_cost: newCost.toString()
        },
        "300000000000000",
        "1"
    );

    console.log(result);
    return result;
}

export {
    initializeContract,
    mintNfts,
    addToWhiteList,
    addMetadata,
    retriveFunds,
    unlockSales,
    updateMintingCost
};