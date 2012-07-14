class WebLink < ActiveRecord::Base
  has_and_belongs_to_many :roles, :join_table => :roles_web_links
end
