Bundler.require

require './lib/opentable/client'

class Tasks
  extend GluttonRatelimit
  
  def initialize
    @opentable = OpenTable::Client.new
    @neo = Neography::Rest.new
  end

  def get_factual
    locations = ["NEW YORK","CHICAGO","HOUSTON","LOS ANGELES","BROOKLYN","PHILADELPHIA","LAS VEGAS","SAN FRANCISCO","DALLAS","SAN ANTONIO","PORTLAND","ATLANTA","SAN DIEGO","MIAMI","COLUMBUS","SEATTLE","PHOENIX","WASHINGTON","ORLANDO","AUSTIN","CLEVELAND","BRONX","DENVER","JACKSONVILLE","SPRINGFIELD","PITTSBURGH","INDIANAPOLIS","SAINT LOUIS","TAMPA","BALTIMORE","CHARLOTTE","MINNEAPOLIS","CINCINNATI","LOUISVILLE","RICHMOND","MILWAUKEE","SAN JOSE","ROCHESTER","SACRAMENTO","HONOLULU","ARLINGTON","COLUMBIA","NASHVILLE","FORT WORTH","TUCSON","BOSTON","MEMPHIS","NEW ORLEANS","NEWARK","OKLAHOMA CITY"]
    categories = [312, 313, 314, 315, 316, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368] 

    @factual = Factual.new(ENV["FACTUAL_KEY"] || "3cD9aD6dBumTIHKnfOE3vRXgqQmX3hWzhqKbOhrz", ENV["FACTUAL_SECRET"] || "IEVVBEx8N5hihaBSBSW47yRqZazmg9q49PH4xJdA")

    locations.each do |location|
      categories.each do |category|  
  
        file = "data/factual/#{location}-#{category}.json" 
  
        if File.exist?(file)
          restaurants = JSON.load(File.open(file, 'r'))
        else
          query = @factual.table("restaurants").filters({"locality" => location, "category_ids" => category})
          restaurants = []

          total = query.total_count
          (1..(total/50)).each do |page|
            query.page(page, :per => 50)
            restaurants.push(*get_rows(query))
          end

          File.open(file, 'wb') { |fp| fp.write(restaurants.flatten.to_json) }   
        end
    
      end
    end
  end
  
  def get_rows(query)
    query.rows
  end

  def get_opentable
    locations = ["Arlington", "Atlanta", "Austin", "Baltimore", "Boston", "Bronx", "Brooklyn", "Charlotte", "Chicago", "Cincinnati", "Cleveland", "Columbia", "Columbus", "Dallas", "Denver", "Fort Worth", "Honolulu", "Houston", "Indianapolis", "Jacksonville", "Las Vegas", "Los Angeles", "Louisville", "Memphis", "Miami", "Milwaukee", "Minneapolis", "Nashville", "New Orleans", "New York", "Newark", "Oklahoma City", "Orlando", "Philadelphia", "Phoenix", "Pittsburgh", "Portland", "Richmond", "Rochester", "Sacramento", "Saint Louis", "San Antonio", "San Diego", "San Francisco", "San Jose", "Seattle", "Springfield", "Tampa", "Tucson", "Washington"] 
    
    locations.each do |location|
      file = "data/opentable/#{location}.json" 
      puts file
  
      if File.exist?(file)
        restaurants = JSON.load(File.open(file, 'r'))
      else
        
        data = get_data(location, 1)
        restaurants = []
        restaurants << data["restaurants"]
        if data["total_entries"] > 25
          (2..(data["total_entries"] / 25)).each do |page|
            restaurants << get_data(location, page)["restaurants"]
          end
        end

        File.open(file, 'wb') { |fp| fp.write(restaurants.flatten.to_json) }      
        
      end    
    end
  end

  def get_data(city, page)
    @opentable.restaurants(:city => city, :page => page)
  end

  def combine
    locations = ["Arlington", "Atlanta", "Austin", "Baltimore", "Boston", "Bronx", "Brooklyn", "Charlotte", "Chicago", "Cincinnati", "Cleveland", "Columbia", "Columbus", "Dallas", "Denver", "Fort Worth", "Honolulu", "Houston", "Indianapolis", "Jacksonville", "Las Vegas", "Los Angeles", "Louisville", "Memphis", "Miami", "Milwaukee", "Minneapolis", "Nashville", "New Orleans", "New York", "Newark", "Oklahoma City", "Orlando", "Philadelphia", "Phoenix", "Pittsburgh", "Portland", "Richmond", "Rochester", "Sacramento", "Saint Louis", "San Antonio", "San Diego", "San Francisco", "San Jose", "Seattle", "Springfield", "Tampa", "Tucson", "Washington"] 
    categories = [312, 313, 314, 315, 316, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368] 
    
    locations.each do |location|
      named_restaurants = Hash.new
      file = "data/combined/#{location}.json" 

      categories.each do |category|  
        factual_file = "data/factual/#{location}-#{category}.json" 
        opentable_file = "data/opentable/#{location}.json" 
        puts factual_file
  
        factual_restaurants = JSON.load(File.open(factual_file, 'r'))
        opentable_restaurants = JSON.load(File.open(opentable_file, 'r'))
        
        factual_restaurants.each do |x|
          named_restaurants[x["name"]] = x
        end

        opentable_restaurants.each do |restaurant|
          name = restaurant["name"]
          if named_restaurants[name]
            named_restaurants[name]["reserve_url"] = restaurant["reserve_url"]
          end
        end
        
      end  
      File.open(file, 'wb') { |fp| fp.write(named_restaurants.to_json) }      
    end
  end

  def import
    @neo.create_spatial_index("restaurants", "point", "latitude", "longitude")

    Dir.glob('data/combined/*.json') do |json_file|
      restaurants = JSON.load(File.open(json_file, 'r'))
      queue = []
      counter = 0
      restaurants.each_value do |restaurant|
        next unless restaurant.has_key?("latitude") && restaurant.has_key?("longitude")
        restaurant.delete("category_labels")
        queue << [:create_node, restaurant]          
        queue << [:add_node_to_spatial_index, "restaurants", "{#{counter}}"]
        counter += 2
      end
      puts "File: #{json_file} Restaurants: #{counter/2}"
      @neo.batch *queue  
    end

  end
  
  # Throttle the rate_limit method to 10000 executions every day.
  rate_limit :get_rows, 10000, 86400, GluttonRatelimit::BurstyTokenBucket
  rate_limit :get_data, 1000, 3600, GluttonRatelimit::BurstyTokenBucket

end