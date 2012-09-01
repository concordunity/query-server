class User < ActiveRecord::Base
  include Rolify::Roles
  # extend Rolify::Dynamic
  has_and_belongs_to_many :roles, :join_table => :users_roles
  # Include default devise modules. Others available are:
  #:token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :trackable, :validatable, :lockable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :fullname, :username, :password, :password_confirmation,  :last_sign_in_at,  :last_sign_in_ip, :current_sign_in_ip, :roles,  :roles_attributes, :orgs, :doc_type


  def self.find_record(login)
    where(["username = :value OR email = :value", { :value => login }]).first
  end

  def to_json(options = {}, &block)

    if self.class.respond_to?(:api_attributes)
      super(build_serialize_options(options), &block)
    else
      super(options, &block)
    end
  end

  class << self
    attr_reader :api_attributes
    def api_accessible(*args)
      @api_attributes ||= []
      @api_attributes += args
    end
  end

  api_accessible :id, :email, :created_at, :last_sign_in_at,:last_sign_in_ip, :current_sign_in_at, :current_sign_in_ip, :fullname, :username, :orgs, :doc_type, :roles

  def web_links
    if roles.where(:name => 'admin').empty?
       x=[]
       roles.each do |r|
         r.web_links.empty? || x=x+r.web_links
       end
       return x
    else
      return WebLink.all
    end
  end

  def can_inquire?
    web_links.collect { |t|
      t.name
    }.include?('aOperateInvolved')
  end

  def admin?
     return !roles.where(:name => 'admin').empty?
  end

  def display_name
    if fullname.blank?
      return username
    end
    return "#{username}(#{fullname})" 
  end

  def can_view?(doc)
    return check_org?(doc) && check_doc_type?(d.doc_id)
  end

  private

    def check_org?(doc)
      if orgs == '2200'
        return true
      end

      if orgs.blank?
        return false
      end

      #doc_org = doc_id[0,4]
      return !self.orgs.index(doc.org).nil?
    end

    def check_doc_type?(doc_id)
      if doc_type.blank? or doc_type == 0 
        return true
      end
     
      # digit 9 is doc_type, 1 import, 0 export
      t = doc_id[8,1]
      return (doc_type - 1).to_s == t
    end

    def build_serialize_options(options)
      return options if self.class.api_attributes.blank?
      methods = self.class.instance_methods - self.class.attribute_names.map(&:to_sym)
      api_methods = self.class.api_attributes.select { |m| methods.include?(m) }
      api_attrs = self.class.api_attributes - api_methods
      options.merge!(only: api_attrs) if api_attrs.present?
      options.merge!(methods: api_methods) if api_methods.present?
      return options
    end

end
