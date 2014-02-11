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
    latitude = params[:latitude] || 41.8819
    longitude = params[:longitude] || -87.6278
    distance = params[:distance] || 10.0
    what = case params[:what]
             when "lunch"
               " AND n.meal_lunch = true "
             when "dinner"
               " AND n.meal_dinner = true "            
             when "drinks"
               " AND n.alcohol_bar = true "            
             else
               " "
             end
    good = case params[:good]
            when "kids"
              " AND n.kids_goodfor = true "
            when "groups"
              " AND n.groups_goodfor = true "
            when "diet"
              " AND n.options_healthy = true "
            when "vegans"
              " AND n.options_vegan = true "
            when "vegetarians"
              " AND n.options_vegetarian = true "
            when "smokers"
              " AND n.smoking = true"
            when "wheelchair"
              " AND n.accessible_wheelchair = true"
            else
              " "      
            end
    alcohol = case params[:alcohol]
                when "alcohol"
                  " AND n.alcohol = true "
                when "bar"  
                  " AND n.alcohol_bar = true "                  
                when "beer_and_wine"
                  " AND n.alcohol_beer_wine = true "
                when "byob"
                  " AND n.alcohol_byob = true "
                else
                  " "
                end
    price = params[:price] || 5
    rating = params[:rating] || 0
    cypher = "START n = node:restaurants({location}) 
              WHERE n.price <= {price} 
                AND n.rating >= {rating}
                #{what}
                #{good}
                #{alcohol}
              RETURN n LIMIT 25"
    location = {:location => "withinDistance:[#{latitude},#{longitude},#{distance}]", :price => price.to_i, :rating => rating.to_i}
    restaurants = $neo.execute_query(cypher, location)["data"]
    @results = []
    restaurants.each do |r|        
      restaurant = r[0]["data"]
      node_id = r[0]["self"].split("/").last
      @results << { :pic => "/images/food/bigger/#{pick(restaurant["cuisine"])}_128.png", 
                    :cuisine => Array(restaurant["cuisine"]).join(", "), 
                    :name => restaurant["name"], 
                    :address => restaurant["address"], 
                    :rating => (restaurant["rating"] || -1), 
                    :price => (restaurant["price"] || -1),
                    :latitude => restaurant["latitude"],
                    :longitude => restaurant["longitude"],
                    :group => pick(restaurant["cuisine"]),
                    :node_id => node_id }
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


  get '/restaurant' do
    @active= ["empty neighbour-left", "first active", "neighbour-right","","","","","last","empty"]
    cypher = "start n = node({id}) return n"
    id = {:id => params[:id].to_i }
    @restaurant = $neo.execute_query(cypher, id)["data"][0][0]["data"]
    @options = []
    @options << "Vegetarian" if @restaurant["options_vegetarian"]
    @options << "Vegan" if @restaurant["options_vegan"]
    @options << "Wheelchair Accessible" if @restaurant["accessible_wheelchair"]
    @options << "Healhty Options" if @restaurant["options_healthy"]
    @options << "Private Rooms" if @restaurant["room_private"]
    @options << "Good for Kids" if @restaurant["kids_goodfor"]
    @options << "Outdoor Seating" if @restaurant["seating_outdoor"]
    @options << "Good for Groups" if @restaurant["groups_goodfor"]
    @options << "Serves Alcohol" if @restaurant["alcohol"]
    
    slim :restaurant, :layout => :nomap
  end


  helpers do
    def pick(cuisines)      
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
        picture
    end

  end

end