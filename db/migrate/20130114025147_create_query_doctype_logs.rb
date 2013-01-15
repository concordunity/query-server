class CreateQueryDoctypeLogs < ActiveRecord::Migration
  def change
    create_table :query_doctype_logs do |t|
      t.string	:user_id	  
      t.string	:role_id
	  t.integer	:doc_id
	  t.string	:org
	  t.string	:doc_type
	  t.string	:ip
	  t.string	:email
	  t.string	:user_name
	  t.string	:role_name
	  t.string	:action
	  t.string	:describe
	  t.boolean	:status


      t.timestamps
    end
  end
end
