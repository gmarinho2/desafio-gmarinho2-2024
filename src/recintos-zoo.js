class Animal{
    constructor(nome, tamanho, carnivoro, biomas){
        this.nome = nome;
        this.tamanho = tamanho;
        this.carnivoro = carnivoro;
        this.biomas = biomas;
    }

    //ve se cabe no recinto e se pode por ser ou nao carnivoro
    verificaSituacao(recinto, quantidade){
        const biomas_aceitos = new Set(this.biomas);
        const biomas_disponiveis = new Set(recinto.Biomas);
        const intersecao = new Set([...biomas_aceitos].filter(i => biomas_disponiveis.has(i)));
        if(intersecao.size===0){
            return false;
        }

        let tamanho_final = recinto.Tamanho;
        if(recinto.Animais.length==0 && (tamanho_final - quantidade * this.tamanho>=0)){
            return true
        }

        for(let animal of recinto.Animais){
            if(animal.nome!=this.nome){
                tamanho_final = tamanho_final - 1;
                break;
            }
        }
        for(let animal of recinto.Animais){
            tamanho_final = tamanho_final - animal.tamanho;
        }

        tamanho_final = tamanho_final - quantidade * this.tamanho;

        if(tamanho_final<0){
            return false;
        }

        //se é carnivoro, ve se o animal é da mesma especie
        //se não, verifique se esta sendo inserido com um carnivoro
        if(this.carnivoro){
            for(let animal of recinto.Animais){
                if(animal.nome != this.nome){
                    return false;
                }
            }
        }
        else{
            for(let animal of recinto.Animais){
                if(animal.carnivoro){
                    return false;
                }
            }
        }
        return true;
    }
}

class Macaco extends Animal{
    constructor(){
        super("MACACO", 1, false, ["savana", "floresta"])
    }
    //verifica se terá companhia:
    verificaSituacao(recinto, quantidade){
        if(!super.verificaSituacao(recinto, quantidade)){
            return false;
        }
        if(quantidade<2 && recinto.Animais.length<1){
            return false;
        }
        return true;
    }
}

class Hipopotamo extends Animal {
    constructor(){
        super("HIPOPOTAMO", 4, false, ["savana", "rio"])
    }
    //verifica se tem outra especie, se tiver tem que estar no rio
    verificaSituacao(recinto, quantidade){
        if(!super.verificaSituacao(recinto, quantidade)){
            return false;
        }
        const recinto_biomas = new Set(recinto.Biomas);
        for(let animal of recinto.Animais){
            if((animal.nome!=this.animais) && (!recinto_biomas.has("rio"))){
                return false;
            }
        }
        return true;
    }
}

class RecintosZoo {
    constructor(){
        this.animais = {    
                            "LEAO": new Animal("LEAO", 3, true, ["savana"]),
                            "LEOPARDO": new Animal("LEOPARDO", 2, true, ["savana"]),
                            "CROCODILO": new Animal("CROCODILO", 3, true, ["rio"]),
                            "MACACO": new Macaco(),
                            "GAZELA": new Animal("GAZELA", 2, false, ["savana"]),
                            "HIPOPOTAMO": new Hipopotamo()
                        }

        this.recintos = {
                            1: {Tamanho: 10, Biomas: ["savana"], Animais: [this.animais.MACACO, this.animais.MACACO, this.animais.MACACO]},
                            2: {Tamanho: 5, Biomas: ["floresta"], Animais: []},
                            3: {Tamanho: 7, Biomas: ["savana", "rio"], Animais: [this.animais.GAZELA]},
                            4: {Tamanho: 8, Biomas: ["rio"], Animais: []},
                            5: {Tamanho: 9, Biomas: ["savana"], Animais: [this.animais.LEAO]}
                        }
    }

    analisaRecintos(nome_animal, quantidade) {
        const animal_atual = this.animais[nome_animal];
        if(!(quantidade % 1 == 0) || quantidade <= 0){
            return {
                erro: "Quantidade inválida"
            };
        }
        if(!animal_atual){
            return {
                erro: "Animal inválido"
            };
        }

        const recintosViaveis = []
        for(const recinto in this.recintos){
            const viavel = animal_atual.verificaSituacao(this.recintos[recinto], quantidade);

            if(viavel){
                let ocupado = 0;
                for(let animal of this.recintos[recinto].Animais){
                    if(animal_atual.nome!=animal.nome){
                        ocupado = this.recintos[recinto].Animais.reduce((acumulador, animal)=>acumulador+animal.tamanho, 0) + 1;
                        break;
                    }
                    ocupado = this.recintos[recinto].Animais.reduce((acumulador, animal)=>acumulador+animal.tamanho, 0); 
                }
                const total = this.recintos[recinto].Tamanho;
                const livre = total - ocupado - (animal_atual.tamanho * quantidade);
                recintosViaveis.push(`Recinto ${recinto} (espaço livre: ${livre} total: ${total})`);
            }
        }

        if(recintosViaveis.length > 0){
            return {
                recintosViaveis
            };
        }
        return {
            erro: "Não há recinto viável"
        };
    }
}

export { RecintosZoo as RecintosZoo };