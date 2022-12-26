# Sambuco
Cette application est une aide à l'économie d'énergie pour les gros consommateur, leur permettant de visualiser les données de mesure fournies par l'exploitant de réseau et calculer automatiquement les contingents.

## Fonctionnalités
* Afficher la courbe de charge sous forme d'un graphique chargé depuis un fichier eBIX.
* Calculer la courbe de charge avec application du taux de contingentement.
* Calculer la consommation mensuelle de référence et la consommation mensuelle contingentée.

## Calcul du contingement
L'application offre les deux modes prévus par les ordonnances :

* __Mode de calcul pour le contingentement immédiat__

    ```
    Cet exemple illustre le calcul nécessaire afin d'établir le contingent pour février 2024 :


    Février 2023
    ------------

    Consommation mensuelle : 46'000 kWh
    Nombre de jours ouvrés : 20
    Consommation de référence : (46'000 kWh / 20 jours ouvrés) = 2'300 kWh
    

    Février 2024
    ------------

    Nombre de jours ouvrés : 21
    Taux de contingentement : 80%
    Contingent jour ouvré : 2'300 kWh * 80% = 1'840 kWh
    Contingent mensuel : 1'840 kWh * 21 jours ouvrés = 38'640 kWh
    ```

    _Nota : Si la consommation a varié de plus de 20% par rapport à l'année précédente, on peut se baser sur le mois - 1  de l'année en cours plutôt que le même mois de l'année précédente. Dans ce cas, il faut le justifier._

* __Mode de calcul pour le contingentement__

    ````
    Cet exemple illustre le calcul nécessaire afin d'établir le contingent pour février 2024 :


    Février 2023
    ------------

    Consommation mensuelle : 46'000 kWh


    Février 2024
    ------------

    Taux de contingentement : 80%
    Contingent mensuel : 46'000 kWh * 80% = 36'800 kWh
    ````

    _Nota : Contrairement au contingement immédiat qui sont calculés par les gros consommateurs eux-même, les contingents sont attribués et notifiés par l'AES directement aux gros consommateurs._

Les périodes de contingentement prévues dans l'annexe 2 sont consignées dans le fichier `quota_periods.json`.

## Cadre réglementaire
Au moment de la rédaction de ce document, les ordonnances suivantes sont en cours de consultation :

* [Mise en consultation des mesures prévues en cas de pénurie d’électricité](https://www.admin.ch/gov/fr/accueil/documentation/communiques.msg-id-91881.html)
* [Ordonnance sur le contingentement immédiat de l’énergie électrique](https://www.newsd.admin.ch/newsd/message/attachments/74061.pdf)
* [Ordonnance sur le contingentement de l’énergie électrique](https://www.newsd.admin.ch/newsd/message/attachments/74055.pdf)


## Technique
### JSONata
Requête JSONata pour extraire les données de mesure d'un fichier eBIX transformé en JSON.
```json
**.`rsm:MeteringData`. {
    "start": *.`rsm:StartDateTime`,
    "end": *.`rsm:EndDateTime`,
    "period": $number(`rsm:Resolution`.`rsm:Resolution`),
    "values": $map(**.`rsm:Volume`, $number)
}
```

### JSON
Résultat de la transformation JSONata appliquée au JSON.
```json
[
  {
    "start": "2020-07-20T22:00:00Z",
    "end": "2020-07-21T22:00:00Z",
    "period": 15,
    "values": [
      12321,
      11742,
      ...
      200,
      0
    ]
  },
  {
    "start": "2020-07-20T22:00:00Z",
    "end": "2020-07-21T22:00:00Z",
    "period": 15,
    "values": [
      0,
      0,
      ...
      400,
      0
    ]
  }
]
```

### eBIX
Exemple de fichier eBIX.
```xml
    ...
    <rsm:MeteringData>
        <rsm:DocumentID>ebIX_10314399_1</rsm:DocumentID>
        <rsm:Interval>
            <rsm:StartDateTime>2020-07-20T22:00:00Z</rsm:StartDateTime>
            <rsm:EndDateTime>2020-07-21T22:00:00Z</rsm:EndDateTime>
        </rsm:Interval>
        <rsm:Resolution>
            <rsm:Resolution>15</rsm:Resolution>
            <rsm:Unit>MIN</rsm:Unit>
        </rsm:Resolution>
        <rsm:ExchangeMeteringPoint>
            <rsm:VSENationalID schemeID="VSE" schemeAgencyID="260">CH10041012345DFORE-TR020000000000</rsm:VSENationalID>
            <rsm:Direction>
                <rsm:InArea>
                    <rsm:EICID schemeAgencyID="305">12Y-0000000744-M</rsm:EICID>
                </rsm:InArea>
                <rsm:OutArea>
                    <rsm:EICID schemeAgencyID="305">10YCH-SWISSGRIDZ</rsm:EICID>
                </rsm:OutArea>
            </rsm:Direction>
        </rsm:ExchangeMeteringPoint>
        <rsm:Product>
            <rsm:ID schemeAgencyID="9">8716867000030</rsm:ID>
            <rsm:MeasureUnit>KWH</rsm:MeasureUnit>
        </rsm:Product>
        <rsm:Observation>
            <rsm:Position>
                <rsm:Sequence>1</rsm:Sequence>
            </rsm:Position>
            <rsm:Volume>12321</rsm:Volume>
            <rsm:Condition>56</rsm:Condition>
        </rsm:Observation>
        <rsm:Observation>
            <rsm:Position>
                <rsm:Sequence>2</rsm:Sequence>
            </rsm:Position>
            <rsm:Volume>11742</rsm:Volume>
            <rsm:Condition>56</rsm:Condition>
        </rsm:Observation>
        <rsm:Observation>
            <rsm:Position>
            ...
```