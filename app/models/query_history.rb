class QueryHistory < ActiveRecord::Base
  belongs_to :user

  scope :in, lambda { |period|    {
    :conditions => {:created_at => TimeRanges[period].call}  
    }
  }

end
