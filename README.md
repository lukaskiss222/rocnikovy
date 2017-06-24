# Rocnikovy Projekt
Tieto programy bezia len pod linuxom.
Kvoli tomu, ze skolsky server bezi na linuxe.

## Potrebne kniznice
Je potrebne mat nainstalovany eid klient a driver ```libpkcs11_sig_x64.so```, ktory umoznije komunikaciu s citackou.
Dalej treba kniznice do javascriptu:
* graphene-pk11
* node-webcrypto-p11
* base64url
* sha1

Tieto ostatne kniznice netreba, su len iny sposob na ziskanie klucou. (Ktory sa mi nepodarilo sfukcnit).
Je ocividne, ze cez node-webcrypto-p11 je to jednoduchsie.
* jssha
* pkijs
* asn1js
* node-webcrypto-ossl


### Nefunguje, pokusi o podpisanie
* ```sign1.js``` je subor na podpisovanie retazcou, v premennej ```MESSAGE``` sa uvedie retazec, ktory sa ma podpisat OP. Program pri spusteny sa snazim pripojit citacke a neskor si vypyta BOK kod na podpisanie spravy. Vid subor ```output.txt```. Je plus v nom implementovane overovanie aj podpisu. (Zial, nie vzdy to funguje).
* ```sign2.js``` je subor na podpisovanie, ktory vyuziva ine kniznice, bol to prvy nacrt, lebo niake veci nefungovali cez ```graphene-pk11```. (Ukazalo sa, ze to tiez nefunguje korektne).

Nakoniec sa ukazalo, ze takto je to neefektivne a tazko sa to bude implementovat do weboveho rozhrania.
Preto finalne riesenie, ktore je jednoduche a rychle, bolo navrhnute pomocou kniznice node-webcrypto-p11.

### Funguje prefektne implementovane
* ```crypto.js``` je vysledny produkt, jednoducho navrchnuty cez promises v javascripte. Umoznuje rychle podpisanie a overenie podpisu asychronne. Lachko sa bude dat implementovat do weboveho rozhrania.
* ```crypto2.js`` je podobny koncept ako ```crypto.js```, ale je len na overenie podpisu.

### Zaver
Pre dalsie vyuzitia odporucam vyuzit programy crypto.js a crypto2.js a na nich dalej pracovat.
