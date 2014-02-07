require 'bundler'
Bundler.require(:default, (ENV["RACK_ENV"]|| 'development').to_sym)

$neo = Neography::Rest.new

class App < Sinatra::Base
  configure :development do |config|
    register Sinatra::Reloader
  end
  
  set :app_file, __FILE__
  set :slim, :pretty => true

  post '/search' do
    puts params.inspect
    latitude = params[:latitude] || 41.8819
    longitude = params[:longitude] || -87.6278
    distance = params[:distance] || 10.0
    cypher = "start n = node:restaurants({location}) return n limit 25"
    location = {:location => "withinDistance:[#{latitude},#{longitude},#{distance}]"}
    restaurants = $neo.execute_query(cypher, location)["data"]
    @results = []
    restaurants.each do |r|        
      restaurant = r[0]["data"]
      @results << { :pic => pic(restaurant["cuisine"]), :cuisine => Array(restaurant["cuisine"]).join(", "), :name => restaurant["name"], :address => restaurant["address"], :rating => (restaurant["rating"] || -1), :price => (restaurant["price"] || -1) }
    end
    slim :index, :layout => false
  end

  get '/' do
    @active= ["empty neighbour-left", "first active", "neighbour-right","","","","","last","empty"]
    @results = []
    slim :index
  end

  get '/neo4j' do
    @active= ["empty", "first neighbour-left", "active", "neighbour-right","","","","last","empty"]
    slim :neo4j, :layout => :nomap
  end

  get '/factual' do
    @active= ["empty", "first", "neighbour-left", "active", "neighbour-right","","","last","empty"]
    slim :factual, :layout => :nomap
  end

  get '/open_table' do
    @active= ["empty", "first", "", "neighbour-left", "active", "neighbour-right", "last", "", "empty"]
    slim :open_table, :layout => :nomap
  end

  get '/food_genius' do
    @active= ["empty", "first", "", "", "neighbour-left", "active", "neighbour-right", "last", "empty"]
    slim :food_genius, :layout => :nomap
  end

  helpers do
    def pic(cuisines)      
      translation = {
        "Deli" => "sandwich",
        "Indian" => "tomato_soup",
        "Burgers" => "hamburger",
        "Seafood" => "grilled_fish",
        "Pizza" => "pizza",
        "Bagels" => "cappucino", 
        "American" => "hamburger",
        "Cafe" => "cappucino",
        "Mexican" => "omlette", 
        "Italian" => "pizza",
        "Pub Food" => "hot_dog",
        "Asian" => "sugar",
        "Contemporary" => "grilled_fish",
        "Grill" => "beef",
        "Eastern European" => "brioche",
        "Ice Cream" => "ice_cream", 
        "Japanese" => "baked_salmon",
        "Middle Eastern" => "kebab",
        "Sandwiches" => "sandwich",
        "Salad" => "salad",
        "European" => "croissant",
        "Sushi" => "baked_salmon",
        "Latin American" => "banana",
        "Tapas" => "omlette",
        "Barbecue" => "beef",
        "Diner" => "chicken_roast", 
        "Thai" => "soup", 
        "Latin" => "banana", 
        "Southern" => "fried_chicken", 
        "Frozen Yogurt" => "ice_cream",
        "Tex Mex" => "omlette", 
        "Pan Asian" => "sugar",
        "Chinese" => "roasted_duck", 
        "Coffee" => "cappucino", 
        "Tea" => "tea_bag", 
        "Steak" => "beef", 
        "Bistro" => "sandwich", 
        "Polish" => "sausage", 
        "Traditional" => "roasted_turkey", 
        "Southwestern" => "red_bell_pepper", 
        "Soup" => "tomato_soup", 
        "Vegetarian" => "salad", 
        "Israeli" => "oat_meal", 
        "Lebanese" => "kebab", 
        "Mediterranean" => "grapes", 
        "Eclectic" => "cocktail",
        "Donuts" => "cappucino"
        }
        
        picture = translation[cuisines.nil? ? "Bistro" : cuisines.first]
        picture ||= "sandwich"

        "/images/food/bigger/#{picture}_128.png"
    end

  end

end