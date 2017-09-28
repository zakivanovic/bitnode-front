const translations = {
    "versions": {
        "node" : "Version du nœud : ",
        "protocol" : "Version du protocole : " ,
        "wallet" : "Version du porte-feuille : ",
        "userAgent" : "Client : "
    },
    "verificationProgress" : "Progression : ",
    "status" : "Etat de la chaine : ",
    "uptime" : "Temps d'activité : ",
    "height" : "Hauteur : ",
    "timeOffset" : "Decalage horaire : ",
    "sync" : "Synchronisation",
    "network" : "Réseau",
    "node" : "Nœud",
    "connections" : "Connexions : ",
    "difficulty" : "Difficulté : ",
    "hashrate" : "Taux du hash : ",
    "block" : "Bloc : ",
    "medianTime" : "Médiane du temps : ",
    "softForks" : "Soft forks : ",
    "uname" : {
        "sysname" : "Nom du système : ",
        "nodename" : "Nom du nœud : ",
        "release" : "Release : ",
        "version" : "Version OS : ",
        "machine" : "Machine : "
    },
    "disk" : {
        "path" : "Chemin disque : ",
        "used" : "Memoire utilisée : ",
        "available" : "Memoire disponible : ",
        "total" : "Memoire totale : "
    },
    "proxy" : "Proxy : ",
    "errors" : "Erreurs : ",
    "mempool" : {
        "size": "Taille mempool : ",
        "usage": "Utilisation mempool : ",
        "max": "Max mempool",
        "fee": "Frais"
    },
    "pruned" : "Mode léger : ",
    "memory":{
        "progress" : "Utilisation de la mémoire : ",
        "used" : "Mémoire utilisée : ",
        "free" : "Mémoire disponible : ",
        "total" : "Mémoire totale : "
    },
    "sys":{
        "hostname":"Hote : ",
        "cpus": "Nb. processeurs : ",
        "uptime": "Temps d'activité : ",
        "os":{
            "platform": "Platforme OS : ",
            "arch": "Architecure OS",
            "release": "Version OS"
        }
    },
    "system" : "Système",
    "hash" : "Hash",
    "lastBlocks" : "Derniers blocs",
    "blockInfo" : "Résumé du bloc",
    "tx" : "Transactions"
};


function i18n(path) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined
    }, translations || self)
}