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
Pour accéder au données, nous utilisons une requête GET via la fonction fetch que propose javascript. Pour simplifier notre usage des données, nous avons préféré les récupérer au format json. Cependant d'autres format étaient disponible. Voici ci-dessous un exemple de requête que nous avons fait  : 

// Données démographique
let url = "https://api.teleport.org/api/countries/iso_alpha2%3AUS/admin1_divisions/geonames%3A"+state_id+"/cities/";
let get_name_ville = await fetch(url);
let get_json_ville =  await get_name_ville.json()

## Le lien entre les données
Comme présenté précedemment, il existe un lien évident entre une ville au état unis et l'état dans lequel se situe cette ville. Pour chaque ville, nous avons identifié le nom de l'état dans les données économique/démographique. Pour chaque ville que l'on recherche dans l'api des données économiques/démographiques, on récupère également le code de l'état dans lequelle cette ville est située. Suite à cette découverte, nous avons regardé de près les options que propose l'API. C'est ainsi que nous avons découvert qu'il était possible d'avoir la liste des villes localisé dans un état.

Cela nous as permit de proposer une première route pour notre API : 
- Les données de covid-19 pour un état accompagnées de la liste des villes de cet état.

De cette manière, on peut regarder les données de manière globale, pour ensuite s'intéresser de près à une ville en particulier si on le désire. C'est justement cela que propose notre seconde route. :
- Les données démographique/économique pour une ville dans un état, avec les données de covid de son état.

# Nos routes

## La négociation de contenu
Pour chaque données que nous proposons sur notre api, nous avons deux format disponible 
  - json 
  - xml+rdf
  
Pour simplifier l'accès à ces format, nous avons intégrer le format de données recherché dans le liens vers les données. Ainsi, pour chaque routes vers lesquelles vous allé pointer, votre appel doit se terminer par .json dans le cas ou vous souhaiter récupérer du json, et .xml dans le cas ou vous préférer télécharger un fichier .rdf
## Les liens

Afin de simplifier l'utilisation de notre api, nous avons créée un jeu de données qui liste les états des états - unis. Cela permet de voir les états que l'on peut rechercher dans notre api. Une fois que l'on recherche un état, on peut regarder ses données covid et voir la liste des villes présentent dans cet état. 
La liste des état présent dans l'API constitue notre prmière route. C'est une route qui ne sert qu'à connaitre ce qui est recherchable dans notre API.

Cette route est accessible via le lien suivant : 
- /state_list.:format?
Comme mentionné précédemment, vous devez donc renseigner le format désiré.

Ensuite, nous avons la route qui renvoi des données de covid pour un état ainsi que la liste des villes présentent dans cet état.

Cette route est accessible via le lien suivant : 
- /etat/:etat.:format?

Pour finir, nous avons la route qui permet d'atteindre la dernière granularité, c'est à dire celle de la ville dans un état. Cette dernière est disponible au lien suivant : 
- /etat/:etat/ville/:ville.:format?

## La gestion des erreurs
Pour les deux routes que nous avons construit, nous avons géré les erreurs. Autrement dit, si vous entrez un mauvais nom d'état, où un mauvais nom de ville, l'API vous le fera savoir.

De même, nous avons également construit une route dans le cas où l'erreur concerne un lien qui n'a aucun rapport avec l'une des routes dont nous avons parlé précedemment
## Le fichier de description xml+rdf 

# Notre site consommateur de l'Api


- Lien direct vers le site web : https://theo-oriol.github.io/API-access.io/
--- 




