class QueryStatus 
  attr_accessor :status, :message, :doc_id, :pages

  def initialize()
    @doc_id= ''
    @pages = -1
  end
end

