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
- Un service de pipe http pour utiliser le croisement des dernières données covid 19 de chaque etats des États-Unis avec leurs indices sociétaux
- Une page web qui utilise les données citées précedemment pour donner un comparatif de deux villes aux États-Unis.

# Nos données
Pour mener à bien ce projet, nous avons consacré une bonne journée à la recherche d'API web fournissant les données de la Covid-19(par ville dans un premier temps). Malheuresement, nous n'avons pas trouvé cette information. Avec le temps, nous avons finalement trouvé une API qui fournit les données de covid <b>par état</b>. Cette api, (disponible via le lien suivant : https://covidtracking.com/data/api) nous a permis d'accéder à de vastes informations sur la covid-19 pour chaque état.

En parralèle à cette source d'information, nous avons également trouvé une API (disponible via le lien suivant : https://developers.teleport.org/api/) qui fourni des données économiques et/ou démographiques de chaque ville. Très rapidement, nous avons identifier un lien direct entre une ville et son état. C'est là que nous est venu l'idée de proposer les données de Covid par état, puis de présenter les données démographiques et économiques des villes localisées dans cet état. 

## Notre méthode pour accéder aux données
Pour accéder aux données, nous utilisons une requête GET via la fonction fetch que propose le langage JavaScript. Pour simplifier notre usage des données, nous avons préféré les récupérer au format json. Cependant d'autres format sont disponibles. Voici ci-dessous un exemple le format d'une requête que nous avons employée  : 

```javascript
// Données démographiques
let url = "https://api.teleport.org/api/countries/iso_alpha2%3AUS/admin1_divisions/geonames%3A"+state_id+"/cities/";
let get_name_ville = await fetch(url);
let get_json_ville =  await get_name_ville.json()
```
## Le lien entre les données
Comme présenté précedemment, il existe un lien évident entre une ville au  États-Unis et l'état dans lequel se situe cette ville. En effet, dans les données économiques/démographiques, le code de l'état de la ville est mentionné. Autrement dit, pour chaque ville que l'on recherche dans l'API des données économiques/démographiques, on récupère également le code de l'état dans lequelle cette ville est située. Inversement, dans cette même api, il est possible d'avoir la liste des villes localisées dans un état.

Cela nous a permit de proposer une première route pour notre API : 
- Les données de covid-19 d'un état donné, accompagnées de la liste des villes de cet état.

De cette manière, on peut regarder les données de manière globale, pour ensuite s'intéresser de près à une ville en particulier si on le désire. C'est justement cela que propose notre seconde route. :
- Les données démographiques/économiques pour une ville dans un état, avec les données de covid de son état.

# Nos routes

## La négociation de contenu
Pour chaque données que nous proposons via notre API, nous avons deux format disponible 
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
La gestion des erreurs a été un point marquant pour notre travail. En effet, avant de la mettre en place, chaque fois que l'on entrait une mauvaise route, l'API chargait indéfiniemment quelque chose qui n'existe pas. Pour palier cela, nous avons construit un filtre qui s'appuie sur les paramètres de ville et etat qui sont demandés. Ce filtre nous permet de savoir si vous entrez un mauvais nom d'état, où un mauvais nom de ville. Dans ce cas, l'API vous le fera savoir et ne mettra pas X temps à charger quelque chose qui n'existe pas.

De même, nous avons également construit une route dans le cas où l'erreur concerne un lien qui n'a aucun rapport avec l'une des routes dont nous avons parlé précedemment. Autrement dit, si un utilisateur demande un accès à des données qui n'existe pas dans nos chemin prédéfini, notre API le fera savoir. Voici un apercu du code de cette route. Dans cet apercu, vous pouvez voir comment nous avons mis en place notre négociation de contenu. Pour chaque route que nous avons, ,ous avons défini un contenu à renvoyer dépendamment des attentes des utilisateurs et/ou des possibilité des navigateurs.

```javascript
app.get(/^.*?(?:\.([^\.\/]+))?$/, function(req, res) {
  req.negotiate(req.params[0], {
        'json;q=0.9': function() {
          res.send({ error: 404, message: 'Not Found' }, 404);
      }
      , 'html;q=1.1,default': function() {
          res.statusCode = 404;
          res.sendFile(__dirname + "/public/index.html")
          alert("Error 404, Not Found")
      }
  });
});
```
## Le fichier de description xml+rdf

### Diagramme de classe
![MCD covid state USA](https://github.com/theo-oriol/coursUM320202021-M2/blob/clem2/rdf/img/MCD%20open%20data%20covid%20USA.png)

### Schéma du vocabulaire RDF
![Vocabulary RDF covid state USA](https://github.com/theo-oriol/coursUM320202021-M2/blob/clem2/rdf/img/RDF%20open%20data%20covid%20USA.png)

# Notre site consommateur de l'Api


- Lien direct vers le site web : https://theo-oriol.github.io/API-access.io/
---
