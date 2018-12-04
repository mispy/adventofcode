const _ = require('lodash')

function getEditDistance(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
    
    var matrix = [];
    
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }
    
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }
    
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
            matrix[i][j] = matrix[i-1][j-1];
        } else {
            matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                    Math.min(matrix[i][j-1] + 1, // insertion
                                            matrix[i-1][j] + 1)); // deletion
        }
        }
    }
    
    return matrix[b.length][a.length];
}

function main() {
    const input = `
    ybruvapdgixszyckwtfqjonsie
    mbruvapxghslyyckwtfqjonsie
    mbruvapdghslzyckwtkujonsie
    rwruvapdghxlzyckwtfqjcnsie
    obruvapdgtxlzyckwtfqionsie
    lbruvapdghxqzyckwtfqjfnsie
    mbrunapdghxlzyccatfqjonsie
    mbruvapdghxlzyokltfqjdnsie
    ybruvapdghxlzmckwtfqjmnsie
    mbruwaadghxdzyckwtfqjonsie
    muruvapdghxlzyckvtfqjonsim
    mbruvapdghxlkyckwtxqjonjie
    mbruvaqdghxlzyckwtfqjrnnie
    mwruvapdghdlzyckttfqjonsie
    mbruvapdgtelzyckwxfqjonsie
    mbruvapdohxlzvckwtfqjonhie
    mbrugapdgbxlzyckwtfqjynsie
    mbruvapdghxlzyckwtlqjonjiu
    mbruvapwghxlzyckwafqjonbie
    wbruvapdghxlhyckwtfqjonsii
    mbruvapdghxlzyckwtcqnonsiq
    mbyuvapighxlzybkwtfqjonsie
    mbrrvapdghxvzyckwtfqjonsio
    mhruvapdghrlzyckwtfzjonsie
    mtruvapvghxlzyckwtfnjonsie
    mmrlhapdghxlzyckwtfqjonsie
    mbruvapdgpxlzyjkwtfqjovsie
    mbrucapdghxlzymkwtzqjonsie
    mbeuvafdghxlzyckwtfqjonwie
    mbruvapcghxlayckwtfqjonsii
    mbruvabdghxlzyckwtfqyansie
    mbruvjpdghxlzyckwtfqgfnsie
    lbruvapdghxlzyckwtfqjonriv
    mbrupapdghxlzycjwtfqronsie
    mbpuvapdthxlzymkwtfqjonsie
    mbiuvapdgixlzyckwxfqjonsie
    mbruvapdghxyzyckwtfcjonsbe
    mbrurapkghxlzyckwtfqjonzie
    mbrufapdrhxlzyciwtfqjonsie
    mbruvapdghxlzbckwtfqjoisae
    ubruhapdghxlzuckwtfqjonsie
    mbruvapdjhulzyckwtfqjonshe
    mbruwapdgyxlzyckntfqjonsie
    mwruvapdghplzyckwtfqjonsme
    mbruvapjghtlzyckwtfqgonsie
    pbruvapdghhlzyckwtfrjonsie
    mbruvgpdihxqzyckwtfqjonsie
    mbruvahdohxlzyckwtfijonsie
    ibuuvapdghxlzyckwtfqjofsie
    mbruvandghxlzyckwtfqjrnxie
    mbrjvlpdghxlzyckwgfqjonsie
    mbruvapogfxlzyckotfqjonsie
    mbruvrpdghxlzyckutfejonsie
    mbruvbpdghxlzyhkwtfqjonsip
    mbruvapdghxlzyckmnfqjensie
    mbruvapdghvlzyckwtfqjowsix
    mbruvakdgholzwckwtfqjonsie
    mbruvapdghxlzackwtfqconsae
    mbruvapdghxlzyqvwtfqjlnsie
    mprrvapdgfxlzyckwtfqjonsie
    mbrunacdghxlhyckwtfqjonsie
    obruvapdgsxlzyckwtfqjonvie
    murcvapdghslzyckwtfqjonsie
    mbruvapdghxlzyzkwmftjonsie
    mbrwvapdgtvlzyckwtfqjonsie
    mbxuvapdghxlzqcnwtfqjonsie
    mbruvaddghxboyckwtfqjonsie
    mhruvwndghxlzyckwtfqjonsie
    mbrdvapdghxlzyckwmpqjonsie
    mbruvapdgyxlzyckizfqjonsie
    mbruvapdghxlzlckwtfqeowsie
    mbruvbpdgrxlzyckwtfqjonsxe
    mbruqapoghxlzyckwtvqjonsie
    mbouhapdghmlzyckwtfqjonsie
    mbruvapjghxidyckwtfqjonsie
    mbsuvapkghxlkyckwtfqjonsie
    mbruvlpdghxlzycrwtfqjonsis
    mcrueapdghxlzyckwtfqjynsie
    muruvapngbxlzyckwtfqjonsie
    mbruvapdghxlzycawtfyjojsie
    mbruvbpdghxczyjkwtfqjonsie
    ybduvapdghxnzyckwtfqjonsie
    mbruvbpdghxlzyckwtfbjousie
    mbouvapdghxlzycbwtfqponsie
    mbruvaedghplzycgwtfqjonsie
    mbrhvapdghxlzyckytfqjgnsie
    mbruvapdqbxleyckwtfqjonsie
    mbruvapddhhldyckwtfqjonsie
    mbruvapdghxlwrckwtfqjondie
    mbruvapdmhxlzyckwtfqkonsve
    xbbuvapdghxlzyckwtfkjonsie
    mbruvapdghxlzyckwcfqjunkie
    mbruvapdghxlzyckwtfqxonfib
    mbrtvapkghxlzyckwtfqeonsie
    mbruvazdghxldymkwtfqjonsie
    kbruvapddhxlzfckwtfqjonsie
    mbouvapdghxlpyckwtfqjoosie
    mbauvapdghxlzyckwtfqjszsie
    mbruvapdghtlzyckntfqtonsie
    mbruvipdggxlzbckwtfqjonsie
    mbruqapdghrlzyckwtfqjznsie
    myruvacdghxlzyckwifqjonsie
    mbruvapdghxlzuckwtfkjocsie
    mwjuvapdghxlzyckwtfqjonsxe
    mbruvapxghxlzickwtfqjobsie
    mbrupapdghxtlyckwtfqjonsie
    meruvapdjjxlzyckwtfqjonsie
    mbruvkodghxlzyckwofqjonsie
    mbruvapdgexlzyckwtgkjonsie
    mbruvapwghxlzyckwtcqjonsiw
    mbruvapdghxlzykkwtfqtoxsie
    mbruvapdahxlzycgwtfwjonsie
    mbruvapdgwxlhyckhtfqjonsie
    mbruvapbghxlzycbhmfqjonsie
    mbruvapdghxvzyzkwtfqjonsin
    mbrcvapdqhxlzyckwyfqjonsie
    zbruvaxdghxlzyckwgfqjonsie
    mtruvapdghxlilckwtfqjonsie
    bbruvapdghxlzyckwtfmjonsxe
    mbruvajdghxlzyckwtfqfwnsie
    mbruvapdgkxlzyckwtfqionpie
    rbruvapdghxlryckwdfqjonsie
    mbruvandghxlzyckwmfvjonsie
    mbruvahdghxlzeckwtfqjonsme
    mbruvnpcghxlzyckwtfqjobsie
    mbruvapdghqlzyckwtfbjonsiy
    mbruvavdghxlzyckwufqjodsie
    mbruvapdghxlzyckwtfzmovsie
    mbruvlpdghxuzyckwtfqjoesie
    mbruvopdghxlzycwwtfqjansie
    obruvapdghglzybkwtfqjonsie
    mbpuvlpdghxlcyckwtfqjonsie
    mbruvaidghxlzyckwtfmjonoie
    mbruvapdihxzzyckwtfqjonsiy
    mbquvapdghxlzyckwtfqconsme
    mbruvapdghslzyckqtfqjojsie
    mbrzdapdghxmzyckwtfqjonsie
    mwruvapdghxozyckwtfqjonsxe
    muruvapdgfxlzyckwtfqjojsie
    wtruvapdghxlzyckvtfqjonsie
    mbruvapdghxlzyckysfqjxnsie
    mbruvrpdghxczyckktfqjonsie
    mbquvapdghxlryckwtfqjonsne
    mbruvapdghflzycvwtfqjpnsie
    mbruvapughclzyckwtfqjonsin
    mbrhvapdghxlpyckwtfqjonsre
    mbruvapdgtxlzyckwtfqjoosit
    mbrupapnghxhzyckwtfqjonsie
    mmvuvapdvhxlzyckwtfqjonsie
    mbruvaptghxlzyckwtfqjotsse
    mgruvapvghxlzyckwtfqjonsix
    mbrupapdghxszyckwtfqjunsie
    mbruvkpdghelzyckwtfqjpnsie
    mbruvrrdghjlzyckwtfqjonsie
    mbruvapdghnlzyckwtfkjonsze
    mbruvwpdghxlzyckwtfqhoysie
    mbrsvapdfhxlzyckwtfqjobsie
    mbruvapdgexezymkwtfqjonsie
    ybruvapdghxlzyckwtfqxonsiw
    mrruvapdghxdzyckwtfqjossie
    mbruvapdghtlzyckwtfqconsiu
    mbrpvapdghxlzlckwpfqjonsie
    mbruvjpdghslzyckwtfqjjnsie
    mhruvapoghxlzyckwtfvjonsie
    mbrubqpdghvlzyckwtfqjonsie
    mbruvapdghxlzackwtfqconsiw
    mbruvapdgnxlzkckwtfqjdnsie
    mbrudapgghelzyckwtfqjonsie
    mbruvapdghxlzlakwbfqjonsie
    mbpuvapdghxlzyckwtuqjonjie
    abruvapdghxlzykkwtfqjonzie
    mbrupupdghxlsyckwtfqjonsie
    mbrsvupdghxlzyckwtfqjonkie
    mxruvgpdghxllyckwtfqjonsie
    mbrnvapdghxlzycbwtfqfonsie
    mbrbxapdghxlzyckttfqjonsie
    mbnuvapdghxlzyxkwtmqjonsie
    mbrfvapdghjlzickwtfqjonsie
    mbhuvupdghxlzyxkwtfqjonsie
    mbrcvapdghxluyckwtfqjznsie
    mbruvapdghxlzyckwofqjoxsiz
    mbrevapdghxloyckwtfqjonnie
    mbruvipdghnlzyckwtfqjopsie
    mbxxvaptghxlzyckwtfqjonsie
    mbruvcpdghxlztckwtjqjonsie
    mqruvlpdghxlzyckotfqjonsie
    mbruvapdgqxlzyckwtfqjpvsie
    mbruvapdgvxlzyjkwtfqjbnsie
    mbruvapdghxlgyckwtfqcocsie
    mbruvapdghxkwyckwtfqjoqsie
    mbrgvavdghxlzyckwxfqjonsie
    qbruqapdgvxlzyckwtfqjonsie
    mbauvapdghxlzgckwtfqjunsie
    mbruvapdgdxluyckwtfqjoosie
    mbruvapdghxlzykkwtfqwobsie
    mbruvapdghxlzhcnwtfqjonqie
    mbruvapdghxlzycbhmfqjonsie
    mbruvapdghxluyczwtfqjontie
    mbruvapnghxlzyckwnfqjonbie
    moruvapdghxlzcckwtfqponsie
    mbruvapfgxxlzyckwtfqjunsie
    mbruvapdghxlryckvtfejonsie
    mbrzvapdghxlzvcbwtfqjonsie
    mbruvapdgqxlzyckwcfqjonsce
    abruvupdrhxlzyckwtfqjonsie
    mbrubaptghxlzyckwtfqjondie
    mgruvapdgpxlzyckwtfijonsie
    mbruvapdghxczlckwtfujonsie
    mbruvapdgmmlzyckwtfqjonsir
    mbruvapdhhxltyckwtfdjonsie
    mbruvapdghxlzyckwtfdjjnste
    mbrdvzpdghxlcyckwtfqjonsie
    mbruvapdghxlzyckwtnqbonsim
    mbrovapdghxlzyckwtfpjousie
    mymuvapdghxlzyjkwtfqjonsie
    mbpuvapdghxlzyckwtfljcnsie
    mbrxvapdghxlzyclwtfqjonpie
    mbrueapdghxlzyckwtfqjopsia
    mbruvapdghxlzycdwtfqjbfsie
    tbruvavdghxlzyckwtmqjonsie
    mbduvapdghxlzyckwrfqjrnsie
    mkrsvapughxlzyckwtfqjonsie
    mbruvapdghylzyckwtfqtolsie
    mgruvapdglxldyckwtfqjonsie
    mbrunapdghclzyckwtfqjonsiy
    mbruvapdgrxlxyckwtfgjonsie
    mbruvapdghxpzbckftfqjonsie
    mbruvcpdghxyzyckotfqjonsie
    mbruvapdghxlsyckwtfqcqnsie
    mbruvapdghxlzzckwtfqjonskf
    mbruvppdghxlzfckwtfqjgnsie
    mbhuvapdghxlzytkwtfqjonoie
    mbruvapdghxlzvrkwtfqjjnsie
    mbmuvapdghxuzyckwtfqjonsze
    mbruvapdghnlzycnwtfqjonsil
    mbruvapdgholzyckitfqjonsia
    mbruxapdghxlmyckwtfqbonsie
    mbauvapdgholzyckwtfqjolsie
    mbruvapdghxlzyckwtfqjotslq
    dbrutapdghxlzyckwtfqjonsiv
    mbruvapdzhxlyyckwtfbjonsie
    mmruaapsghxlzyckwtfqjonsie
    mbruvaldgqxqzyckwtfqjonsie
    mbruvaodghxdzyjkwtfqjonsie
    mbrcmatdghxlzyckwtfqjonsie
    mbrqvapdgtxlzycewtfqjonsie
    mjruvapdghzlzyckwtfqjonrie
    mbruvapdghxopcckwtfqjonsie
    mbruvapdghxszycwwtfqjoqsie
    mbruvapdgoxezyckwtjqjonsie`

    const vals = input.split(/\s+/)

    /*let count1 = 0
    let count2 = 0
    for (const val of vals) {
       const letters = Array.from(val)
       const count = _.countBy(letters)
       const invert = _.invert(count)
       const keys = _.keys(count)
       if (_.some(keys, k => count[k] === 2)) {
           count1 += 1
       }
       if (_.some(keys, k => count[k] === 3)) {
           count2 += 1
       }
    }

    console.log(count1*count2)*/

    for (let v of vals) {
        for (let v2 of vals) {
            let d = getEditDistance(v, v2)
            if (d === 1) {
                console.log(v, v2)
            }
        }
    }
}

main()