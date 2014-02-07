# NomNomNom

See live example at  [nomnomnom.us](http://nomnomnom.us).

# Instructions

You will need to get a Factual.com Key and Secret.
[Factual](http://factual.com) Credentials

Data is limited to a sample of US Restaurants.

## Installation

````ruby
rake neo4j:install
rake neo4j:get_spatial
rake neo4j:start
rake neo4j:get_factual
rake neo4j:get_opentable
rake neo4j:combine
rake neo4j:import
rackup
````

Now take a look at your website on [localhost:9292](localhost:9292)