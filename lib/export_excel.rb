module ExportExcel

  def test_model
		logger.info "@@@@@ test loger.info@@@@@"
  end

  #çæexcel
  def all_export_excel(export_data,params)
#		logger.info "@@@@@loger.info@@@@@"
#		Rails.logger.info "@@@@Rails.logger.info@@@@@@"
#		Rails.logger.info export_data 
#		Rails.logger.info params 

    title = params[:tableHeader]
    titleColumn = params[:tableTitle]

    if  params[:tableFile].nil? ||  params[:tableFile] == ""
   	  excel_name = "excel"
    else
	 		excel_name = params[:tableFile]
    end

    new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
    Dir.mkdir(new_path) unless Dir.exists?(new_path)
    book = new_excel(excel_name)
    book_excel = book[0]
    book_sheet = book[1]
    sing_sheet = []
    sing_sheet << title
    export_data.each_with_index do |item_arr,index|
      tmp_row = []      
#			Rails.logger.info titleColumn 
      titleColumn.each do |column|
				
#				Rails.logger.info "####item arr######"
#				Rails.logger.info item_arr.to_json
#				Rails.logger.info "####column######"
#				Rails.logger.info column 

        tmp_row << item_arr[column]
      end unless item_arr.nil?
      sing_sheet << tmp_row
    end unless export_data.nil?

    count = -1
    sing_sheet.each_with_index do |new_sheet,index|
      book_sheet.insert_row(count+1,new_sheet)
      count += 1
    end
    file_name = File.join(new_path , excel_name + ".xls")
    book_excel.write(file_name)

    file_name = file_name.sub(File.join(Rails.root,"public"),'')
    return file_name

  end
  
  def all_filter_proc(source,params=nil) 
    #å­æ®µæ°é
    column_count = params[:iColumns]
    #æåºçä¸æ 
    iSortCol_0 = params[:iSortCol_0]	  
    #æåºçæ¹å¼
    sSortDir_0 = params[:sSortDir_0]	  
    #æç´¢åå®¹
    sSearch = params[:sSearch]
    #æåºçå­æ®µ
    mDataPro = params["mDataProp_" + iSortCol_0]
    logger.info "we are searching for #{sSearch}, then we may sort columns by #{mDataPro} #{sSortDir_0}"
    condition_arr = [] 
    if sSearch.blank?
      condition_arr << "true"
    else
      (0 ... column_count.to_i - 1).each do |cc|
        condition_arr << "#{ params["mDataProp_" + cc.to_s]} like '%#{sSearch}%'"
      end
    end
    logger.info "================" 
    logger.info condition_arr 
    logger.info "=======1=#{mDataPro} #{sSortDir_0}"	
    orders = "#{mDataPro} #{sSortDir_0}"
    logger.info "=======0=#{orders}"	
    current_page = (params[:iDisplayStart].to_i / params[:iDisplayLength].to_i rescue 0) + 1
    condition = {:orders =>orders,:where=>condition_arr.join(" OR "),:page=> current_page,:per_page => params[:iDisplayLength],:sEcho => params[:sEcho].to_i }
    logger.info "=======1=#{condition[:orders]}"	
    if  source.blank?
      result = []
      source = []
    else
      result = source.where(condition[:where]).reorder(condition[:orders])
    end
    return { sEcho: params[:sEcho].to_i, iTotalRecords: source.count, iTotalDisplayRecords: result.count, aaData: result}
  end 

  #åå»ºsheet
  def new_sheet(book,name)
    sheet = book.create_worksheet :name => name
    return sheet
  end

  #åå»ºexcel
  def new_excel(name)
    Spreadsheet.client_encoding = "UTF-8"
    book = Spreadsheet::Workbook.new
    bold_heading = Spreadsheet::Format.new(:weight => :bold, :align => :merge)
    return [book,new_sheet(book,name),bold_heading]
  end


  def filter_html_tags(str)
    if str.nil?
      return ""
    end
    if str.class == Fixnum
      return str
    end
    str = str.gsub(/\n/, ' ');
    # filter out <span> tag
    str = str.gsub(/\<span.*?\>\s*(.*?)\s*\<\/span\>/i, '\1')
    return str.strip
  end
end
