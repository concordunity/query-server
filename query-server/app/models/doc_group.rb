class DocGroup < ActiveRecord::Base
  belongs_to :user
  has_many :doc_group_entries, :dependent => :delete_all

  attr_accessor :doc_ids

  def hack_doc_entries_string
    doc_ids = doc_group_entries.collect { |t|
      t.doc_id
    }
    self.doc_ids = doc_ids.join(' ')
  end

  def as_json(options = {})
    options[:methods] = :doc_ids;
    super(options)
  end
end
