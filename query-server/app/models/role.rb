class Role < ActiveRecord::Base
  has_and_belongs_to_many :users, :join_table => :users_roles
  has_and_belongs_to_many :web_links, :join_table => :roles_web_links
  belongs_to :resource, :polymorphic => true

  attr_accessor :permissions

  def web_link_names
    self.web_links.collect { |t|
      t.description
    }
  end

  def web_link_briefnames
    self.web_links.collect { |t|
      t.name
    }
  end


  def hack_display_name
     self.display_name = web_link_names.join(', ') 
     self.permissions = web_link_briefnames.join(',')
  end

  def as_json(options = {})
    options[:methods] = :permissions;
    super(options)
  end

end
