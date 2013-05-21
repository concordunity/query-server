# -*- coding: utf-8 -*-
namespace :update_for_tables do

  desc 'update web_link number'
  task :update_web_link_number => :environment do
	filepath = File.join(Rails.root,"doc","webmenu.xls")	
    book,sheet = open_excel(filepath)
	sheet.each_with_index do |row,index|
		if !row[0].blank?
			wl = WebLink.find_by_name(row[0])
			wl.menu_one = row[1]
			wl.menu_two = row[2]
			wl.save
		end
	end
  end

  desc "update excel requisition'table by excel model"
  task :export_requisition => :environment do
	rd = Requisition.find(22)
	rdd = rd.requisition_details
	filepath = File.join(Rails.root,"doc","requisition.xls")	
    book,sheet = open_excel(filepath)
	sheet.each_with_index do |row,index|
		row.each_with_index do |column,j|
			case row[j]
			when "[A1]"
				#单位名称
				department_name = rd.department_name.nil? ? "" : rd.department_name
				if rd.org.nil? 
					org = ""
				else
					di = DictionaryInfo.find_by_dic_type_and_dic_num("org",rd.org)
					org = di.dic_name 
				end 
				row[j] = org.to_s + department_name
			when "[A2]"
				#经办关员
				if rd.apply_staff.nil?
					row[j] = "" 
				else
					user = User.find_by_username(rd.apply_staff)
					row[j] = user.nil? ? "" : user.fullname
				end
			when "[A3]"
				#日期
				row[j] = rd.created_at.nil? ? "" : rd.created_at.to_s(:db)
			when "[A4]"
				#联系电话
				row[j] = rd.tel.nil? ? "" : rd.tel
			when "[B1]"
				#报关单号1
				row[j] = rdd[0].nil? ? "" : rdd[0].single_card_number
			when "[B2]"
				#报关单号2
				row[j] = rdd[1].nil? ? "" : rdd[1].single_card_number
			when "[B3]"
				#报关单号3
				row[j] = rdd[2].nil? ? "" : rdd[2].single_card_number
			when "[C1]"
				#随附单证名称1
				row[j] = (!rdd[0].nil? && !rdd[0].modify_accompanying_documents.nil?) ? rdd[0].modify_accompanying_documents : ""
			when "[C2]"
				#随附单证名称2
				row[j] = (!rdd[1].nil? && !rdd[1].modify_accompanying_documents.nil?) ? rdd[1].modify_accompanying_documents : ""

			when "[C3]"
				#随附单证名称3
				row[j] = (!rdd[2].nil? && !rdd[2].modify_accompanying_documents.nil?) ? rdd[2].modify_accompanying_documents : ""

			when "[D1]"
				#所在页1
				row[j] = (!rdd[0].nil? && !rdd[0].where_page.nil?) ? rdd[0].where_page : ""

			when "[D2]"
				#所在页2
				row[j] = (!rdd[1].nil? && !rdd[1].where_page.nil?) ? rdd[1].where_page : ""

			when "[D3]"
				#所在页3
				row[j] = (!rdd[2].nil? && !rdd[2].where_page.nil?) ? rdd[2].where_page : ""

			when "[E1]"
				#借出原因1
				row[j] = (!rdd[0].nil? && !rdd[0].lent_reasons.nil?) ? rdd[0].lent_reasons : ""

			when "[E2]"
				#借出原因2
				row[j] = (!rdd[1].nil? && !rdd[1].lent_reasons.nil?) ? rdd[1].lent_reasons : ""

			when "[E3]"
				#借出原因3
				row[j] = (!rdd[2].nil? && !rdd[2].lent_reasons.nil?) ? rdd[2].lent_reasons : ""

			when "[F1]"
				#审批科长
				if rd.approving_officer.nil?
					row[j] = "" 
				else
					user = User.find_by_username(rd.approving_officer)
					row[j] = user.nil? ? "" : user.fullname
				end

			when "[F2]"
				#审批日期
				row[j] = rd.approval_time.nil? ? "" : rd.approval_time.to_s(:db)

			when "[H1]"
				#档案库经办人
				if rd.registration_staff.nil?
					row[j] = "" 
				else
					user = User.find_by_username(rd.registration_staff)
					row[j] = user.nil? ? "" : user.fullname
				end

			when "[H2]"
				#实际抽单日期
				row[j] = rd.check_in_time.nil? ? "" : rd.check_in_time.to_s(:db)
			end	
		end	
	end
	newfilepath = File.join(Rails.root,"doc","new_requisition.xls")	
	book.write(newfilepath)	
  end

  desc "update data org_for_doc'table by importting excel file"
  task :update_data => :environment do
	filepath = File.join(Rails.root,"doc","org_for_doc.xls")	
    book,sheet = open_excel(filepath)
	sheet.each_with_index do |row,index|
		org_number = ("%02d"%row[0].to_i)
		org = ("%04d"%row[2].to_i)
		@ofd = OrgForDoc.where(:org_number => org_number).first
		if @ofd.nil?
			OrgForDoc.create(:org_number => org_number, :org_name => row[1], :org => org)
		else
			@ofd.org_name = row[1].to_s
			@ofd.org = org 
			@ofd.save
		end
    end
  end
  
  # open excel and return sheet(打开excel文件，返回sheet)
  def open_excel url
    filepath = url
    Spreadsheet.client_encoding = "UTF-8"
    begin
      book = Spreadsheet.open filepath
      sheet = book.worksheet 0
      return [book,sheet]
    rescue
      return nil
    end
  end

  # write data to excel
  def export_excel(excel_data,excel_name) 
    new_path = File.join(Rails.root,"public","docview","export_data", Time.now.to_i.to_s)
    Dir.mkdir(new_path) unless Dir.exists?(new_path)
    book = new_excel(excel_name)
    book_excel = book[0]
    book_sheet = book[1]

    count = -1
    excel_data.each_with_index do |new_sheet,index|
      book_sheet.insert_row(count+1,new_sheet)
      count += 1
    end
    file_name = File.join(new_path , excel_name + ".xls")
    book_excel.write(file_name)

  end

  #创建sheet
  def new_sheet(book,name)
    sheet = book.create_worksheet :name => name
    return sheet
  end

  #创建excel
  def new_excel(name)
    Spreadsheet.client_encoding = "UTF-8"
    book = Spreadsheet::Workbook.new
    bold_heading = Spreadsheet::Format.new(:weight => :bold, :align => :merge)
    return [book,new_sheet(book,name),bold_heading]
  end
end
