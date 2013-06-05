require 'rubygems'
require "spreadsheet"
require 'active_record'
require 'activerecord-import'

class DocumentStat < ActiveRecord::Base
	def self.generate_batch
		begin_date = "2012-03-01".to_date
		now = DateTime.now.to_date
		(begin_date .. now).each{|date|
			puts date	
			DocumentStat.generate(date)
		}
	end
	#generate date with everyday .	
	def self.generate(now = Time.now)
		new_record = []
		puts "==== GENRATE START ==== #{now}"
		DocumentStat.transaction do
		result = []
		no_admin = [" user_id not in (1,2,5)"]
		#today
		today = now.to_date
		#end of date
		end_of_date = today
		#begin date
		begin_date = today.prev_day

		condition_date = { :created_at => begin_date .. end_of_date }
		#clear already datas ..
		puts "clear already data at #{begin_date}"
		DocumentStat.delete_all(:created_date => begin_date) 
		#type of doc type .
		doc_type_dirs = [ 'JK', 'CK' ]
		#years of doc type 
		doc_type_years = [ 3, 5, 7, 11 ]
		#orgs
		org_list = DictionaryInfo.select(:dic_num).where(:dic_type => 'org').collect(&:dic_num)
		#each code blok ..
		org_list.each { |org| #2233
			doc_type_dirs.each{ |dir|#JK
				doc_type_years.each{ |year|#3Y
					
					doc_type = "#{dir}#{year}Y"[0,4] #fix a bug .
					#condition
					condition = { :org => org, :doc_type => doc_type }
					#puts condition
					########  BEGIN #########
					#document stats
					documents = Document.where(condition).where(condition_date).order(:org).group(:org)
					documents_added = documents.where(:doc_flag => 0)
					documents_saved = documents.where(:doc_flag => 1)
					#queries ..
					query = QueryHistory.where("doc_id IS NOT NULL").where(condition).where(condition_date).where(no_admin).order(:org).group(:org)
					query_added = query.where(:doc_flag => 0)
					query_saved = query.where(:doc_flag => 1)

					pages =  documents.sum(:pages)
					pages_added =  documents_added.sum(:pages)
					pages_saved =  documents_saved.sum(:pages)

					count_query = query.count
					count_query_saved = query_saved.count
					count_query_added = query_added.count

					count_docs = documents.count
					count_docs_added = documents_added.count
					count_docs_saved = documents_saved.count

					count_pages = documents.sum(:pages)
					count_pages_added = documents_added.sum(:pages)
					count_pages_saved = documents_saved.sum(:pages)
					


					#
					key = org.to_s

					#create a new data ..
					ds = DocumentStat.new do |ds|
						ds.org			= key
						ds.docs			= count_docs[key]
						ds.docs_saved	= count_docs_saved[key]
						ds.docs_added	= count_docs_added[key]
						ds.pages		= count_pages[key]
						ds.pages_saved	= count_pages_saved[key]
						ds.pages_added	= count_pages_added[key]
						ds.query		= count_query[key]
						ds.query_saved	= count_query_saved[key]
						ds.query_added	= count_query_added[key]
#
						ds.year			= begin_date.year
						ds.month		= begin_date.month
						ds.doc_type		= doc_type
						ds.created_date = begin_date
					end
					new_record << ds 
					#=====================================================
					modified =   ModifiedDocument.where( condition ).where(condition_date)
					count_modified = modified.count
					pages_modified = modified.sum(:pages)
					if count_modified > 0 
						DocumentStat.new do |ds|
							ds.org          = "TSP_A" 
							ds.docs         = count_modified
							ds.docs_added   = count_modified
							ds.pages        = pages_modified
							ds.pages_added  = pages_modified

							ds.year         = begin_date.year
							ds.month        = begin_date.month
							ds.doc_type     = doc_type
							ds.created_date = begin_date
							new_record << ds 
						end
					end
					#
					########   END  #########	
				}
			}		

		}
		DocumentStat.import new_record	
		end
		puts "==== GENRATE STOP ==== #{new_record.count}"
		#return { today.strftime("%Y-%m") => ''}
	end
end
