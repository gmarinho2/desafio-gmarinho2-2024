class Animal{
    constructor(nome, tamanho, carnivoro, biomas){
        this.nome = nome;
        this.tamanho = tamanho;
        this.carnivoro = carnivoro;
        this.biomas = biomas;
    }

    //ve se cabe no recinto e se pode por ser ou nao carnivoro
    verificaSituacao(recinto, quantidade){
        //ve se a interseção de biomas é vazia
        const biomas_aceitos = new Set(this.biomas);
        const biomas_disponiveis = new Set(recinto.Biomas);
        const intersecao = new Set([...biomas_disponiveis].filter(i => biomas_aceitos.has(i)));
        if(intersecao.size==0){
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
        if(quantidade<2){
            if(recinto.Animais.length<1){
                return false;
            }
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
        super.verificaSituacao(recinto, quantidade); //para usar a funcao de animal
        
        //implemetnar
    }
}

class RecintosZoo {
    constructor(){
        this.animais = {    
                            "LEAO": new Animal("LEAO", 3, true, ["savana"]),
                            "LEOPARDO": new Animal("LEOPARDO", 2, true, ["savana"]),
                            "CROCODILO": new Animal("CROCODILO", 3, true, ["rio"]),
                            "MACACO": new Macaco(),//("MACACO", 1, false, ["savana", "floresta"]),
                            "GAZELA": new Animal("GAZELA", 2, false, ["savana"]),
                            "HIPOPOTAMO": new Hipopotamo()//("HIPOPOTAMO", 3, false, ["savana", "rio"])
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
        if(quantidade <= 0){
            return {erro: "Quantidade inválida"};
        }
        if(!animal_atual){
            return {erro: "Animal inválido"};
        }

        const recintosViaveis = []

        for(const recinto in this.recintos){
            const viavel = animal_atual.verificaSituacao(this.recintos[recinto], quantidade);
            if(viavel){
                let tamanho_ocupado = 0;
                for(let animal of this.recintos[recinto].Animais){
                    if(animal_atual.nome!=animal.nome){
                        tamanho_ocupado = this.recintos[recinto].Animais.reduce((acumulador, animal)=>acumulador+animal.tamanho, 0) + 1;
                        break;
                    }
                    tamanho_ocupado = this.recintos[recinto].Animais.reduce((acumulador, animal)=>acumulador+animal.tamanho, 0); 
                }
                const restante = this.recintos[recinto].Tamanho - tamanho_ocupado - (animal_atual.tamanho * quantidade);
                
                recintosViaveis.push(`Recinto ${recinto} (espaço livre: ${restante} total: ${this.recintos[recinto].Tamanho})`);
            }
        }

        if(recintosViaveis.length > 0){
            return {recintosViaveis};
        }
        return {erro: "Não há recinto viável"};
    }
}

export { RecintosZoo as RecintosZoo };

console.log(new RecintosZoo().analisaRecintos('MACACO', 10));