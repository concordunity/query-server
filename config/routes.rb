Dms::Application.routes.draw do

  get "/documents/test" => "documents#index_paging"
  get "/requisition_print" =>  "requisition#print"
  get "/filter_docs" => "requisition#filter_docs"
  post "/requisitions" => "requisition#create_requisition"
  post "/lending_statistics_list" => "requisition#lending_statistics_list"
  get "/requisitions" => "requisition#requisitions"
  post "/requisitions/change_status" => "requisition#change_status"
  post "/find_log" => "settings#find_log"

  post "/system_log" => "settings#system_log"
  post "/query_log" => "settings#query_log"
  post "/document_log" => "settings#document_log"

  post "/admin/import_dictionary" => "dictionary_info#import_dictionary"

  get "/admin/dictionary" => "admin#dictionary"
  get "dictionary_info/update_dictionary" => "dictionary_info#update_dictionary"
  get "dictionary_info/get_dictionary" => "dictionary_info#get_dictionary"

  post "/documents/all_print_doc" => "documents#all_print_doc"
  post "/documents/all_print" => "documents#all_print"

  get '/find_doc_comments' => 'comments#find_doc_commit'

  get 'set_dialog' => 'settings#set_dialog'

  get 'get_dialog' => 'settings#get_dialog'

  get "/admin/show_docs" => "admin#show_docs"

  post "/comments/commit" => "comments#commit"
  post "/comments/pagetype" => "comments#create_page_type"
  post "/comments/delete_pagetype" => "comments#delete_page_type"
  get "/comments/get" => "comments#get"


  post "/admin/system" => "admin#upload_package_system"

  get "/admin/log_index" => "admin#log_index"

  get "/admin/clear_log" => "admin#clear_log"

  get "/admin/download_log" => "admin#download_log"

  post "/admin/change_password" => "admin#change_password"

  get "/admin/update_password" => "admin#update_password"
  
  get "admin/update_system" => "admin#update_system"

  resources :admin

  post '/upload_user' => "upload_file#system_upload"

  get "/get_son_table" => "search_condition#get_son_table"

  get "/search_condition" => "search_condition#search_condition"

  resources :normal_import_price_less_records

  post "/upload_file" => "upload_file#import_excel"

  resources :zero_find_check_infos

  resources :import_most_time_org_doc_infos

  post "/search_result/excle" => "operate_data#export_search"
  post "/status/zip_files" => "queries_controller#zip_files_status"

  post "/generateExcel" => "operate_data#export_data"

  post "/settings/update" => "settings#sys_setting"
  get "/settings" => "settings#index"

  post "/users/isLocked" => "accounts#isUserLocked"
  #resources :document_histories
  post "/exportChart" => "monitoring_data#exportToPNG"

  #  devise_for :users #, :controllers => { :sessions => "test/sessions",
  #  :registration => "test/registrations" },

  match "/print/printpdf" => "documents#print_doc"
  post "/documents/pending_modified" => "documents#stats_export"
  post "/monitoring/query" => "monitoring_data#get_json"
  post "/monitoring/query_util" => "monitoring_data#get_util"

  devise_for :users, :path_names => { :sign_in => 'login', :sign_out => 'logout' }

  resources :query_histories

  resources :special_documents
  resources :modified_documents
  resources :doc_groups

  #resources :document_histories do
  #  collection do
  #    get 'dh_report'
  #  end
  #end

  resources :documents do
    collection do
      post 'multi_query'
      post 'search_docs'
      post 'by_doc_source'
      post 'inquire'
      post 'checkout'
    end
  end

  resources :folders

  resources :web_links

  resources :roles

  #resources :users do
  #  member do
  #    get 'get_links'
  #    post 'newuser'
  #  end
  #end


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  #match "/docs/testify/:doc_id" => "documents#testify", :constraints => { :doc_id => /\d{18}/ }
  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  get "/a" => "welcome#login_admin"
  root :to => 'welcome#welcome'

  match "/api/query" => "queries#api_query", :via => :post
  match "/api/query_status" => "queries#api_get_status", :via => :post

  match "/docs/:doc_id" => "documents#query", :constraints => { :doc_id => /\d{18}/ } 
  match "/special_docs/:doc_id" => "modified_documents#query", :constraints => { :doc_id => /\d{18}/ } 
  match "/api/docs/:doc_id" => "documents#api_query", :constraints => { :doc_id => /\d{18}/ } 

#  match "/docs/print/:doc_id" => "documents#print", :constraints => { :doc_id => /\d{18}/ }
#  match "/docs/testify/:doc_id" => "documents#testify", :constraints => { :doc_id => /\d{18}/ }

  match "/docs/print" => "documents#print"
  match "/docs/testify" => "documents#testify"
  #match "/docs/:tmp_folder/:doc_id" => "documents#print", :constraints => { :doc_id => /\d{18}/ }

  match "/root/docimages/:a/:b/" => "welcome#img"
  post "/qh/u" => "query_histories#byuser"
  match "/qh/d/:doc_id" => "query_histories#bydoc"
  match "/qh_all" => "query_histories#show_all"

  get "/qh/quota" => "query_histories#over_quota"

#forexmple route
  post "/qh/query_search" => "query_histories#search"
  post "/dh/query_search" => "document_histories#search"

  get "/doc_source/all" => "documents#list_doc_sources"

  #match "/doc_groups/create_group" => "doc_groups#create_group", :via => :GET
  #match "/doc_groups/create_group" => "doc_groups#create_group", :via => :post
  #match "/doc_groups/:gid" => "doc_groups#delete", :via => :delete
  #match "/doc_groups/:gid" => "doc_groups#update", :via => :put

  post "/document_histories/dh_report" => "document_histories#dh_report"
  match "/document_histories/dh_special" => "document_histories#dh_special"

  #match "/document_histories/query/:doc_id" => "document_histories#query_by_group"
  match "/document_histories/query/:gid" => "query_histories#query_by_group"

  match "/accounts" => "accounts#index", :via => :get
  match "/accounts" => "accounts#newuser", :via => :post
  match "/accounts/:id" => "accounts#update", :via => :put
  match "/accounts/:id" => "accounts#destroy", :via => :delete
  match "/accounts/get_links" => "accounts#get_links"
  match "/accounts/chpwd" => "accounts#change_password", :via => :post

  post "/accounts/roles/edit/:id" => "roles#update_role"
  #match "/roles" => "roles#index"
  #match "/roles(.:format)" => "roles#create", :via => :post
  #match "/roles/:id(.:format)" => "roles#update", :via => :put

  #match "/roles/:id" => "roles#get"
  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
