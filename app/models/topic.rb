class Topic
  include MongoMapper::Document
  key :name, String
  key :title, String
  key :no, Integer

end
