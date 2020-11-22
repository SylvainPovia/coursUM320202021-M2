# Nice API

- Liens heroku : https://server-node-api.herokuapp.com/

# Présentation du groupe

Le goupe est composé de :

- Arthur GUICQUIAUD (arthur.gicquiaud@gmail.com)
- Joseph AKABROU (Joakabrou@gmail.com)
- Théo ORIOL (theo.oriol@lilo.org)
- Sylvain POVIA (syl.povia@gmail.com)
- Clément CISTERNE (crc.company.6@gmail.com)

# Nice API ? C'est quoi ?

Nice API est issue de la volonté de mieux comprendre le comportement et l'évolution de l'épidémie de covid 19 aux Etats-Unis. En croisant les données covid 19 pour chaque état comme le nombre de cas négatif recensé, avec des indices sociétales comme (exemples). Ainsi, Nice API propose : 
- Un service de pipe http pour utiliser le croisement des dernières données covid 19 de chaques etats des Etats-Unis avec leurs indices sociétales
- Une page web qui utilise ces données et donne un exemple de visualisations claires et intuitives issuent de l'API.

# Nos données
Pour mener à bien ce projet, nous avons consacré une bonne journée à la recherche d'API web fournissant les données de la Covid-19(par ville dans un premier temps). Malheuresement, nous n'avons pas trouvé cette information. En revanche, nous avons trouvé une api qui permet de récupérer les données de covid par état. Cette api, (disponible via le lien suivant : https://covidtracking.com/data/api) nous a permis d'accéder à de vastes informations sur la covid-19 pour chaque état.

En parralèle à cette source d'information, nous avons également trouvé une autre API (disponible via le lien suivant : https://developers.teleport.org/api/) qui fourni des données économique et/ou démographique pour chaque ville au Etat Unis. Très rapidement, nous avons pu établir un lien possible entre une ville et son état. C'est là que nous est venu l'idée de proposer les données de Covid par état, puis de présenter les données démographique et économique des villes localisées dans l'état. 

## Notre méthode pour accéder aux données
Pour accéder au données, nous utilisons une requête GET via la fonction fetch que propose javascript. Pour simplifier notre usage des données, nous avons préféré les récupérer au format json. Cependant d'autres format étaient disponible.

## Le lien entre les données
Comme présenté précedemment, il existe un lien évident entre un ville au état unis et l'état dans lequel se situe cette ville. Pour chaque ville, nous avons identifié le nom de l'état dans les données économique/démographique. Pour chaque ville que l'on recherche dans l'api des données économiques/démographiques, on récupère également le code de l'état dans lequelle cette ville est située. Suite à cette découverte, nous avons regardé de près les options que propose l'API. C'est ainsi que nous avons découvert qu'il était possible d'avoir la liste des villes localisé dans un état.

Cela nous as permit de proposer une première route pour notre API : 
- Les données de covid-19 pour un état accompagnées de la liste des villes de cet état.

De cette manière, on peut regarder les données de manière globale, pour ensuite s'intéresser de près à une ville en particulier si on le désire. C'est justement cela que propose notre seconde route. :
- Les données démographique/économique pour une ville dans un état, avec les données de covid de son état.

En effet, si l'on regarde de près les données démographique de la ville de Juneau en Alaska  : 
{"juneau":{"state":"AK","date":20201121,"death":102,"positive":26044,"totalTestResultsSource":26044,"hospitalizedCurrently":129,"prefixe":"AK","population":32756}}

On peut voir le code de l'état (ici "AK" pour Alaska) dans lequelle la ville est située.

En parralèle à cela, on peut regarder les données de covid pour un état


# Nos routes

## Les liens
## La gestion des erreurs
## Le format des données

# Notre site consommateur de l'Api


--- 




