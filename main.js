// write your custom scripts here
init = function(sheet) {
    if (sheet.id() === "main") {
        initMain(sheet);
    }
};

let tableauModifs = ["zero","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","six-huit","dix-neuf","vingt"];

// My function
const initMain = function(sheet) {
    jetscript(sheet);
};

// INITROLL //
initRoll = function(result, callback) {
    callback('diceresult', function(sheet) { // diceresult is the id of the view you want to use
        let modif = result.tags[0];
        modif = tableauModifs.indexOf(modif);
             

        if (result.total === 0) {
            sheet.get('resultat').text('Echec critique');
            sheet.get('resultat').addClass('text-danger');

        }else{
            let somme = 0;
            let tableau = [];
            let compteur = 0;           
            let bonificateur = 0;

            each(result.all,function(ligne,id){
                let valeur = Number(ligne['value']);
                tableau[compteur] = ligne['value'];
                somme += valeur;
                compteur++;
            });
            // On parcourt le tableau qui répertorie toutes les valeurs des dés
            let final = 0;
            each(tableau,function(ligne,id){
                
                let compteur = 0; // On initialise le compteur d'itération.
                for(i=0;i<tableau.length;i++){
                    if(ligne === tableau[i]){
                        compteur++; // Si on trouve une correspondance, on incrémente le compteur.
                    };

                };// fin du for
                // On stocke le nombre d'itération max d'un même dés.
                if(final < compteur){final = compteur;};

            }); // fin each

            // On détermine le bonificateur.
            if(final === 2){
                bonificateur = 5;
            }else if(final >= 3){
                bonificateur = 15;
            };

            sheet.get('resultat').text(somme+modif+bonificateur);
            sheet.get('resultat_decompose').text(somme+'+'+modif+'+'+bonificateur);
        };
    });
};
// FIN INITROLL


//fonction qui gère le clic sur le label
const jetscript = function(sheet) {
    sheet.get('jetscript').on('click',function(){
        let NbDes = sheet.get('des').value();
        let Fix = sheet.get('fix').value();
        Fix = tableauModifs[Fix];
        let Seuil = sheet.get('seuil').value();
        let TitreJet = sheet.get('jet').value();
        rollMyDice(sheet,NbDes+'D10',Seuil,Fix,TitreJet);
    });
};

/* Lancé de dés */
const rollMyDice = function(sheet,diceValue,seuil,modif,rollTitle){
    let dice = Dice.create(diceValue).compare(">",seuil).tag(modif);
    Dice.roll(sheet, dice, rollTitle, getDiceVisibility(sheet));
};

// visibilité du test
const getDiceVisibility = function(sheet) {
   	let bntGM = sheet.get("dice_gm").value();
    let bntGMonly = sheet.get("dice_gm_only").value();

    if (bntGM === true) {
        //log('visibility: gm');
        return "gm"
    } else if (bntGMonly === true) {
        //log('visibility: gmonly');
        return "gmonly"
    }
    
    //log('visibility: all');
  	return "all";  
};    
