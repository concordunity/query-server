class Document < ActiveRecord::Base
  belongs_to :folder

  attr_accessor :access_info

  def as_json(options = {})
    options[:methods] = :access_info;
    super(options)
  end
end
