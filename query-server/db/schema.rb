# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120702091716) do

  create_table "doc_group_entries", :force => true do |t|
    t.string   "doc_id"
    t.integer  "doc_group_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "doc_group_entries", ["doc_group_id"], :name => "index_doc_group_entries_on_doc_group_id"

  create_table "doc_groups", :force => true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "doc_groups", ["name"], :name => "index_doc_groups_on_name", :unique => true
  add_index "doc_groups", ["user_id"], :name => "index_doc_groups_on_user_id"

  create_table "document_histories", :force => true do |t|
    t.string   "doc_id"
    t.string   "action"
    t.string   "email"
    t.string   "ip"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "document_pages", :force => true do |t|
    t.string   "doc_id"
    t.string   "paget"
    t.string   "org"
    t.integer  "doc_type"
    t.integer  "year"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "document_pages", ["doc_id", "paget"], :name => "index_document_pages_on_doc_id_and_paget", :unique => true

  create_table "documents", :force => true do |t|
    t.string   "doc_id"
    t.integer  "pages"
    t.integer  "folder_id"
    t.string   "doc_type"
    t.string   "org"
    t.string   "org_applied"
    t.boolean  "modified"
    t.boolean  "checkedout"
    t.boolean  "inquired"
    t.string   "label"
    t.string   "serial_number"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.date     "edc_date"
    t.integer  "doc_source"
    t.integer  "phase"
  end

  add_index "documents", ["doc_id"], :name => "index_documents_on_doc_id", :unique => true
  add_index "documents", ["doc_source"], :name => "index_documents_on_doc_source"
  add_index "documents", ["folder_id"], :name => "index_documents_on_folder_id"
  add_index "documents", ["phase"], :name => "index_documents_on_phase"

  create_table "folders", :force => true do |t|
    t.string   "folder_id"
    t.string   "doc_type"
    t.string   "org"
    t.string   "box"
    t.string   "serial_number"
    t.date     "edc_date"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "folders", ["folder_id"], :name => "index_folders_on_folder_id", :unique => true

  create_table "modified_documents", :force => true do |t|
    t.string   "doc_id"
    t.integer  "pages"
    t.integer  "folder_id"
    t.integer  "phase"
    t.string   "doc_type"
    t.string   "org"
    t.string   "org_applied"
    t.string   "label"
    t.string   "serial_number"
    t.date     "edc_date"
    t.integer  "mtype"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "modified_documents", ["folder_id"], :name => "index_modified_documents_on_folder_id"

  create_table "monitoring_data", :force => true do |t|
    t.string   "host"
    t.string   "varname"
    t.integer  "ts"
    t.float    "value"
    t.string   "labels"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "monitoring_data", ["host"], :name => "index_monitoring_data_on_host"
  add_index "monitoring_data", ["varname"], :name => "index_monitoring_data_on_varname"

  create_table "query_histories", :force => true do |t|
    t.integer  "user_id"
    t.string   "doc_id"
    t.string   "org"
    t.string   "doc_type"
    t.string   "ip"
    t.boolean  "print"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "email"
    t.text     "bulkids"
  end

  add_index "query_histories", ["doc_id"], :name => "index_query_histories_on_doc_id"
  add_index "query_histories", ["user_id"], :name => "index_query_histories_on_user_id"

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.string   "display_name"
    t.text     "description"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "roles", ["name", "resource_type", "resource_id"], :name => "index_roles_on_name_and_resource_type_and_resource_id"
  add_index "roles", ["name"], :name => "index_roles_on_name", :unique => true

  create_table "roles_web_links", :id => false, :force => true do |t|
    t.integer "role_id"
    t.integer "web_link_id"
  end

  add_index "roles_web_links", ["role_id", "web_link_id"], :name => "index_roles_web_links_on_role_id_and_web_link_id"

  create_table "sources", :force => true do |t|
    t.string   "code"
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "special_documents", :force => true do |t|
    t.string   "doc_id"
    t.integer  "pages"
    t.integer  "folder_id"
    t.string   "doc_type"
    t.string   "label"
    t.string   "serial_number"
    t.date     "edc_date"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.integer  "phase"
  end

  add_index "special_documents", ["folder_id"], :name => "index_special_documents_on_folder_id"

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "username",               :default => "", :null => false
    t.string   "fullname",               :default => "", :null => false
    t.string   "orgs",                   :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.integer  "doc_type",               :default => 0,  :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.integer  "failed_attempts",        :default => 0
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["username"], :name => "index_users_on_username", :unique => true

  create_table "users_roles", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  add_index "users_roles", ["user_id", "role_id"], :name => "index_users_roles_on_user_id_and_role_id"

  create_table "web_links", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "menu1"
    t.string   "menu2"
    t.string   "controller"
    t.string   "action"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "web_links", ["name"], :name => "index_web_links_on_name", :unique => true

end
