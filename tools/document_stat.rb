class DocumentStat < ActiveRecord::Base

	#generate date with everyday .	
	def self.test_generate
		now = Time.now - 30.day 
		p now
		p '======start===='		
=begin
		ds = DocumentStat.find 2694
		ds.docs = rand(5)
		ds.save
=end
		result = []
		#today
		today = now.to_date
		#end of date
		end_of_date = today
		#begin date
		begin_date = today - 1.day
		#type of doc type .
		doc_type_dirs = [ 'JK', 'CK' ]
		#years of doc type 
		doc_type_years = [ 3, 5, 7, 11 ]
		#orgs
		org_list = DictionaryInfo.select(:dic_num).where(:dic_type => 'org').collect(&:dic_num)
		#query total
		query_total = QueryHistory.where("doc_id IS NOT NULL").count
		#each code blok ..
		org_list.each { |org| #2233
			doc_type_dirs.each{ |dir|#JK
				doc_type_years.each{ |year|#3Y
					
					doc_type = "#{dir}#{year}Y"
					#condition
					condition = { :created_at => begin_date .. end_of_date, :org => org, :doc_type => doc_type }
					#puts condition
					########  BEGIN #########
					#document stats
					documents = Document.where(condition).order(:org).group(:org)
					#queries ..
					queries = QueryHistory.where("doc_id IS NOT NULL").where(condition).order(:org).group(:org)
					query_stats = queries.count
					docs_stats = documents.count
					pages_stats = documents.sum(:pages)
					
					keys = Set.new	
					keys.merge(docs_stats.keys)
					keys.merge(pages_stats.keys)
					keys.merge(query_stats.keys)
					#
					arr =  keys.collect { |key| {
						:org		=> key,
						:docs		=> docs_stats.has_key?(key)  ? docs_stats[key]  : '',
						:pages		=> pages_stats.has_key?(key) ? pages_stats[key] : '',
						:queries	=> query_stats.has_key?(key) ? query_stats[key] : ''
						#:percent_q	=> query_stats.has_key?(key) ? (query_total == 0 ?
						#			0
						#			:
						#			((query_stats[key] * 1.0) / query_total) * 100.0#calc percent %
						#		) : ''
						}
					} 
					#has a key , and arr set not is empty .	
					if arr.length > 0
						result.push arr
						arr.each{ |ar|
							#clear already datas ..
							DocumentStat.delete_all(:created_date => begin_date) 
							#create a new data ..
							document_stat = DocumentStat.new(ar)
							document_stat[:created_date] = begin_date
							document_stat[:doc_type] = doc_type
							document_stat[:year] = begin_date.year
							document_stat[:month] = begin_date.month
							document_stat.save
						}
					end
					########   END  #########	
				}
			}		
		}
		p '======end===='		
		return { today.strftime("%Y-%m") => result }
	end
end
DocumentStat.test_generate
