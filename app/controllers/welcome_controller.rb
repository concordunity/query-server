class WelcomeController < ApplicationController
  skip_before_filter :welcome

  def welcome
    redirect_to '/docview/docview.html' 
    #if user_signed_in?
      #redirect_to '/StockDoc/stock_docs/stock_docs.html'
    #  docview/docview.html' 
    #else
      # redirect_to '/docview/docview.html' 
    #  redirect_to '/StockDoc/stock_docs/login.html'
    #end
  end

  def img
    redirect_to '/root/blank.jpg' 
  end
end
